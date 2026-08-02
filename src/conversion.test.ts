import { describe, it, expect } from '@rstest/core';
import {
    convertDec2BinFPSP,
    convertDec2HexFPSP,
} from './operations';

// Unit tests for decimal to IEEE 754 Single Precision (Binary & Hex)
describe('convertDec2BinFPSP', () => {
    describe('special values', () => {
        it('converts NaN', () => {
            expect(convertDec2BinFPSP(NaN)).toBe('0111 1111 1100 0000 0000 0000 0000 0000');
        });

        it('converts +Infinity', () => {
            expect(convertDec2BinFPSP(Infinity)).toBe('0111 1111 1000 0000 0000 0000 0000 0000');
        });

        it('converts -Infinity', () => {
            expect(convertDec2BinFPSP(-Infinity)).toBe('1111 1111 1000 0000 0000 0000 0000 0000');
        });

        it('converts +0', () => {
            expect(convertDec2BinFPSP(0)).toBe('0000 0000 0000 0000 0000 0000 0000 0000');
        });

        it('converts -0', () => {
            expect(convertDec2BinFPSP(-0)).toBe('1000 0000 0000 0000 0000 0000 0000 0000');
        });
    });

    describe('PS Question 1: 1.1101 x 2^135, single precision', () => {
        // 1.1101_2 = 1.8125 decimal. 135 exceeds the largest supported
        // single-precision exponent (127), so the represents as 0x7F800000
        it('overflows to +Infinity since 135 > 127 (biggest supported E)', () => {
            const decimalValue = 1.8125 * Math.pow(2, 135);
            expect(convertDec2BinFPSP(decimalValue)).toBe('0111 1111 1000 0000 0000 0000 0000 0000');
        });
    });

    describe('PS Question 3: 1.1101 x 2^-135, single precision', () => {
        // -135 is less than the smallest supported single-precision E (-126),
        // so shift the radix point 9 places left and represent as a denormalized number: 0x00007400
        it('produces a denormalized result since -135 < -126 (smallest supported E)', () => {
            const decimalValue = 1.8125 * Math.pow(2, -135);
            expect(convertDec2BinFPSP(decimalValue)).toBe('0000 0000 0000 0000 0111 0100 0000 0000');
        });
    });

    describe('reverse of PS Question 5 (decimal -> binary, single precision)', () => {
        // Converts 0xC1C20000 -> -24.25. 
        it('converts -24.25 back to 1100 0001 1100 0010 0000 0000 0000 0000', () => {
            expect(convertDec2BinFPSP(-24.25)).toBe('1100 0001 1100 0010 0000 0000 0000 0000');
        });
    });

    describe('edge magnitudes', () => {
        it('round-trips fractional powers of two exactly', () => {
            [0.25, 0.125, 4, 8, 16].forEach(n => {
                const bin = convertDec2BinFPSP(n).replace(/\s+/g, '');
                const uint = parseInt(bin, 2);
                const f = new Float32Array(new Uint32Array([uint]).buffer)[0];
                expect(f).toBe(n);
            });
        });
    });
});

describe('convertDec2HexFPSP', () => {
    describe('special values', () => {
        it('converts NaN', () => {
            expect(convertDec2HexFPSP(NaN)).toBe('7FC00000');
        });

        it('converts +Infinity', () => {
            expect(convertDec2HexFPSP(Infinity)).toBe('7F800000');
        });

        it('converts -Infinity', () => {
            expect(convertDec2HexFPSP(-Infinity)).toBe('FF800000');
        });

        it('converts +0', () => {
            expect(convertDec2HexFPSP(0)).toBe('00000000');
        });

        it('converts -0', () => {
            expect(convertDec2HexFPSP(-0)).toBe('80000000');
        });
    });

    describe('PS Question 1: 1.1101 x 2^135, single precision', () => {
        it('overflows to hex 0x7F800000 since 135 > 127 (biggest supported E)', () => {
            const decimalValue = 1.8125 * Math.pow(2, 135);
            expect(convertDec2HexFPSP(decimalValue)).toBe('7F800000');
        });
    });

    describe('PS Question 3: 1.1101 x 2^-135, single precision', () => {
        it('produces denormalized hex 0x00007400 since -135 < -126 (smallest supported E)', () => {
            const decimalValue = 1.8125 * Math.pow(2, -135);
            expect(convertDec2HexFPSP(decimalValue)).toBe('00007400');
        });
    });

    describe('PS Question 5: decimal equivalent of 0xC1C20000', () => {
        // 0xC1C20000 -> -24.25 (S=1, e'=131 -> e=4,significand 1.100001 x 2^4 -> -11000.01_2 -> -24.25)
        it('converts -24.25 to hex C1C20000', () => {
            expect(convertDec2HexFPSP(-24.25)).toBe('C1C20000');
        });
    });
});