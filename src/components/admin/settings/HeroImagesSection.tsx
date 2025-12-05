import React from 'react';
import { ImageIcon, Trash2 } from 'lucide-react';
import OptimizedImage from '../../OptimizedImage';
import ImageUpload from '../ImageUpload';

interface HeroImagesSectionProps {
    activeProperty: 'lili' | 'integracao';
    images: string[];
    onRemove: (index: number) => void;
    onAdd: (url: string) => void;
}

const HeroImagesSection: React.FC<HeroImagesSectionProps> = ({
    activeProperty,
    images,
    onRemove,
    onAdd
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <ImageIcon size={20} className={activeProperty === 'lili' ? "text-orange-500" : "text-blue-500"} />
                Imagens do Carrossel ({activeProperty === 'lili' ? 'Flat da Lili' : 'Flats Integração'})
            </h2>

            <div className="space-y-4 mb-6">
                {images.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                            <OptimizedImage src={url} className="w-full h-full object-cover" alt="Capa" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 truncate font-mono">{url}</p>
                        </div>
                        <button onClick={() => onRemove(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {images.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-4">Nenhuma imagem definida. Usando padrão do sistema.</p>
                )}
            </div>

            <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adicionar Nova Imagem</label>
                <ImageUpload
                    onUpload={(url) => url && onAdd(url)}
                    folder={`hero_${activeProperty}`}
                    placeholder="Nova Imagem de Capa (1920x1080)"
                    maxDimension={1920}
                    quality={0.9}
                />
            </div>
        </div>
    );
};

export default React.memo(HeroImagesSection);
