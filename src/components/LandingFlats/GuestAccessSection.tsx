import React, { useState } from 'react';
import { ArrowRight, KeyRound, Loader2, RefreshCw } from 'lucide-react';
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
            // Lógica de extração similar ao App.tsx
            let rid = code.trim();
            if (rid.includes('http') || rid.includes('.com')) {
                const urlObj = new URL(rid.startsWith('http') ? rid : `https://${rid}`);
                const idParam = urlObj.searchParams.get('rid');
                rid = idParam || rid;
            }

            const config = await fetchGuestConfig(rid);
            if (config) {
                // Salvar no localStorage para persistência
                localStorage.setItem('flat_lili_last_rid', rid);
                // Callback para o App.tsx atualizar o estado
                // Como este componente está "dentro" do Landing, precisamos recarregar ou passar o estado para cima.
                // A maneira mais simples de forçar o App a "re-verificar" é recarregar a página ou atualizar um contexto.
                // Dado a estrutura atual do App.tsx que lê do localStorage no mount/update,
                // vamos redirecionar para a raiz com ?rid=CODE para forçar o loading state do App.
                window.location.href = `/?rid=${rid}`;
            } else {
                setError('Código inválido ou reserva não encontrada.');
            }
        } catch (err) {
            console.error(err);
            setError('Erro ao verificar código. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-black/50"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-400">
                            <KeyRound size={28} />
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-4">
                            Já tem uma reserva?
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Acesse seu Guia Digital exclusivo com todas as informações do flat,
                            senhas, Wi-Fi e dicas da cidade. Basta inserir o código enviado por
                            WhatsApp.
                        </p>
                    </div>

                    <div className="w-full md:w-96 bg-black/40 p-6 rounded-2xl border border-white/10">
                        <form onSubmit={handleSubmit}>
                            <label className="block text-sm font-bold text-gray-300 mb-2">
                                Código de Acesso ou Link
                            </label>
                            <div className="flex flex-col gap-3 mb-4">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Ex: ABC1234"
                                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !code}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 shadow-md"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <span>Acessar</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-400 text-sm flex items-center gap-1">
                                    <RefreshCw size={12} /> {error}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                O código está no link enviado na confirmação da reserva.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuestAccessSection;
