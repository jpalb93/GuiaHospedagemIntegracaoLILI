import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImage } from './storage';
import * as firebaseStorage from 'firebase/storage';

// Mock Firebase Storage
vi.mock('firebase/storage');

// Mock config
vi.mock('./config', () => ({
    storage: {},
}));

describe('Firebase Storage Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadImage', () => {
        it('should upload image and return download URL', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const mockDownloadURL = 'https://storage.example.com/test.jpg';

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError, onComplete) => {
                    // Simulate upload complete
                    setTimeout(() => onComplete(), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);
            (firebaseStorage.getDownloadURL as any).mockResolvedValue(mockDownloadURL);

            const result = await uploadImage(mockFile, 'images/test.jpg');

            expect(result).toBe(mockDownloadURL);
            expect(firebaseStorage.ref).toHaveBeenCalled();
            expect(firebaseStorage.uploadBytesResumable).toHaveBeenCalledWith({}, mockFile);
        });

        it('should call progress callback during upload', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const mockProgressCallback = vi.fn();

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError, onComplete) => {
                    // Simulate progress
                    onProgress({
                        bytesTransferred: 50,
                        totalBytes: 100,
                    });
                    onProgress({
                        bytesTransferred: 100,
                        totalBytes: 100,
                    });
                    setTimeout(() => onComplete(), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);
            (firebaseStorage.getDownloadURL as any).mockResolvedValue('url');

            await uploadImage(mockFile, 'images/test.jpg', mockProgressCallback);

            expect(mockProgressCallback).toHaveBeenCalledWith(50);
            expect(mockProgressCallback).toHaveBeenCalledWith(100);
        });

        it('should handle upload error', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const mockError = new Error('Upload failed');

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError) => {
                    setTimeout(() => onError(mockError), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);

            await expect(uploadImage(mockFile, 'images/test.jpg')).rejects.toThrow('Upload failed');
        });

        it('should handle getDownloadURL error', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError, onComplete) => {
                    setTimeout(() => onComplete(), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);
            (firebaseStorage.getDownloadURL as any).mockRejectedValue(new Error('URL fetch failed'));

            await expect(uploadImage(mockFile, 'images/test.jpg')).rejects.toThrow('URL fetch failed');
        });

        it('should work without progress callback', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError, onComplete) => {
                    // Call onProgress without callback - should not throw
                    onProgress({
                        bytesTransferred: 50,
                        totalBytes: 100,
                    });
                    setTimeout(() => onComplete(), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);
            (firebaseStorage.getDownloadURL as any).mockResolvedValue('url');

            const result = await uploadImage(mockFile, 'images/test.jpg');

            expect(result).toBe('url');
        });

        it('should use correct storage path', async () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const customPath = 'custom/path/to/image.jpg';

            const mockUploadTask = {
                snapshot: { ref: {} },
                on: vi.fn((event, onProgress, onError, onComplete) => {
                    setTimeout(() => onComplete(), 0);
                }),
            };

            (firebaseStorage.ref as any).mockReturnValue({});
            (firebaseStorage.uploadBytesResumable as any).mockReturnValue(mockUploadTask);
            (firebaseStorage.getDownloadURL as any).mockResolvedValue('url');

            await uploadImage(mockFile, customPath);

            expect(firebaseStorage.ref).toHaveBeenCalledWith({}, customPath);
        });
    });
});
