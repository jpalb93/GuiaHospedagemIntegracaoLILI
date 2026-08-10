import { describe, it, expect } from 'vitest';
import {
    activeDaysInMonth,
    applyProration,
    buildInvoiceItems,
    daysInCompetence,
    dueDateForCompetence,
} from './corporateBilling';
import { Allocation, Contract } from '../types';

describe('corporateBilling', () => {
    it('calcula dias no mês e vencimento', () => {
        expect(daysInCompetence('2026-02')).toBe(28);
        expect(dueDateForCompetence('2026-03', 10)).toBe('2026-03-10');
        expect(dueDateForCompetence('2026-02', 31)).toBe('2026-02-28');
    });

    it('conta dias ativos com overlap parcial', () => {
        expect(activeDaysInMonth('2026-03-15', '2026-04-10', '2026-03')).toBe(17);
        expect(activeDaysInMonth('2026-02-01', undefined, '2026-03')).toBe(31);
        expect(activeDaysInMonth('2026-04-01', undefined, '2026-03')).toBe(0);
        expect(activeDaysInMonth('2026-03-01', '2026-04-01', '2026-04')).toBe(0);
    });

    it('aplica rateio daily e full_if_half_month', () => {
        expect(applyProration(3100, 10, 31, 'daily')).toBe(1000);
        expect(applyProration(3000, 20, 30, 'full_if_half_month')).toBe(3000);
        expect(applyProration(3000, 10, 30, 'full_if_half_month')).toBe(1000);
        expect(applyProration(3000, 1, 30, 'full_month')).toBe(3000);
    });

    it('gera itens per_unit_monthly', () => {
        const contract: Contract = {
            companyId: 'c1',
            companyName: 'Acme',
            status: 'active',
            startDate: '2026-01-01',
            pricingModel: 'per_unit_monthly',
            unitMonthlyPrice: 3100,
            billingDay: 10,
            prorationRule: 'daily',
            emitsNf: true,
            createdAt: '',
            updatedAt: '',
        };
        const allocations: Allocation[] = [
            {
                id: 'a1',
                contractId: 'ct1',
                companyId: 'c1',
                propertyId: 'integracao',
                flatNumber: '201',
                status: 'active',
                startDate: '2026-03-01',
                createdAt: '',
                updatedAt: '',
            },
        ];
        const items = buildInvoiceItems(contract, allocations, '2026-03');
        expect(items).toHaveLength(1);
        expect(items[0].amount).toBe(3100);
        expect(items[0].flatNumber).toBe('201');
    });

    it('gera um item de pacote', () => {
        const contract: Contract = {
            companyId: 'c1',
            companyName: 'Acme',
            status: 'active',
            startDate: '2026-01-01',
            pricingModel: 'package_monthly',
            packageMonthlyPrice: 10000,
            billingDay: 10,
            prorationRule: 'full_month',
            emitsNf: true,
            createdAt: '',
            updatedAt: '',
        };
        const allocations: Allocation[] = [
            {
                id: 'a1',
                contractId: 'ct1',
                companyId: 'c1',
                propertyId: 'integracao',
                flatNumber: '201',
                status: 'active',
                startDate: '2026-03-01',
                createdAt: '',
                updatedAt: '',
            },
            {
                id: 'a2',
                contractId: 'ct1',
                companyId: 'c1',
                propertyId: 'integracao',
                flatNumber: '202',
                status: 'active',
                startDate: '2026-03-01',
                createdAt: '',
                updatedAt: '',
            },
        ];
        const items = buildInvoiceItems(contract, allocations, '2026-03');
        expect(items).toHaveLength(1);
        expect(items[0].type).toBe('package');
        expect(items[0].amount).toBe(10000);
    });
});
