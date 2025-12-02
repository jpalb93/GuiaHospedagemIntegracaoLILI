import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, MessageCircle, RefreshCw } from 'lucide-react';
import { HOST_PHONE } from '../constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  showDetails?: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // --- AUTO-RELOAD ON CHUNK LOAD ERROR ---
    // Isso acontece quando uma nova versão é deployada e o navegador tenta carregar um chunk antigo (404)
    // ou quando a rede falha ao carregar um lazy component.
    const isChunkError = error.message.includes('Loading chunk') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('flat_lili_chunk_reload');
      const now = Date.now();

      // Se não recarregou nos últimos 10 segundos, recarrega
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('flat_lili_chunk_reload', now.toString());
        window.location.reload();
        return;
      }
    }
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

            {/* Botão para ver detalhes (Apenas em DEV) */}
            {import.meta.env.DEV && (
              <button
                onClick={() => this.setState(prev => ({ ...prev, showDetails: !prev.showDetails }))}
                className="mt-6 text-xs text-gray-400 hover:text-white underline transition-colors"
              >
                {this.state.showDetails ? 'Ocultar detalhes técnicos' : 'Ver detalhes técnicos'}
              </button>
            )}

            {/* Detalhes do erro para diagnóstico */}
            {this.state.showDetails && this.state.error && import.meta.env.DEV && (
              <div className="mt-4 p-4 bg-black/50 rounded-xl text-left overflow-auto max-h-60 border border-white/10 w-full">
                <p className="text-[10px] font-mono text-red-300 whitespace-pre-wrap mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.error.stack && (
                  <p className="text-[9px] font-mono text-gray-500 whitespace-pre-wrap border-t border-white/10 pt-2">
                    {this.state.error.stack}
                  </p>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${this.state.error?.toString()}\n\n${this.state.error?.stack}`);
                    alert('Erro copiado!');
                  }}
                  className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-colors"
                >
                  Copiar Erro para Suporte
                </button>
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