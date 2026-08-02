import { describe, it, expect } from '@rstest/core';
import { performOperation } from './operations';

// Unit tests for single-point precision addition operations.
describe('performOperation: addition', () => {
    const operandA = '47.787109375';   // 1.01111110010011(2) x 2^5
    const operandB = '9.98583984375';  // 1.00111111100011(2) x 2^3

    it('adds two full-precision operands to the exact decimal sum', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.decimal).toBe('57.77294921875');
    });

    it('produces the correct final hexadecimal representation', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.hex).toBe('42671780');
    });

    it('produces the correct final binary field representation', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.binary).toBe('0 10000100 11001110001011110000000');
    });

    it('correctly identifies the exponent difference during alignment', () => {
        const res = performOperation(operandA, operandB, 'addition', 'tiesToEven');
        expect(res.steps.some((s) => s.includes('Exponent Difference: 2'))).toBe(true);
    });

    it('is unaffected by rounding mode when there is no remainder to round', () => {
        const modes: Array<'tiesToEven' | 'chopping' | 'roundUp' | 'roundDown'> = [
            'tiesToEven', 'chopping', 'roundUp', 'roundDown',
        ];
        for (const mode of modes) {
            const res = performOperation(operandA, operandB, 'addition', mode);
            expect(res.decimal).toBe('57.77294921875');
        }
    });

    it('produces an identical result when operand A is supplied as IEEE hex instead of decimal', () => {
        // 423F2600 is the exact hex encoding of 47.787109375 in binary32.
        const res = performOperation('423F2600', operandB, 'addition', 'tiesToEven');
        expect(res.decimal).toBe('57.77294921875');
        expect(res.hex).toBe('42671780');
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

// Unit tests for different rounding-modes
describe('performOperation: rounding-modes on a genuine remainder', () => {
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

// Unit tests for single-point special cases
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
