import { z } from 'zod';

// Enum para PaymentMethod
export const PaymentMethodSchema = z.enum(['pix', 'money', 'card', 'transfer']);
export const PaymentStatusSchema = z.enum(['paid', 'partial', 'pending', 'external', 'billed']);
export const ReservationBillingModeSchema = z.enum(['reservation', 'corporate']);

export const PaymentRecordSchema = z.object({
    id: z.string(),
    date: z.string(),
    time: z.string().optional(),
    amount: z.number().min(0),
    method: PaymentMethodSchema,
    type: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string(),
});

const dateYmd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido YYYY-MM-DD');

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
    paymentStatus: PaymentStatusSchema.optional(),
    totalAmount: z.number().min(0).optional(),
    depositAmount: z.number().min(0).optional(),
    paidAt: z.string().optional(),
    payments: z.array(PaymentRecordSchema).optional(),

    // Alertas
    guestAlertActive: z.boolean().optional(),
    guestAlertText: z.string().optional(),

    // Rating Interno
    guestRating: z.number().min(1).max(5).optional(),
    guestFeedback: z.string().optional(),

    // Datas e Horários
    checkInDate: dateYmd.optional(),
    checkoutDate: dateYmd.optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),

    // Status
    isReleased: z.boolean().optional(),
    manualDeactivation: z.boolean().optional(),

    // Extra / App Context
    id: z.string().optional(),
    favoritePlaces: z.array(z.string()).optional(),

    // Corporativo (opcional)
    companyId: z.string().optional(),
    contractId: z.string().optional(),
    allocationId: z.string().optional(),
    billingMode: ReservationBillingModeSchema.optional(),
});

// Inferência de tipo TypeScript a partir do Schema (opcional, se quiser substituir as interfaces manuais futuramente)
export type GuestConfig = z.infer<typeof GuestConfigSchema>;

const CompanyContactSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
});

export const CompanySchema = z.object({
    legalName: z.string().min(2, 'Razão social obrigatória'),
    tradeName: z.string().optional(),
    cnpj: z
        .string()
        .transform((v) => v.replace(/\D/g, ''))
        .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos'),
    documentNote: z.string().optional(),
    contacts: z
        .object({
            operational: CompanyContactSchema.optional(),
            billing: CompanyContactSchema.optional(),
        })
        .optional(),
    billingEmail: z.string().email().optional().or(z.literal('')),
    notes: z.string().optional(),
    status: z.enum(['active', 'delinquent', 'archived']).default('active'),
});

export const ContractSchema = z.object({
    companyId: z.string().min(1),
    companyName: z.string().min(1),
    status: z.enum(['draft', 'active', 'ended', 'cancelled']).default('active'),
    startDate: dateYmd,
    endDate: dateYmd.optional().or(z.literal('')),
    pricingModel: z.enum(['per_unit_monthly', 'package_monthly', 'per_night']),
    unitMonthlyPrice: z.number().min(0).optional(),
    packageMonthlyPrice: z.number().min(0).optional(),
    nightlyPrice: z.number().min(0).optional(),
    billingDay: z.number().int().min(1).max(28).default(10),
    prorationRule: z.enum(['daily', 'full_if_half_month', 'full_month']).default('daily'),
    emitsNf: z.boolean().default(true),
    nfNotes: z.string().optional(),
    securityDeposit: z.number().min(0).optional(),
    securityDepositStatus: z.enum(['none', 'held', 'returned', 'withheld']).optional(),
    notes: z.string().optional(),
});

export const AllocationSchema = z.object({
    contractId: z.string().min(1),
    companyId: z.string().min(1),
    propertyId: z.enum(['lili', 'integracao']),
    flatNumber: z.string().optional(),
    status: z.enum(['active', 'paused', 'ended']).default('active'),
    startDate: dateYmd,
    endDate: dateYmd.optional().or(z.literal('')),
    monthlyPrice: z.number().min(0).optional(),
    nightlyPrice: z.number().min(0).optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    notes: z.string().optional(),
});
