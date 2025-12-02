// Configuração do Cloudinary
// Substitua pelos seus valores ou use variáveis de ambiente
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddae8pb46';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'flats_integracao';

interface CloudinaryResponse {
    secure_url: string;
    error?: { message: string };
}

export const uploadImageToCloudinary = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = (e.loaded / e.total) * 100;
                if (onProgress) onProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText) as CloudinaryResponse;
                resolve(response.secure_url);
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    reject(new Error(errorResponse.error?.message || 'Erro no upload'));
                } catch {
                    reject(new Error('Falha no upload para o Cloudinary'));
                }
            }
        };

        xhr.onerror = () => {
            reject(new Error('Erro de rede ao conectar com Cloudinary'));
        };

        xhr.send(formData);
    });
};
