/**
 * Serviços de Reservas (Reservations)
 * CRUD e subscriptions para reservas de hóspedes
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getDocsFromServer,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    QueryDocumentSnapshot,
    DocumentData,
    deleteField,
    runTransaction,
} from 'firebase/firestore';
import { getFirestoreInstance, cleanData, getFirebaseAuth } from './config'; // Import auth
import { Reservation } from '../../types';
import { logger } from '../../utils/logger';
import { generateShortId } from '../../utils/helpers';
import { mapFirestoreDocs } from './mappers';
import { logAction } from './logs'; // Import logAction

/** Converte null → deleteField(); remove undefined em qualquer nível de profundidade */
const prepareReservationUpdate = (data: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    Object.keys(data).forEach((key) => {
        const val = data[key];
        if (val === undefined) return;
        if (val === null) {
            out[key] = deleteField();
        } else if (typeof val === 'object' && val !== null) {
            out[key] = cleanData(val as object);
        } else {
            out[key] = val;
        }
    });
    return out;
};

export const saveReservation = async (reservation: Reservation): Promise<string> => {
    const data = {
        ...reservation,
        shortId: reservation.shortId || generateShortId(),
        createdAt: new Date().toISOString(),
        status: reservation.status || 'active',
    };
    const db = await getFirestoreInstance();
    let reservationId: string;

    if (reservation.billingMode === 'corporate' && reservation.allocationId) {
        const legacy = await getDocs(
            query(
                collection(db, 'reservations'),
                where('allocationId', '==', reservation.allocationId),
                limit(1)
            )
        );
        if (!legacy.empty) {
            throw new Error('Esta alocação já possui uma reserva vinculada');
        }

        const corporateRef = doc(db, 'reservations', `corporate_${reservation.allocationId}`);
        await runTransaction(db, async (transaction) => {
            const existing = await transaction.get(corporateRef);
            if (existing.exists()) {
                throw new Error('Esta alocação já possui uma reserva vinculada');
            }
            transaction.set(corporateRef, cleanData(data));
        });
        reservationId = corporateRef.id;
    } else {
        const docRef = await addDoc(collection(db, 'reservations'), cleanData(data));
        reservationId = docRef.id;
    }

    // Log Action
    const auth = await getFirebaseAuth();
    const userEmail = auth?.currentUser?.email || 'admin';
    await logAction(
        'create',
        userEmail,
        `Nova reserva para ${reservation.guestName}`,
        reservationId,
        reservation.guestName
    );

    return reservationId;
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
    try {
        const db = await getFirestoreInstance();
        const docSnap = await getDoc(doc(db, 'reservations', id));
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...(docSnap.data() as Record<string, unknown>),
            } as Reservation;
        }
        return null;
    } catch (_error) {
        return null;
    }
};

export const updateReservation = async (id: string, data: Partial<Reservation>) => {
    // Não sobrescrever id/createdAt; null remove o campo no Firestore
    const { id: _discard, createdAt: _createdAt, ...rest } = data as Record<string, unknown>;
    const updateData = prepareReservationUpdate(rest);
    const db = await getFirestoreInstance();
    await updateDoc(doc(db, 'reservations', id), updateData);

    // Log Action
    const auth = await getFirebaseAuth();
    const userEmail = auth?.currentUser?.email || 'admin';
    const guestName = data.guestName ? data.guestName : 'Reserva';
    await logAction('update', userEmail, `Reserva atualizada`, id, guestName);

    return true;
};

export const deleteReservation = async (id: string) => {
    const db = await getFirestoreInstance();
    await deleteDoc(doc(db, 'reservations', id));

    // Log Action
    const auth = await getFirebaseAuth();
    const userEmail = auth?.currentUser?.email || 'admin';
    await logAction('delete', userEmail, `Reserva excluída`, id, 'Reserva');
};

export const subscribeToSingleReservation = async (
    id: string,
    callback: (res: Reservation | null) => void
) => {
    const db = await getFirestoreInstance();
    return onSnapshot(
        doc(db, 'reservations', id),
        (docSnap) => {
            if (docSnap.exists()) {
                callback({
                    id: docSnap.id,
                    ...(docSnap.data() as Record<string, unknown>),
                } as Reservation);
            } else {
                callback(null);
            }
        },
        (error) => {
            logger.error('Erro no listener de reserva única:', { error });
        }
    );
};

// --- OTIMIZAÇÃO: Apenas Ativas em Tempo Real ---
export const subscribeToActiveReservations = async (
    callback: (reservations: Reservation[]) => void,
    allowedProperties?: string[]
) => {
    if (allowedProperties && allowedProperties.length === 0) {
        callback([]);
        return () => undefined;
    }

    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local

    const constraints: ReturnType<typeof where | typeof orderBy>[] = [
        where('checkoutDate', '>=', today),
        orderBy('checkoutDate', 'asc'),
    ];

    // O filtro de tenant no Firestore é aplicado apenas para propriedades restritas não-padrão (ex: apenas 'integracao').
    // Para super_admin (2+ propriedades) ou 'lili', não filtramos no Firestore por propertyId
    // para evitar a exclusão de reservas legadas sem o campo propertyId no documento.
    const isSingleRestrictedProperty =
        allowedProperties?.length === 1 && allowedProperties[0] !== 'lili';
    if (isSingleRestrictedProperty) {
        constraints.unshift(where('propertyId', '==', allowedProperties[0]));
    }

    const db = await getFirestoreInstance();

    const q = query(collection(db, 'reservations'), ...constraints);

    logger.info('[Firebase] Subscribed to active reservations');

    return onSnapshot(
        q,
        (snapshot) => {
            let data = mapFirestoreDocs<Reservation>(snapshot);

            // Se o usuário tem permissão apenas para 'lili', filtra client-side preservando legados sem propertyId
            if (allowedProperties?.length === 1 && allowedProperties[0] === 'lili') {
                data = data.filter((r) => (r.propertyId || 'lili') === 'lili');
            }

            logger.info(`[Firebase] Active reservations updated: ${data.length} items`);
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de reservas ativas:', { error });
        }
    );
};

// --- Histórico Paginado (Sob Demanda) ---
export const fetchHistoryReservations = async (
    lastDoc: QueryDocumentSnapshot<unknown, DocumentData> | null = null,
    pageSize: number = 20,
    allowedProperties?: string[]
) => {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');

    const constraints: ReturnType<typeof where | typeof orderBy | typeof limit>[] = [
        where('checkoutDate', '<', today),
        orderBy('checkoutDate', 'desc'),
        limit(pageSize),
    ];

    const isSingleRestrictedProperty =
        allowedProperties?.length === 1 && allowedProperties[0] !== 'lili';
    if (isSingleRestrictedProperty) {
        constraints.push(where('propertyId', '==', allowedProperties[0]));
    }

    const db = await getFirestoreInstance();
    let q = query(collection(db, 'reservations'), ...constraints);

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    let snapshot;
    try {
        snapshot = await getDocsFromServer(q);
        if (!snapshot) snapshot = await getDocs(q);
    } catch {
        snapshot = await getDocs(q);
    }
    let data = snapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            }) as Reservation
    );

    if (allowedProperties?.length === 1 && allowedProperties[0] === 'lili') {
        data = data.filter((r) => (r.propertyId || 'lili') === 'lili');
    }

    return {
        data,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === pageSize,
    };
};

// --- SYNCHRONIZED FAVORITES (GUEST) ---
export const toggleFavoritePlace = async (
    reservationId: string,
    placeId: string,
    currentFavorites: string[] = []
): Promise<string[]> => {
    try {
        const db = await getFirestoreInstance();
        const docRef = doc(db, 'reservations', reservationId);
        let newFavorites = [...currentFavorites];

        if (newFavorites.includes(placeId)) {
            // Remove
            newFavorites = newFavorites.filter((id) => id !== placeId);
        } else {
            // Add
            newFavorites.push(placeId);
        }

        // Optimistically return new state logic is handled by UI, here we just do DB update
        await updateDoc(docRef, {
            favoritePlaces: newFavorites,
        });

        return newFavorites;
    } catch (error) {
        logger.error('Error toggling favorite:', { error });
        throw error;
    }
};
