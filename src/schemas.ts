import { z } from 'zod';

// Enum para PaymentMethod
export const PaymentMethodSchema = z.enum(['pix', 'money', 'card']);

// Schema base para GuestConfig
export const GuestConfigSchema = z.object({
    guestName: z.string().min(1, 'Nome do hóspede é obrigatório'),
    email: z.string().email().optional(),
    guestPhone: z.string().optional(),
    propertyId: z.enum(['lili', 'integracao']).optional(),
    flatNumber: z.string().optional(),
    lockCode: z.string().optional(),
    safeCode: z.string().optional(),
    welcomeMessage: z.string().optional(),
    adminNotes: z.string().optional(),
    wifiSSID: z.string().optional(),
    wifiPass: z.string().optional(),
    guestCount: z.number().int().positive().optional(),
    paymentMethod: PaymentMethodSchema.optional(),

    // Alertas
    guestAlertActive: z.boolean().optional(),
    guestAlertText: z.string().optional(),

    // Rating Interno
    guestRating: z.number().min(1).max(5).optional(),
    guestFeedback: z.string().optional(),

    // Datas e Horários
    checkInDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido YYYY-MM-DD')
        .optional(),
    checkoutDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido YYYY-MM-DD')
        .optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),

    // Status
    // Status
    isReleased: z.boolean().optional(),
    manualDeactivation: z.boolean().optional(),
});

// Inferência de tipo TypeScript a partir do Schema (opcional, se quiser substituir as interfaces manuais futuramente)
export type GuestConfig = z.infer<typeof GuestConfigSchema>;
