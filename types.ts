import React from 'react';

// Definição genérica para ícones (Lucide ou outros)
export type IconType = React.ComponentType<any>;

export interface GuideSection {
  id: string;
  title: string;
  icon: IconType;
  color: string;
  content: React.ReactNode;
}

// Tipos de categorias para o CMS
export type PlaceCategory = 
  | 'burgers' 
  | 'skewers' 
  | 'salads' 
  | 'pasta' 
  | 'oriental' 
  | 'alacarte' 
  | 'selfservice' 
  | 'bars' 
  | 'cafes' 
  | 'attractions' 
  | 'essentials' 
  | 'snacks' 
  | 'emergency';

export interface PlaceRecommendation {
  id?: string; // ID do Firebase (opcional para os hardcoded)
  category?: PlaceCategory; // Categoria para filtro
  visible?: boolean; // Para ocultar sem deletar
  
  name: string;
  description: string;
  address?: string;
  tags: string[];
  imageUrl: string;
  distance?: string; // Campo novo para distância (ex: "500m", "10 min a pé")
  phoneNumber?: string; // Novo: Para delivery
  orderLink?: string;   // Novo: Link para pedir (iFood, site próprio)
}

export interface GuestConfig {
  guestName: string;
  lockCode: string;
  safeCode?: string;     // Mantido como opcional para compatibilidade com reservas antigas
  welcomeMessage?: string;
  adminNotes?: string;   // NOVA: Observações internas do admin
  checkInDate?: string;  // Data de Check-in (YYYY-MM-DD)
  checkoutDate?: string; // Data de expiração do link (YYYY-MM-DD)
  checkInTime?: string;  // Horário de Check-in
  checkOutTime?: string; // Horário de Check-out
}

// Interface para Reserva Salva no Banco de Dados
export interface Reservation extends GuestConfig {
  id?: string;
  createdAt: string;
  status: 'active' | 'cancelled';
}

// NOVA INTERFACE: Configurações Globais do App (Wi-Fi, Avisos e COFRE)
export interface AppConfig {
  wifiSSID: string;
  wifiPass: string;
  safeCode: string; // Nova senha global do cofre
  noticeActive: boolean;
  noticeText: string;
}

// NOVA INTERFACE: Sugestões Inteligentes Dinâmicas (AGORA SÃO LISTAS)
export interface TimeOfDaySuggestion {
  id: string; // Identificador único para exclusão
  title: string;
  description: string;
}

export interface SmartSuggestionsConfig {
  morning: TimeOfDaySuggestion[];
  lunch: TimeOfDaySuggestion[];
  sunset: TimeOfDaySuggestion[];
  night: TimeOfDaySuggestion[];
}

export enum AppMode {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
  CMS = 'CMS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface BlockedGuest {
  name: string;
  checkInDate?: string; // Se undefined ou "*", bloqueia sempre pelo nome
}
