
import React from 'react';
import { CalendarHeart, Key, Wifi, Check, MapPin, Video, Maximize2, LogOut, MessageCircle, Bell } from 'lucide-react';
import { GuestConfig } from '../../types';

interface GuestStatusCardProps {
    stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout' | 'post_checkout';
    isTimeVerified: boolean;
    isPasswordReleased: boolean;
    config: GuestConfig;
    wifiCopied: boolean;
    addressCopied: boolean;
    currentWifiSSID: string;
    currentWifiPass: string;
    onOpenCheckin: () => void;
    onOpenCheckout: () => void;
    onCopyWifi: () => void;
    onCopyAddress: () => void;
    onOpenDriverMode: () => void;
    formatFriendlyDate: (date?: string) => string;
    isSingleNight?: boolean;
    isCheckoutToday?: boolean;
    onOpenSupport: () => void;
}

const CardSkeleton = () => (
    <div className="w-full h-full min-h-[160px] p-6 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-orange-200/50 dark:bg-orange-800/40 rounded-full mb-3"></div>
        <div className="h-4 w-32 bg-orange-200/50 dark:bg-orange-800/40 rounded mb-2"></div>
        <div className="h-3 w-48 bg-orange-200/50 dark:bg-orange-800/40 rounded"></div>
    </div>
);

const GuestStatusCard: React.FC<GuestStatusCardProps> = ({
    stayStage,
    isTimeVerified,
    isPasswordReleased,
    config,
    wifiCopied,
    addressCopied,
    currentWifiSSID,
    currentWifiPass,
    onOpenCheckin,
    onOpenCheckout,
    onCopyWifi,
    onCopyAddress,
    onOpenDriverMode,
    formatFriendlyDate,
    isSingleNight = false,
    isCheckoutToday = false,
    onOpenSupport
}) => {
    if (!isTimeVerified) return <CardSkeleton />;

    return (
        <>
            {(stayStage === 'pre_checkin') && (
                <div className="p-6 animate-fadeIn text-center relative overflow-hidden group bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/20 dark:to-purple-900/20 h-full flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-3 text-purple-200/50 dark:text-purple-900/30 transform rotate-12"><CalendarHeart size={80} strokeWidth={1} /></div>
                    {isPasswordReleased ? (
                        <>
                            <h3 className="text-lg font-heading font-bold text-purple-900 dark:text-purple-100 mb-2 relative z-10">SEU CHECK-IN É AMANHÃ! 🤩</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xs mx-auto mb-4 relative z-10">
                                Enquanto não chega, dá uma olhada nas regras e o que te espera na cidade!
                                <br /><br />
                                <span className="text-purple-800 dark:text-purple-200 font-bold">AH, suas senhas já estão liberadas, viu?</span>
                                <br />
                                Clique acima em <span className="font-bold border-b border-purple-300">Salvar Acesso</span> e tira um print do seu cartão!
                            </p>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="px-4 py-2 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                                Ver instruções de acesso
                            </button>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="mt-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                                <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-heading font-bold text-purple-900 dark:text-purple-100 mb-2 relative z-10">Sua viagem está chegando! ✈️</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xs mx-auto mb-4 relative z-10">
                                Seu check-in é no dia <strong className="text-purple-700 dark:text-purple-300">{formatFriendlyDate(config.checkInDate)}</strong>, a partir das <strong className="text-purple-700 dark:text-purple-300">{config.checkInTime || '14:00'}</strong>.
                                <br /><br />
                                Enquanto não chega, dá uma olhada nas regras e o que te espera na cidade!
                            </p>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="px-4 py-2 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                                Ver instruções de acesso
                            </button>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="mt-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                                <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {stayStage === 'pre_checkout' && (
                <>
                    <div className="p-2 animate-fadeIn h-full flex flex-col justify-between">
                        <div className="mb-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30 flex flex-col items-center text-center">
                            <h3 className="text-sm font-heading font-bold text-indigo-900 dark:text-indigo-100 mb-1">Amanhã é dia de partir 😢</h3>
                            <p className="text-[10px] text-indigo-700 dark:text-indigo-300 mb-3 max-w-[240px] leading-tight">
                                Seu check-out é amanhã até às <strong className="text-indigo-900 dark:text-white">{config.checkOutTime || '11:00'}</strong>.
                                Vai sair de madrugada? Veja as instruções.
                            </p>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }} className="w-full py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wide border border-indigo-200 dark:border-indigo-800/50 rounded-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                                Ver instruções de saída
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col justify-center items-center gap-1">
                                <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-lg"><Key size={18} strokeWidth={2.5} /></div>
                                <div><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">{config.propertyId === 'integracao' ? 'Nº do Flat' : 'Senha'}</p><p className="text-lg font-bold text-gray-900 dark:text-white font-mono leading-none">{config.propertyId === 'integracao' ? config.flatNumber : config.lockCode}</p></div>
                            </div>
                            <div
                                onClick={onCopyWifi}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                role="button"
                                tabIndex={0}
                                aria-label="Copiar senha do Wi-Fi"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyWifi(); }}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${wifiCopied ? 'bg-green-100 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>{wifiCopied ? <Check size={18} /> : <Wifi size={18} />}</div>
                                <div><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">WiFi</p><p className="text-xs font-bold text-gray-900 dark:text-white leading-none truncate max-w-[80px]">Conectar</p></div>
                            </div>
                            <div
                                onClick={onCopyAddress}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                                role="button"
                                tabIndex={0}
                                aria-label="Copiar endereço"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyAddress(); }}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${addressCopied ? 'bg-green-100 text-green-600' : 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'}`}>{addressCopied ? <Check size={18} /> : <MapPin size={18} />}</div>
                                <div><p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">Local</p><p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{addressCopied ? 'Copiado!' : 'Copiar'}</p></div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full mt-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                        <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                    </button>
                </>
            )}

            {stayStage === 'middle' && (
                <>
                    <div className="p-2 animate-fadeIn h-full flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-2 mb-2 flex-1">
                            <div className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col justify-center items-start relative overflow-hidden group">
                                {config.propertyId === 'integracao' ? (
                                    <>
                                        <div className="absolute top-0 right-0 p-1.5 text-orange-100 dark:text-orange-900/10 transform rotate-12"><Key size={48} strokeWidth={1.5} /></div>
                                        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5 font-heading">Unidade</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-wider z-10">{config.flatNumber}</p>
                                        <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-medium z-10">Chave na portaria</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute top-0 right-0 p-1.5 text-orange-100 dark:text-orange-900/10 transform rotate-12"><Key size={48} strokeWidth={1.5} /></div>
                                        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5 font-heading">Senha Porta</p>
                                        <div className="flex items-center gap-1 z-10">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono tracking-wider">{config.lockCode}</p>
                                            <Bell size={14} className="text-orange-500 animate-pulse" />
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="mt-1.5 px-2 py-1 bg-orange-50 dark:bg-orange-900/40 hover:bg-orange-100 text-orange-700 dark:text-orange-300 text-[9px] font-bold rounded-lg flex items-center gap-1 transition-colors z-10">
                                            <Video size={10} /> Ver vídeo
                                        </button>
                                    </>
                                )}
                            </div>
                            <div
                                onClick={onCopyAddress}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm flex flex-col justify-center items-start relative overflow-hidden cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                                role="button"
                                tabIndex={0}
                                aria-label="Copiar endereço"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyAddress(); }}
                            >
                                <div className="absolute top-2 right-2 text-purple-400 bg-purple-50 dark:bg-purple-900/30 p-1 rounded-md">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (navigator.vibrate) navigator.vibrate(50); onOpenDriverMode(); }}
                                        aria-label="Abrir modo motorista"
                                        className="focus:outline-none"
                                    >
                                        <Maximize2 size={10} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mb-0.5 font-heading">Endereço</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 pr-4">R. São José, 475B</p>
                                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{addressCopied ? 'Copiado!' : 'Toque p/ Copiar'}</p>
                            </div>
                            <div
                                onClick={onCopyWifi}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                role="button"
                                tabIndex={0}
                                aria-label="Copiar senha do Wi-Fi"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyWifi(); }}
                            >
                                <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 p-2 rounded-lg shrink-0"><Wifi size={16} /></div>
                                <div className="overflow-hidden">
                                    <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase truncate" title={currentWifiSSID}>{currentWifiSSID}</p>
                                    <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate">{wifiCopied ? 'Senha Copiada!' : (currentWifiPass.length < 12 ? currentWifiPass : 'Copiar Senha')}</p>
                                </div>
                            </div>
                            <div
                                onClick={(e) => { e.stopPropagation(); if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                role="button"
                                tabIndex={0}
                                aria-label="Ver instruções de check-out"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onOpenCheckout(); } }}
                            >
                                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 p-2 rounded-lg shrink-0"><LogOut size={16} /></div>
                                <div>
                                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-0.5">Check-out</p>
                                    {config.checkoutDate ? (
                                        <div className="leading-tight">
                                            <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                                                {(() => {
                                                    const [y, m, d] = config.checkoutDate.split('-').map(Number);
                                                    const date = new Date(y, m - 1, d);
                                                    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                                                    return `${days[date.getDay()]} (${d}/${m})`;
                                                })()}
                                            </p>
                                            <p className="text-[9px] text-gray-500 dark:text-gray-400">às {config.checkOutTime || '11:00'}</p>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{config.checkOutTime || '11:00'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full mt-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                        <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                    </button>
                </>
            )}

            {(stayStage === 'checkin' || stayStage === 'checkout') && (
                isSingleNight && stayStage === 'checkin' ? (
                    <div className="p-2 animate-fadeIn h-full flex flex-col justify-between">
                        <div className="mb-3 text-center px-2">
                            <p className="text-base font-bold text-gray-700 dark:text-gray-200 font-heading leading-tight mb-1">
                                Poxa! Estadia rápida, {config.guestName?.split(' ')[0]}?
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Aqui você tem todas as informações que precisa, viu?
                            </p>
                        </div>
                        <div className="mb-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-orange-800 dark:text-orange-200 uppercase tracking-wide flex items-center gap-1">
                                    <CalendarHeart size={12} /> Check-out Amanhã
                                </p>
                                <p className="text-xs text-orange-900 dark:text-orange-100 font-bold">Até às {config.checkOutTime || '11:00'}</p>
                            </div>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }} className="px-3 py-1.5 bg-white dark:bg-gray-800 text-orange-700 dark:text-orange-300 text-[9px] font-bold uppercase rounded-lg shadow-sm border border-orange-100 dark:border-orange-800 hover:bg-orange-50 transition-colors">
                                Ver Regras
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 flex-1">
                            <div className="col-span-1 bg-white dark:bg-gray-800 p-2 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
                                {config.propertyId === 'integracao' ? (
                                    <>
                                        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5">Unidade</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white font-mono tracking-wider">{config.flatNumber}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5">Senha Porta</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono tracking-wider">{config.lockCode}</p>
                                            <Bell size={14} className="text-orange-500" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div
                                onClick={onCopyWifi}
                                className="col-span-1 bg-white dark:bg-gray-800 p-2 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex flex-col justify-center items-center cursor-pointer active:bg-blue-50 dark:active:bg-blue-900/20 transition-colors group relative overflow-hidden"
                                role="button"
                                tabIndex={0}
                                aria-label="Copiar senha do Wi-Fi"
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyWifi(); }}
                            >
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-0.5">Rede Wi-Fi</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white font-sans text-center leading-tight mb-1 px-1 break-all line-clamp-1">{currentWifiSSID}</p>
                                <div className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${wifiCopied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:bg-blue-100'}`}>
                                    {wifiCopied ? 'Senha Copiada!' : 'Copiar Senha'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }}
                            className="w-full mt-2 py-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                        >
                            <Video size={14} /> Ver como entrar
                        </button>
                        <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full mt-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                            <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                        </button>


                    </div>
                ) : (
                    <div
                        onClick={isCheckoutToday ? () => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); } : undefined}
                        className={`p-6 flex flex-col items-center text-center group animate-fadeIn h-full justify-center ${isCheckoutToday ? 'cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors' : ''}`}
                        role={isCheckoutToday ? "button" : undefined}
                        tabIndex={isCheckoutToday ? 0 : undefined}
                        aria-label={isCheckoutToday ? "Ver checklist de saída" : undefined}
                        onKeyDown={isCheckoutToday ? (e) => { if (e.key === 'Enter' || e.key === ' ') onOpenCheckout(); } : undefined}
                    >
                        {stayStage === 'checkout' && (
                            <>
                                <div className="p-3 rounded-full mb-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm animate-pulse-slow border border-blue-50 dark:border-blue-900/30"><LogOut size={24} strokeWidth={2} /></div>
                                <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1.5">Hoje é seu Check-out</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors font-medium max-w-xs leading-relaxed">Esperamos que sua estadia tenha sido incrível! Toque aqui para ver o checklist.</p>
                                <div className="flex flex-col gap-2 w-full max-w-[260px]">
                                    <div className="flex items-center justify-center gap-2.5 bg-white dark:bg-gray-800 py-2.5 px-4 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                                        <LogOut size={16} className="text-blue-500" />
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200 font-sans">Horário do Check-Out: {config.checkOutTime || '11:00'}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                                        <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                                    </button>
                                </div>
                            </>
                        )}
                        {stayStage === 'checkin' && (
                            <>
                                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2"><Key size={20} className="text-orange-500" strokeWidth={2.5} /> Que alegria te receber, {config.guestName?.split(' ')[0] || 'Visitante'}!</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-5 font-medium max-w-xs mx-auto leading-relaxed">Preparamos um guia rápido para você entrar sem estresse.</p>

                                {/* LOCK CODE CARD (QUICK ACCESS) */}
                                <div className="w-full mb-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex items-center gap-3 text-left group relative overflow-hidden">
                                    {config.propertyId === 'integracao' ? (
                                        <>
                                            <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 p-2.5 rounded-lg shrink-0"><Key size={18} /></div>
                                            <div className="overflow-hidden flex-1">
                                                <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase truncate mb-0.5">Unidade</p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white truncate leading-none mb-0.5">{config.flatNumber}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Chave na portaria</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 p-2.5 rounded-lg shrink-0"><Key size={18} /></div>
                                            <div className="overflow-hidden flex-1">
                                                <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase truncate mb-0.5">Senha Porta</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white truncate leading-none mb-0.5">{config.lockCode}</p>
                                                    <Bell size={16} className="text-orange-500 animate-pulse" />
                                                </div>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">Toque a campainha após digitar</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* WI-FI CARD (QUICK ACCESS) */}
                                <div
                                    onClick={onCopyWifi}
                                    className="w-full mb-4 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left group"
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Copiar senha do Wi-Fi"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCopyWifi(); }}
                                >
                                    <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 p-2.5 rounded-lg shrink-0"><Wifi size={18} /></div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase truncate mb-0.5">Rede Wi-Fi</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-none mb-0.5">{currentWifiSSID}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{wifiCopied ? 'Senha Copiada!' : 'Toque para copiar senha'}</p>
                                    </div>
                                    <div className={`p-1.5 rounded-full ${wifiCopied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
                                        {wifiCopied ? <Check size={14} /> : <Key size={14} />}
                                    </div>
                                </div>

                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 text-sm flex items-center justify-center gap-2 font-sans active:scale-[0.98]">Iniciar Passo a Passo</button>
                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full mt-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-green-500/20">
                                    <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                                </button>
                            </>
                        )}
                    </div>
                )
            )}
            {
                stayStage === 'checkin' && !isSingleNight && (
                    <div className="bg-orange-50/50 dark:bg-orange-900/20 border-t border-orange-100/50 dark:border-orange-800/30 px-5 py-2.5 flex justify-center items-center animate-fadeIn mt-auto w-full">
                        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300"><CalendarHeart size={14} /><p className="text-xs font-bold font-sans">Check-in liberado a partir das {config.checkInTime || '14:00'}</p></div>
                    </div>
                )
            }

            {
                stayStage === 'post_checkout' && (
                    <div className="p-6 animate-fadeIn text-center relative overflow-hidden group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 h-full flex flex-col justify-center">
                        <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Obrigado pela estadia! 👋</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xs mx-auto">
                            Esperamos que tenha gostado de Petrolina.
                            <br />
                            Volte sempre!
                        </p>
                    </div>
                )
            }
        </>
    );
};

export default GuestStatusCard;
