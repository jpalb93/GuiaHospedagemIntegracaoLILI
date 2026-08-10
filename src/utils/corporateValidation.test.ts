import { describe, expect, it } from 'vitest';
import { isValidCnpj, validateContractPricing } from './corporateValidation';

describe('corporateValidation', () => {
    it('valida dígitos verificadores e rejeita sequências repetidas', () => {
        expect(isValidCnpj('04.252.011/0001-10')).toBe(true);
        expect(isValidCnpj('04.252.011/0001-11')).toBe(false);
        expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    });

    it('exige preço positivo no modelo selecionado', () => {
        expect(
            validateContractPricing({ pricingModel: 'per_unit_monthly', unitMonthlyPrice: 3500 })
        ).toBeNull();
        expect(
            validateContractPricing({ pricingModel: 'package_monthly', packageMonthlyPrice: 0 })
        ).toBeTruthy();
        expect(validateContractPricing({ pricingModel: 'per_night' })).toBeTruthy();
    });
});
