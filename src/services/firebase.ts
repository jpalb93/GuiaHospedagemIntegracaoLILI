/**
 * Firebase Services - Re-export
 *
 * Este arquivo foi modularizado em arquivos menores.
 * Veja: src/services/firebase/
 *
 * Estrutura:
 * - config.ts: Inicialização e helpers de cache
 * - places.ts: CRUD de lugares/locais
 * - reservations.ts: CRUD de reservas
 * - appSettings.ts: Configurações, hero images, sugestões
 * - content.ts: Dicas, curiosidades, reviews
 * - blockedDates.ts: Datas bloqueadas
 * - storage.ts: Upload de imagens
 * - auth.ts: Autenticação
 */

export * from './firebase/index';
