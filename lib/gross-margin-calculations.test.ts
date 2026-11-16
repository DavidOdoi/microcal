import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGrossMargin, type GrossMarginInput } from './gross-margin-calculations.ts';
const base: GrossMarginInput = { mode: 'margin', revenue: 120000, cogs: 72000, unitCost: null, sellingPrice: null, targetMargin: 40 };
const near = (a: number, b: number) => assert.ok(Math.abs(a-b)<1e-8);
test('supplied revenue example yields $48,000 gross profit and 40% margin', () => { const r = calculateGrossMargin(base); assert.equal(r.profit,48000); assert.equal(r.margin,40); near(r.markup!,66.6666666667); });
test('unit margin and markup use different denominators', () => { const r = calculateGrossMargin({...base,unitCost:60,sellingPrice:100}); assert.equal(r.unitProfit,40); assert.equal(r.unitMargin,40); near(r.unitMarkup!,66.6666666667); });
test('target pricing produces a selling price rather than a markup price', () => { const r = calculateGrossMargin({...base,mode:'price',unitCost:60}); assert.equal(r.targetPrice,100); assert.equal(calculateGrossMargin({...base,mode:'price',unitCost:60,targetMargin:0}).targetPrice,60); });
test('negative margins and zero denominators are reported without infinity or NaN', () => {
 assert.equal(calculateGrossMargin({...base,revenue:80,cogs:100}).margin,-25);
 const zero=calculateGrossMargin({...base,revenue:0,cogs:100}); assert.equal(zero.profit,-100); assert.equal(zero.margin,null);
 const cost=calculateGrossMargin({...base,cogs:0,unitCost:0,sellingPrice:0}); assert.equal(cost.margin,100); assert.equal(cost.markup,null); assert.equal(cost.unitMarkup,null); assert.equal(cost.unitMargin,null);
 assert.equal(calculateGrossMargin({...base,mode:'price',unitCost:60,targetMargin:100}).targetPrice,null);
});
test('missing paired unit values, invalid amounts, modes and target margins fail', () => {
 for (const patch of [{unitCost:60},{mode:'price'},{mode:'x'},{revenue:-1},{cogs:NaN},{targetMargin:101}]) assert.throws(()=>calculateGrossMargin({...base,...patch} as GrossMarginInput),RangeError);
});
