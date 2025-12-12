/**
 * Serviços de Reservas (Reservations)
 * CRUD e subscriptions para reservas de hóspedes
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
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
} from 'firebase/firestore';
import { db, cleanData, auth } from './config'; // Import auth
import { Reservation } from '../../types';
import { logger } from '../../utils/logger';
import { generateShortId } from '../../utils/helpers';
import { mapFirestoreDocs } from './mappers';
import { logAction } from './logs'; // Import logAction

export const saveReservation = async (reservation: Reservation): Promise<string> => {
    const data = {
        ...reservation,
        shortId: reservation.shortId || generateShortId(),
        createdAt: new Date().toISOString(),
        status: reservation.status || 'active',
    };
    const docRef = await addDoc(collection(db, 'reservations'), cleanData(data));

    // Log Action
    const userEmail = auth.currentUser?.email || 'admin';
    await logAction('create', userEmail, `Nova reserva para ${reservation.guestName}`, docRef.id, reservation.guestName);

    return docRef.id;
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
    try {
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
    const { id: _discard, ...updateData } = data as Record<string, unknown>;
    await updateDoc(doc(db, 'reservations', id), updateData);

    // Log Action
    const userEmail = auth.currentUser?.email || 'admin';
    const guestName = data.guestName ? data.guestName : 'Reserva';
    await logAction('update', userEmail, `Reserva atualizada`, id, guestName);

    return true;
};

export const deleteReservation = async (id: string) => {
    await deleteDoc(doc(db, 'reservations', id));

    // Log Action
    const userEmail = auth.currentUser?.email || 'admin';
    await logAction('delete', userEmail, `Reserva excluída`, id, 'Reserva');
};

export const subscribeToSingleReservation = (
    id: string,
    callback: (res: Reservation | null) => void
) => {
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
            logger.error('Erro no listener de reserva única:', error);
        }
    );
};

// --- OTIMIZAÇÃO: Apenas Ativas em Tempo Real ---
export const subscribeToActiveReservations = (
    callback: (reservations: Reservation[]) => void,
    allowedProperties?: string[]
) => {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local

    // Query base: checkout >= hoje, ordenado por checkout
    let q = query(
        collection(db, 'reservations'),
        where('checkoutDate', '>=', today),
        orderBy('checkoutDate', 'asc')
    );

    // Nota: Se allowedProperties for usado, o Firestore precisa de um índice composto
    // Por ora, fazemos o filtro client-side para evitar problemas de índice

    logger.info('[Firebase] Subscribed to active reservations');

    return onSnapshot(
        q,
        (snapshot) => {
            let data = mapFirestoreDocs<Reservation>(snapshot);

            // Filtro client-side por propriedade (evita problema de índice composto)
            if (allowedProperties && allowedProperties.length > 0) {
                data = data.filter((r) => allowedProperties.includes(r.propertyId || 'lili'));
            }

            logger.info(`[Firebase] Active reservations updated: ${data.length} items`);
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de reservas ativas:', error);
        }
    );
};

// --- LANDING PAGE: Pega só o FUTURO ---
export const subscribeToFutureReservations = (callback: (reservations: Reservation[]) => void) => {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');
    const q = query(collection(db, 'reservations'), where('checkoutDate', '>=', today));

    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    }) as Reservation
            );
            callback(data);
        },
        (error) => {
            logger.error('Erro ao buscar reservas futuras:', error);
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

    if (allowedProperties && allowedProperties.length > 0) {
        constraints.push(where('propertyId', 'in', allowedProperties));
    }

    let q = query(collection(db, 'reservations'), ...constraints);

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(
        (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            }) as Reservation
    );

    return {
        data,
        lastVisible: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === pageSize,
    };
};

// LEGACY (Mantido para compatibilidade)
export const subscribeToReservations = (
    callback: (reservations: Reservation[]) => void,
    limitCount: number = 300
) => {
    const q = query(
        collection(db, 'reservations'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );
    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Reservation);
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de reservas (legacy):', error);
        }
    );
};

// --- SYNCHRONIZED FAVORITES (GUEST) ---
export const toggleFavoritePlace = async (
    reservationId: string,
    placeId: string,
    currentFavorites: string[] = []
): Promise<string[]> => {
    try {
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
        logger.error('Error toggling favorite:', error);
        throw error;
    }
};
