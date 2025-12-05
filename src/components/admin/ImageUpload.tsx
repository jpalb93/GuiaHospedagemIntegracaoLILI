import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { uploadImageToCloudinary } from '../../services/cloudinary';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    initialUrl?: string;
    folder?: string;
    placeholder?: string;
    maxDimension?: number;
    quality?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUpload,
    initialUrl,
    placeholder = 'Clique ou arraste para enviar',
    maxDimension = 1200,
    quality = 0.8
}) => {
    const [preview, setPreview] = useState<string | null>(initialUrl || null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
    const [manualUrl, setManualUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Compress image using Canvas
    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('Compression timed out')), 15000); // 15s timeout

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                clearTimeout(timeoutId);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                // Max dimensions
                const MAX_WIDTH = maxDimension;
                const MAX_HEIGHT = maxDimension;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Compression failed'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (err) => {
                clearTimeout(timeoutId);
                reject(err);
            };
        });
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, envie apenas imagens.');
            return;
        }

        setLoading(true);
        setProgress(0);


        try {
            // Compress image
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });


            // Race upload with timeout
            const uploadPromise = uploadImageToCloudinary(compressedFile, (p) => setProgress(p));
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Upload timed out (60s)')), 60000)
            );

            const url = await Promise.race([uploadPromise, timeoutPromise]) as string;


            setPreview(url);
            onUpload(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Erro ao enviar imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleManualUrlSubmit = () => {
        if (manualUrl) {
            setPreview(manualUrl);
            onUpload(manualUrl);
            setUploadMode('file'); // Switch back to show preview
        }
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            onClick={() => { setPreview(null); onUpload(''); }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remover"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <CheckCircle size={10} /> Imagem Definida
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {uploadMode === 'file' ? (
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${dragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                            />
                            {loading ? (
                                <div className="flex flex-col items-center gap-2 text-orange-500 w-full px-4">
                                    <Loader2 size={32} className="animate-spin" />
                                    <span className="text-xs font-bold">Enviando... {Math.round(progress)}%</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                        <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">Se travar no 0%, pode ser bloqueio de segurança (CORS).</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-3 text-orange-600 dark:text-orange-400">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        {placeholder}
                                    </p>
                                    <p className="text-xs text-gray-400 mb-3">
                                        JPG, PNG (Max 5MB)
                                    </p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setUploadMode('url'); }}
                                        className="text-xs text-blue-500 hover:underline font-bold"
                                    >
                                        Ou cole um link direto
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Colar URL da Imagem</label>
                            <div className="flex gap-2">
                                <input
                                    value={manualUrl}
                                    onChange={(e) => setManualUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <button
                                    onClick={handleManualUrlSubmit}
                                    className="bg-blue-500 text-white px-3 rounded-lg font-bold text-xs hover:bg-blue-600"
                                >
                                    Usar
                                </button>
                            </div>
                            <button
                                onClick={() => setUploadMode('file')}
                                className="text-xs text-gray-400 hover:text-gray-600 mt-2 flex items-center gap-1"
                            >
                                <ImageIcon size={12} /> Voltar para Upload
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
