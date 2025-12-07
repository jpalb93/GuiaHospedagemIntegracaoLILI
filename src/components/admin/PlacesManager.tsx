/**
 * Re-export do PlacesManager refatorado
 * O componente foi dividido em subcomponentes menores na pasta ./places/
 *
 * Estrutura:
 * - PlacesManager.tsx - Componente orquestrador
 * - PlaceFormModal.tsx - Modal de criar/editar
 * - PlaceItemCard.tsx - Card da lista
 * - constants.ts - Categorias e valores default
 */
export { PlacesManager as default } from './places';
