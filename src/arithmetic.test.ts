import { describe, it, expect } from '@rstest/core';
import { performOperation } from './operations';

// Unit tests for single-precision addition — based on provided slide example:
describe('performOperation: addition', () => {
    const operandA = '9.726542319e15';
    const operandB = '8.8736373412e13';

    it('adds the two operands using ties-to-even rounding', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        // NOTE: this differs from the PS's G/R/S answer (9.815279 x10^15)
        // because the slide rounds to 7 significant decimal digits 
        expect(res.decimal).toBe('9815278024130560');
    });

    it('produces the correct final hexadecimal representation', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.hex).toBe('5A0B7BC6');
    });

    it('produces the correct final binary field representation with proper spacing', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.binary).toMatch(/^[01] [01]{8} [01]{23}$/);
    });
});

// Unit tests for single-point precision addition operations.
// NOTE: Please refer to the sample slide I sent for reference
describe('performOperation: multiplication', () => {
    const operandA = '0.5';
    const operandB = '-0.4375';

    it('multiplies to the expected decimal result', () => {
        const res = performOperation(operandA, operandB, 'multiplication', 'tiesToEven');
        expect(res.decimal).toBe('-0.21875');
    });

    it('produces the correct final hexadecimal representation', () => {
        const res = performOperation(operandA, operandB, 'multiplication', 'tiesToEven');
        expect(res.hex).toBe('BE600000');
    });

    it('adds exponents correctly (-1 + -2 = -3 before the +1 normalization shift)', () => {
        const res = performOperation(operandA, operandB, 'multiplication', 'tiesToEven');
        expect(res.steps.some((s) => s.includes('Exponents: 126 + 125 - 127 = 124'))).toBe(true);
    });

    it('assigns a negative sign when operands have opposite signs', () => {
        const res = performOperation(operandA, operandB, 'multiplication', 'tiesToEven');
        expect(res.binary.startsWith('1 ')).toBe(true); // sign bit = 1
    });

    it('assigns a positive sign when operands share the same sign', () => {
        const res = performOperation('0.5', '0.4375', 'multiplication', 'tiesToEven');
        expect(res.decimal).toBe('0.21875');
        expect(res.binary.startsWith('0 ')).toBe(true);
    });
});

// Unit tests for different rounding 
describe('performOperation: rounding on a genuine remainder', () => {
    const tieOperand = '407FFFFF';

    it('chopping truncates the exact remainder', () => {
        const res = performOperation(tieOperand, tieOperand, 'addition', 'chopping');
        expect(res.decimal).toBe('7.999999046325684');
        expect(res.hex).toBe('40FFFFFE');
    });

    it('roundDown matches chopping for this positive-sum case (toward -infinity = truncate)', () => {
        const res = performOperation(tieOperand, tieOperand, 'addition', 'roundDown');
        expect(res.decimal).toBe('7.999999046325684');
        expect(res.hex).toBe('40FFFFFE');
    });

    it('roundUp rounds away from the truncation on a positive remainder', () => {
        const res = performOperation(tieOperand, tieOperand, 'addition', 'roundUp');
        expect(res.decimal).toBe('8');
        expect(res.hex).toBe('41000000');
    });

    it('tiesToEven resolves the exact tie up, since the preceding kept digit is odd', () => {
        const res = performOperation(tieOperand, tieOperand, 'addition', 'tiesToEven');
        expect(res.decimal).toBe('8');
        expect(res.hex).toBe('41000000');
    });

    it('chopping and roundUp diverge on this input (proves rounding mode is actually applied)', () => {
        const chopped = performOperation(tieOperand, tieOperand, 'addition', 'chopping');
        const roundedUp = performOperation(tieOperand, tieOperand, 'addition', 'roundUp');
        expect(chopped.decimal).not.toBe(roundedUp.decimal);
    });
});

// Unit tests for single-precision special cases
describe('performOperation: special cases', () => {
    it('propagates NaN through addition', () => {
        const res = performOperation('NaN', '5', 'addition');
        expect(res.decimal).toBe('NaN');
        expect(res.hex).toBe('7FC00000');
    });

    it('propagates NaN through multiplication', () => {
        const res = performOperation('NaN', '2', 'multiplication');
        expect(res.decimal).toBe('NaN');
    });

    it('Infinity + Infinity = Infinity', () => {
        const res = performOperation('Infinity', 'Infinity', 'addition');
        expect(res.decimal).toBe('Infinity');
    });

    it('Infinity + (-Infinity) = NaN', () => {
        const res = performOperation('Infinity', '-Infinity', 'addition');
        expect(res.decimal).toBe('NaN');
    });

    it('Infinity + finite = Infinity', () => {
        const res = performOperation('Infinity', '5', 'addition');
        expect(res.decimal).toBe('Infinity');
    });

    it('0 + 0 = 0', () => {
        const res = performOperation('0', '0', 'addition');
        expect(res.decimal).toBe('0');
    });

    it('equal-magnitude opposite-sign addition yields exact zero', () => {
        const res = performOperation('5', '-5', 'addition');
        expect(res.decimal).toBe('0');
    });

    it('0 * Infinity = NaN', () => {
        const res = performOperation('0', 'Infinity', 'multiplication');
        expect(res.decimal).toBe('NaN');
    });

    it('Infinity * finite = Infinity', () => {
        const res = performOperation('Infinity', '2', 'multiplication');
        expect(res.decimal).toBe('Infinity');
    });

    it('Infinity * negative finite = -Infinity (sign correctly applied)', () => {
        const res = performOperation('Infinity', '-2', 'multiplication');
        expect(res.decimal).toBe('-Infinity');
    });

    it('0 * finite = 0', () => {
        const res = performOperation('0', '5', 'multiplication');
        expect(res.decimal).toBe('0');
    });
});

// Unit test for scientific-notation input parsing ("x10^" and "*10^" styles)
describe('performOperation: scientific notation input parsing', () => {
    it('parses "x10^" and "*10^" notation to the same result', () => {
        const resX = performOperation('9.726542319x10^15', '8.8736373412x10^13', 'addition', 'tiesToEven');
        const resStar = performOperation('9.726542319*10^15', '8.8736373412*10^13', 'addition', 'tiesToEven');
        expect(resX.decimal).toBe('9815278024130560');
        expect(resStar.decimal).toBe('9815278024130560');
    });
});
