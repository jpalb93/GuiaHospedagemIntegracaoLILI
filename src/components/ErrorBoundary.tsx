import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, MessageCircle, RefreshCw, Sparkles } from 'lucide-react';
import { HOST_PHONE } from '../constants';

// --- WAKE UP GUARD ---
// Rastreia quando o app "acordou" (ficou visível novamente).
// Erros que acontecem logo após acordar geralmente são glitches de rede/estado.
let lastVisibleTime = Date.now();

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      lastVisibleTime = Date.now();
      // Opcional: Limpar cache de reload se o usuário voltou a usar o app com sucesso
      // sessionStorage.removeItem('flat_lili_chunk_reload'); 
    }
  });
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  showDetails?: boolean;
  shouldReload?: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false,
    shouldReload: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // 1. Verifica se é um erro de chunk/rede que justifica um reload automático
    const isChunkError = error.message.includes('Loading chunk') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.name === 'ChunkLoadError';

    // 2. Verifica se o erro aconteceu logo após o app "acordar" (10 segundos de tolerância)
    const isWakeUpError = (Date.now() - lastVisibleTime) < 10000;

    // Se for erro de chunk OU um erro logo após acordar, tentamos o reload silencioso
    if (isChunkError || isWakeUpError) {
      return { hasError: true, error, shouldReload: true };
    }

    // Erro comum, mostra a UI de erro
    return { hasError: true, error, shouldReload: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Se já identificamos que deve recarregar em getDerivedStateFromError,
    // executamos a lógica de reload aqui.
    if (this.state.shouldReload) {
      const lastReload = sessionStorage.getItem('flat_lili_chunk_reload');
      const now = Date.now();

      // Proteção contra Loop Infinito:
      // Só recarrega se a última vez foi há mais de 10 segundos.
      // Isso evita que, se o erro for persistente (bug real), o app fique piscando para sempre.
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('flat_lili_chunk_reload', now.toString());
        window.location.reload();
        return;
      } else {
        // Se caiu no loop (erro persiste mesmo após reload), mostramos o erro real
        this.setState({ shouldReload: false });
      }
    }
  }

  public render() {
    // Se estiver aguardando reload, mostra tela de carregamento (evita o flash de erro)
    if (this.state.shouldReload) {
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="text-orange-500 animate-spin" size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-2 font-heading flex items-center justify-center gap-2">
                Atualizando o guia... <Sparkles className="text-orange-400 animate-pulse" size={20} />
              </h1>
            </div>
          </div>
        </div>
      );
    }

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