/**
 * Serviços de Storage
 * Upload de imagens para Firebase Storage
 */
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from './config';

export const uploadImage = (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
            }
        );
    });
};
