import React, { useState } from 'react';
import { PlaceRecommendation } from '../types';
import { MapPin, ExternalLink, X, Car, Footprints, Phone, ShoppingBag } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface PlaceCardProps {
  place: PlaceRecommendation;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [isOpen, setIsOpen] = useState(false);

  const googleMapsUrl = place.address 
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} Petrolina PE`)}`
    : null;

  const cleanDistance = (dist?: string) => {
    if (!dist) return null;
    return dist.replace(/\s*\(.*?\)/g, '').trim();
  };

  return (
    <>
      {/* --- CARD COMPACTO (LISTA) --- */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:bg-gray-750 transition-all duration-300 h-32 w-full cursor-pointer active:scale-[0.99] group relative"
      >
        {/* Imagem Pequena (Esquerda) */}
        <div className="w-28 h-full shrink-0 relative overflow-hidden bg-gray-50 dark:bg-gray-700">
          <OptimizedImage 
            src={place.imageUrl} 
            alt={place.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          
          {/* Badge de Distância (Overlay na Imagem) */}
          {place.distance && (
             <div className="absolute bottom-1.5 right-1.5 bg-gray-900/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-10 border border-white/10 font-sans tracking-wide">
               <Footprints size={9} className="text-orange-300" />
               <span>{cleanDistance(place.distance)}</span>
             </div>
          )}
          
          {/* Badge de Delivery */}
          {!place.distance && place.orderLink && (
             <div className="absolute bottom-1.5 right-1.5 bg-green-600/90 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm z-10 border border-white/10 font-sans tracking-wide">
               <ShoppingBag size={9} className="text-white" />
               <span>Delivery</span>
             </div>
          )}
        </div>
        
        {/* Conteúdo (Direita) */}
        <div className="flex-1 p-3.5 flex flex-col h-full min-w-0">
          
           {/* Nome do Local */}
          <h4 className="font-heading font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
            {place.name}
          </h4>

          {/* Descrição - Ocupa o espaço central */}
          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 font-sans font-medium pr-1 mb-auto">
            {place.description}
          </p>

          {/* Rodapé do Card (Se tiver endereço, mostra pequeno) */}
          {place.address ? (
            <div className="flex items-center gap-1 pt-2 mt-1 border-t border-gray-50 dark:border-gray-700">
               <MapPin size={10} className="text-gray-400 dark:text-gray-500 shrink-0" />
               <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate font-semibold font-sans">{place.address}</p>
            </div>
          ) : (
             <div className="pt-1"></div>
          )}
        </div>
      </div>

      {/* --- MODAL DE DETALHES (POP-UP) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          {/* Fundo Escuro (Backdrop) */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* O Cartão Grande */}
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-white/10">
            
            {/* Botão Fechar */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20"
            >
              <X size={18} />
            </button>

            {/* Imagem de Capa Grande */}
            <div className="h-56 shrink-0 relative bg-gray-100 dark:bg-gray-700">
              <OptimizedImage 
                src={place.imageUrl} 
                alt={place.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h2 className="text-2xl font-heading font-bold text-white leading-tight pr-8 mb-2 shadow-sm">{place.name}</h2>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {place.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-bold font-sans uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-6 font-sans font-medium">
                {place.description}
              </p>

              <div className="space-y-5">
                {/* Endereço ou Informação de Contato */}
                {place.address && (
                  <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-xl text-orange-500 dark:text-orange-400 shadow-sm border border-orange-50 dark:border-orange-900/30"><MapPin size={18} /></div>
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-0.5 font-heading tracking-wider">Localização</p>
                      <p className="text-gray-900 dark:text-white text-sm font-bold font-sans leading-snug">{place.address}</p>
                      {place.distance && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium font-sans">
                          <Car size={12} /> Aprox. {place.distance} do flat
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2.5">
                  
                  {place.orderLink && (
                    <a 
                      href={place.orderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white font-bold font-sans py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-sm"
                    >
                      <ShoppingBag size={18} />
                      Fazer Pedido Online
                    </a>
                  )}

                   {place.address && googleMapsUrl && !place.orderLink && (
                    <a 
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white font-bold font-sans py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-sm"
                    >
                      <ExternalLink size={18} />
                      Abrir no Google Maps
                    </a>
                  )}

                  {place.phoneNumber && (
                     <a 
                      href={`tel:${place.phoneNumber.replace(/[^0-9]/g, '')}`}
                      className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold font-sans py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-200 transition-all active:scale-[0.98] text-sm"
                    >
                      <Phone size={18} className="text-green-600 dark:text-green-400" />
                      Ligar Agora
                    </a>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceCard;