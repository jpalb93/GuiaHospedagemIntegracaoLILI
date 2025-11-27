import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, MessageCircle, RefreshCw } from 'lucide-react';
import { HOST_PHONE } from '../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center font-sans text-white">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-heading">Ops! Algo deu errado.</h1>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
              Tivemos um problema técnico inesperado. Tente recarregar a página ou fale com a anfitriã se o problema persistir.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <RefreshCw size={18} /> Recarregar Página
              </button>
              <a 
                href={`https://wa.me/${HOST_PHONE}`} 
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={18} /> Falar com a Anfitriã
              </a>
            </div>

            {/* Detalhes do erro apenas em ambiente de desenvolvimento (opcional) */}
            {this.state.error && import.meta.env.DEV && (
                <div className="mt-6 p-4 bg-black/50 rounded-xl text-left overflow-auto max-h-40 border border-white/10">
                    <p className="text-[10px] font-mono text-red-300 whitespace-pre-wrap">{this.state.error.toString()}</p>
                </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;