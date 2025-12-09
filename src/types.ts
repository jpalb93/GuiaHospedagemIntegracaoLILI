import React from 'react';

// Definição genérica para ícones (Lucide ou outros)
export type IconType = React.ComponentType<
    React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }
>;

export type PropertyId = 'lili' | 'integracao';

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
    | 'events'
    | 'essentials'
    | 'snacks'
    | 'emergency'
    | 'laundry'
    | 'salon'
    | 'gym'
    | 'bikes'
    | 'souvenirs'
    | 'pharmacies';

export interface PlaceRecommendation {
    id?: string; // ID do Firebase (opcional para os hardcoded)
    category?: PlaceCategory; // Categoria para filtro
    visible?: boolean; // Para ocultar sem deletar

    name: string;
    description: string;
    address?: string;
    tags: string[];
    imageUrl: string;
    mapsLink?: string; // Link para o Google Maps
    distance?: string; // Campo novo para distância (ex: "500m", "10 min a pé")
    phoneNumber?: string; // Novo: Para delivery
    whatsapp?: string; // Novo: Para contato direto via WhatsApp
    orderLink?: string; // Novo: Link para pedir (iFood, site próprio)

    // I18n Fields (Optional - Populated by AI)
    name_en?: string;
    description_en?: string;
    distance_en?: string;
    name_es?: string;
    description_es?: string;
    distance_es?: string;

    // NOVOS CAMPOS PARA EVENTOS
    eventDate?: string; // Data do evento (YYYY-MM-DD)
    eventEndDate?: string; // Data de término (opcional, para festivais de dias)
    eventTime?: string; // Hora de inicio (HH:MM) - Opcional
    eventEndTime?: string; // Hora de fim (HH:MM) - Opcional
}

export type PaymentMethod = 'pix' | 'money' | 'card';

export interface GuestConfig {
    guestName: string;
    email?: string; // NOVO: Email do hóspede
    guestPhone?: string; // NOVO: Telefone do hóspede para envio de lembretes
    propertyId?: 'lili' | 'integracao'; // NOVO: Identificador da propriedade (opcional para compatibilidade)
    flatNumber?: string; // NOVO: Número do flat (apenas para Integração)
    lockCode?: string; // Opcional agora, pois Integração não usa
    safeCode?: string; // Mantido como opcional para compatibilidade com reservas antigas
    welcomeMessage?: string;
    adminNotes?: string; // NOVA: Observações internas do admin
    wifiSSID?: string; // Novo
    wifiPass?: string; // Novo
    guestCount?: number; // Novo: Quantidade de hóspedes
    paymentMethod?: PaymentMethod; // Novo: Forma de pagamento
    // NOVOS CAMPOS DE ALERTA ESPECÍFICO
    guestAlertActive?: boolean;
    guestAlertText?: string;

    checkInDate?: string; // Data de Check-in (YYYY-MM-DD)
    checkoutDate?: string; // Data de expiração do link (YYYY-MM-DD)
    checkInTime?: string; // Horário de Check-in
    checkOutTime?: string; // Horário de Check-out
    isReleased?: boolean; // Indica se o acesso foi liberado (pela API)
}

// Interface para Reserva Salva no Banco de Dados
export interface Reservation extends GuestConfig {
    id?: string;
    shortId?: string; // Código curto para acesso (ex: LILI01)
    createdAt: string;
    status: 'active' | 'cancelled' | 'pending';
}

// --- DERIVED TYPES (Single Source of Truth) ---

/**
 * Form data for creating/editing reservations
 * Derived from Reservation to ensure consistency
 */
export type ReservationFormData = Pick<
    Reservation,
    | 'guestName'
    | 'guestPhone'
    | 'propertyId'
    | 'flatNumber'
    | 'lockCode'
    | 'welcomeMessage'
    | 'adminNotes'
    | 'guestAlertActive'
    | 'guestAlertText'
    | 'checkInDate'
    | 'checkoutDate'
    | 'checkInTime'
    | 'checkOutTime'
    | 'guestCount'
    | 'paymentMethod'
    | 'email'
> & {
    editingId: string | null; // Form-specific field
};

/**
 * Guest access credentials (WiFi, codes)
 * Derived from GuestConfig for type safety
 */
export type GuestAccessData = Pick<
    GuestConfig,
    'lockCode' | 'safeCode' | 'wifiSSID' | 'wifiPass'
>;

/**
 * Guest contact information
 * Derived from GuestConfig for consistency
 */
export type GuestContactData = Pick<
    GuestConfig,
    'guestName' | 'guestPhone' | 'email'
>;


// Interface para Avaliações (Reviews)
export interface GuestReview {
    id?: string;
    name: string;
    text: string;
    rating?: number; // 1 a 5 (Opcional, default 5)
    date?: string; // Data aproximada (ex: "Out 2023")
}

// NOVA INTERFACE: Bloqueio de Datas (Calendário)
export interface BlockedDateRange {
    id?: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reason?: string; // Motivo (ex: Manutenção, Férias)
}

export interface MessageTemplates {
    checkin: string;
    checkout: string;
    invite: string;
}

// NOVA INTERFACE: Configurações Globais do App (Wi-Fi, Avisos e COFRE)
export interface AppConfig {
    wifiSSID: string;
    wifiPass: string;
    safeCode: string; // Nova senha global do cofre
    noticeActive: boolean;
    noticeText: string;
    globalNotices?: Record<string, { active: boolean; text: string }>; // Novo: Avisos por propriedade
    hostPhones?: Record<string, string>; // Novo: Telefones por propriedade
    aiSystemPrompt?: string; // O Cérebro da IA (Dinâmico - Default/Lili)
    aiSystemPrompt_en?: string; // Novo: Prompt em Inglês
    aiSystemPrompt_es?: string; // Novo: Prompt em Espanhol
    aiSystemPrompts?: Record<string, string>; // Novo: Prompts por propriedade (ex: { integracao: "..." })
    cityCuriosities?: CityCuriosity[]; // Curiosidades da Cidade (Dinâmico)
    checklist?: ChecklistItem[]; // Novo: Itens de Vistoria
    messageTemplates?: MessageTemplates; // Novo: Templates de mensagem
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
    CMS = 'CMS',
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

// NOVA INTERFACE: Dica do Flat (Tip)
export interface Tip {
    id?: string;
    type: 'curiosity' | 'event'; // Mantendo compatibilidade com StoryItem
    title: string;
    subtitle: string;
    content: string;
    iconName: string; // Nome do ícone (ex: 'Wifi', 'Key') para mapeamento
    image?: string;

    // I18n Fields
    title_en?: string;
    subtitle_en?: string;

    content_en?: string;
    title_es?: string;
    subtitle_es?: string;
    content_es?: string;

    order?: number; // Para ordenação personalizada
    visible?: boolean;
}

// NOVA INTERFACE: Curiosidade da Cidade
export interface CityCuriosity {
    id?: string;
    text: string;
    text_en?: string; // I18n Field
    text_es?: string;
    image?: string; // URL da imagem personalizada
    visible?: boolean;
}

// NOVA INTERFACE: Item de Vistoria (Checklist)
export interface ChecklistItem {
    id: string;
    label: string;
    icon?: string; // Nome do ícone (opcional)
    active: boolean;
    category?: string; // Adicionado: Categoria para agrupar itens de checklist
}

// NOVA INTERFACE: Permissões de Usuário (Multi-Tenant)
export type UserRole = 'super_admin' | 'property_manager';

export interface UserPermission {
    email: string;
    role: UserRole;
    allowedProperties: PropertyId[]; // Quais propriedades este usuário pode ver/editar
}
