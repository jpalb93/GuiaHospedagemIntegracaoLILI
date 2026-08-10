export function isValidCnpj(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false;

    const calculateDigit = (base: string, weights: number[]) => {
        const sum = base
            .split('')
            .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const first = calculateDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const second = calculateDigit(
        digits.slice(0, 12) + first,
        [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );
    return digits.endsWith(`${first}${second}`);
}

export function validateContractPricing(input: {
    pricingModel: 'per_unit_monthly' | 'package_monthly' | 'per_night';
    unitMonthlyPrice?: number;
    packageMonthlyPrice?: number;
    nightlyPrice?: number;
}): string | null {
    const price =
        input.pricingModel === 'per_unit_monthly'
            ? input.unitMonthlyPrice
            : input.pricingModel === 'package_monthly'
              ? input.packageMonthlyPrice
              : input.nightlyPrice;
    return typeof price === 'number' && Number.isFinite(price) && price > 0
        ? null
        : 'Informe um preço maior que zero para o modelo selecionado';
}
