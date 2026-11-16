export type GrossMarginInput = { mode: 'margin' | 'price'; revenue: number; cogs: number; unitCost: number | null; sellingPrice: number | null; targetMargin: number };
export function validateGrossMargin(v: GrossMarginInput): string[] {
 const errors: string[] = [];
 if (!['margin', 'price'].includes(v.mode)) errors.push('Choose Calculate Margin or Calculate Selling Price.');
 for (const [key, value] of Object.entries(v)) if (key !== 'mode' && value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1e12)) errors.push(`${key}: enter a finite nonnegative amount.`);
 if (v.targetMargin > 100) errors.push('Target margin must be from 0% to 100%.');
 if (v.mode === 'price' && v.unitCost === null) errors.push('Enter unit cost to calculate a selling price.');
 if (v.mode === 'margin' && ((v.unitCost === null) !== (v.sellingPrice === null))) errors.push('Enter both optional unit cost and selling price, or leave both blank.');
 return errors;
}
export function calculateGrossMargin(v: GrossMarginInput) {
 const errors = validateGrossMargin(v); if (errors.length) throw new RangeError(errors.join(' '));
 const profit = v.revenue - v.cogs;
 const margin = v.revenue === 0 ? null : profit / v.revenue * 100;
 const markup = v.cogs === 0 ? null : profit / v.cogs * 100;
 const unitProfit = v.unitCost !== null && v.sellingPrice !== null ? v.sellingPrice - v.unitCost : null;
 const unitMargin = unitProfit !== null && v.sellingPrice !== 0 ? unitProfit / v.sellingPrice! * 100 : null;
 const unitMarkup = unitProfit !== null && v.unitCost !== 0 ? unitProfit / v.unitCost! * 100 : null;
 const targetPrice = v.unitCost !== null && v.targetMargin < 100 ? v.unitCost / (1 - v.targetMargin / 100) : null;
 return { profit, margin, markup, unitProfit, unitMargin, unitMarkup, targetPrice };
}
