import React from 'react';
import {
    Utensils, Map, Coffee, ShoppingBasket, CalendarHeart, HeartPulse
} from 'lucide-react';

/**
 * Tipos para as categorias de seção disponíveis
 */
export type SectionType =
    | 'flat'
    | 'rules'
    | 'markets'
    | 'restaurants'
    | 'cafes'
    | 'leisure'
    | 'events'
    | 'emergency';

/**
 * Configuração de uma seção de recomendações
 */
export interface SectionConfig {
    id: SectionType;
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
}

/**
 * Lista de seções disponíveis para o grid de recomendações
 */
export const SECTIONS: SectionConfig[] = [
    { id: 'flat', title: 'O Flat & Comodidades', icon: () => <span>🏠</span>, color: 'bg-orange-500' },
    { id: 'rules', title: 'Regras & Avisos', icon: () => <span>⚠️</span>, color: 'bg-red-500' },
    { id: 'markets', title: 'Mercados e Serviços', icon: ShoppingBasket, color: 'bg-green-500' },
    { id: 'restaurants', title: 'Bares e Restaurantes', icon: Utensils, color: 'bg-red-500' },
    { id: 'cafes', title: 'Cafés e Padarias', icon: Coffee, color: 'bg-amber-600' },
    { id: 'leisure', title: 'Passeios & Lazer', icon: Map, color: 'bg-blue-500' },
    { id: 'events', title: 'Eventos & Agenda', icon: CalendarHeart, color: 'bg-pink-500' },
    { id: 'emergency', title: 'SOS & Emergência', icon: HeartPulse, color: 'bg-red-600' }
];

/**
 * Mapeia o título da sheet para o ID interno
 */
export const SHEET_TITLE_MAP: Record<string, SectionType> = {
    'O Flat & Comodidades': 'flat',
    'Regras & Avisos': 'rules',
    'Mercados e Serviços': 'markets',
    'Bares e Restaurantes': 'restaurants',
    'Cafés e Padarias': 'cafes',
    'Passeios & Lazer': 'leisure',
    'Eventos & Agenda': 'events',
    'SOS & Emergência': 'emergency'
};
