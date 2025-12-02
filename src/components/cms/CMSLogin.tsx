import React, { useState } from 'react';
import { Lock, AlertCircle, LogIn, LogOut } from 'lucide-react';
import { loginCMS } from '../../services/firebase';

const CMSLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await loginCMS(email, password);
        } catch (_err) {
            setError('Erro ao logar. Verifique e-mail e senha.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-500">
                        <Lock size={32} />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Acesso Restrito</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Gerenciador de Conteúdo do Guia</p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="admin@flatlili.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                        <LogIn size={20} /> Entrar
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center gap-1 transition-colors">
                        <LogOut size={14} /> Voltar para o Guia
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CMSLogin;
