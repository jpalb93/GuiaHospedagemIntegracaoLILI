import { QueryDocumentSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

/**
 * Generic mapper to convert a single Firestore document to a typed object
 * Automatically adds the document ID to the result
 * 
 * @example
 * const reservation = mapFirestoreDoc<Reservation>(doc);
 */
export const mapFirestoreDoc = <T extends { id?: string }>(
    doc: QueryDocumentSnapshot<DocumentData>
): T => ({
    id: doc.id,
    ...doc.data(),
} as T);

/**
 * Generic mapper to convert multiple Firestore documents to typed objects
 * Automatically adds document IDs to all results
 * 
 * @example
 * const reservations = mapFirestoreDocs<Reservation>(querySnapshot);
 */
export const mapFirestoreDocs = <T extends { id?: string }>(
    snapshot: QuerySnapshot<DocumentData>
): T[] => snapshot.docs.map(doc => mapFirestoreDoc<T>(doc));
