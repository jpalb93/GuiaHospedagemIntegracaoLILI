import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImageToCloudinary } from './cloudinary';

describe('Cloudinary Service', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    let mockXHR: any;

    beforeEach(() => {
        mockXHR = {
            open: vi.fn(),
            send: vi.fn(),
            setRequestHeader: vi.fn(),
            upload: {},
            status: 200,
            responseText: JSON.stringify({ secure_url: 'https://cloudinary.com/image.jpg' }),
            onload: null as any,
            onerror: null as any,
        };

        vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('Upload Success', () => {
        it('should upload image successfully', async () => {
            const uploadPromise = uploadImageToCloudinary(mockFile);

            // Simulate successful upload
            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            const url = await uploadPromise;

            expect(url).toBe('https://cloudinary.com/image.jpg');
            expect(mockXHR.open).toHaveBeenCalledWith(
                'POST',
                expect.stringContaining('api.cloudinary.com'),
                true
            );
        });

        it('should call onProgress callback during upload', async () => {
            const onProgress = vi.fn();
            const uploadPromise = uploadImageToCloudinary(mockFile, onProgress);

            // Simulate progress
            setTimeout(() => {
                if (mockXHR.upload.onprogress) {
                    mockXHR.upload.onprogress({
                        lengthComputable: true,
                        loaded: 50,
                        total: 100,
                    });
                    mockXHR.upload.onprogress({
                        lengthComputable: true,
                        loaded: 100,
                        total: 100,
                    });
                }
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await uploadPromise;

            expect(onProgress).toHaveBeenCalledWith(50);
            expect(onProgress).toHaveBeenCalledWith(100);
        });

        it('should work without progress callback', async () => {
            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.upload.onprogress) {
                    mockXHR.upload.onprogress({
                        lengthComputable: true,
                        loaded: 50,
                        total: 100,
                    });
                }
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            const url = await uploadPromise;
            expect(url).toBeDefined();
        });

        it('should send FormData with file and preset', async () => {
            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await uploadPromise;

            expect(mockXHR.send).toHaveBeenCalled();
            const formData = mockXHR.send.mock.calls[0][0];
            expect(formData).toBeInstanceOf(FormData);
        });
    });

    describe('Upload Errors', () => {
        it('should handle HTTP error with message', async () => {
            mockXHR.status = 400;
            mockXHR.responseText = JSON.stringify({
                error: { message: 'Invalid image format' },
            });

            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await expect(uploadPromise).rejects.toThrow('Invalid image format');
        });

        it('should handle HTTP error without message', async () => {
            mockXHR.status = 500;
            mockXHR.responseText = JSON.stringify({});

            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await expect(uploadPromise).rejects.toThrow('Erro no upload');
        });

        it('should handle malformed error response', async () => {
            mockXHR.status = 400;
            mockXHR.responseText = 'Invalid JSON';

            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await expect(uploadPromise).rejects.toThrow('Falha no upload para o Cloudinary');
        });

        it('should handle network error', async () => {
            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onerror) mockXHR.onerror();
            }, 0);

            await expect(uploadPromise).rejects.toThrow('Erro de rede ao conectar com Cloudinary');
        });
    });

    describe('Configuration', () => {
        it('should use correct Cloudinary URL', async () => {
            const uploadPromise = uploadImageToCloudinary(mockFile);

            setTimeout(() => {
                if (mockXHR.onload) mockXHR.onload();
            }, 0);

            await uploadPromise;

            expect(mockXHR.open).toHaveBeenCalledWith(
                'POST',
                expect.stringContaining('cloudinary.com/v1_1/'),
                true
            );
        });
    });
});
