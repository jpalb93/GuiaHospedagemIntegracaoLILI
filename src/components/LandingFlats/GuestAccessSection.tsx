import React, { useState } from 'react';
import { ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import { fetchGuestConfig } from '../../services/guest';

const GuestAccessSection: React.FC = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            let rid = code.trim();
            if (rid.includes('http') || rid.includes('.com')) {
                const urlObj = new URL(rid.startsWith('http') ? rid : `https://${rid}`);
                const idParam = urlObj.searchParams.get('rid');
                rid = idParam || rid;
            }

            const config = await fetchGuestConfig(rid);
            if (config) {
                localStorage.setItem('flat_lili_last_rid', rid);
                window.location.href = `/?rid=${rid}`;
            } else {
                setError(
                    'Código não encontrado. Confira a mensagem de confirmação no WhatsApp ou fale conosco.'
                );
            }
        } catch (err) {
            console.error(err);
            setError('Não foi possível verificar agora. Tente de novo em instantes.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="hospede" className="py-14 md:py-16 bg-stone-950">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
                    <div className="lg:w-[40%] space-y-3 shrink-0">
                        <div className="flex items-center gap-2 text-stone-500">
                            <KeyRound size={16} className="stroke-1" aria-hidden />
                            <p className="text-xs font-heading font-bold uppercase tracking-[0.2em]">
                                Já reservou?
                            </p>
                        </div>
                        <h2 className="text-xl md:text-2xl font-heading font-medium text-stone-300 tracking-tight">
                            Acesse o guia do hóspede
                        </h2>
                        <p className="text-sm text-stone-500 leading-relaxed max-w-sm">
                            Use o código da confirmação para abrir Wi-Fi, senhas e o guia da
                            propriedade.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 max-w-lg w-full space-y-3">
                        <label
                            htmlFor="guest-access-code"
                            className="block text-xs font-bold tracking-[0.15em] text-stone-500 uppercase"
                        >
                            Código da reserva
                        </label>
                        <div className="flex items-center gap-3 border-b border-stone-700 focus-within:border-orange-500/60 transition-colors">
                            <input
                                id="guest-access-code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Cole o código ou o link com rid=…"
                                autoComplete="off"
                                className="flex-1 bg-transparent text-lg font-light text-white py-3 focus:outline-none placeholder:text-stone-700"
                            />
                            <button
                                type="submit"
                                aria-label="Entrar no guia do hóspede"
                                disabled={isLoading || !code.trim()}
                                className="shrink-0 text-stone-400 hover:text-orange-500 disabled:text-stone-700 disabled:pointer-events-none transition-colors p-1"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={22} />
                                ) : (
                                    <ArrowRight size={22} className="stroke-1" />
                                )}
                            </button>
                        </div>
                        {error ? (
                            <p className="text-red-400/90 text-sm leading-relaxed" role="alert">
                                {error}
                            </p>
                        ) : (
                            <p className="text-stone-600 text-xs">
                                O código chega na confirmação via WhatsApp.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default GuestAccessSection;
