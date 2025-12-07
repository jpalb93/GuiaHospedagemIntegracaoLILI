/**
 * Re-export do GuestRecommendations refatorado
 * O componente foi dividido em subcomponentes menores na pasta ./recommendations/
 *
 * Estrutura:
 * - GuestRecommendations.tsx - Componente principal com grid e sheets
 * - ExpandablePlaceList.tsx - Lista expansível de lugares
 * - PlacesCategory.tsx - Categoria de lugares com header
 * - sheets/FlatAmenitiesSheet.tsx - Conteúdo do flat por propertyId
 * - sheets/RulesSheet.tsx - Regras e avisos
 * - sheets/EmergencySheet.tsx - Números de emergência e hospitais
 */
export { GuestRecommendations as default } from './recommendations';
