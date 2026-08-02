import { describe, it, expect } from '@rstest/core';
import {
    addOneToMagnitude,
    demonstrateRoundingMethods
} from './operations';

// Unit tests for addOneToMagnitude
describe('addOneToMagnitude', () => {
    it('increments a binary magnitude with no carry', () => {
        expect(addOneToMagnitude('1.100', true)).toBe('1.101');
    });

    it('handles carry propagation in binary', () => {
        expect(addOneToMagnitude('1.111', true)).toBe('10.000');
    });

    it('increments a decimal magnitude with no carry', () => {
        expect(addOneToMagnitude('3.14', false)).toBe('3.15');
    });

    it('handles carry propagation in decimal', () => {
        expect(addOneToMagnitude('9.99', false)).toBe('10.00');
    });

    it('handles integer-only magnitudes', () => {
        expect(addOneToMagnitude('999', false)).toBe('1000');
    });
});

// Unit tests for demonstrateRoundingMethods
describe('demonstrateRoundingMethods', () => {
    describe('PS Question 1: -1.86855, decimal rounding', () => {
        describe('a) 4 decimal digits (3 fractional digits kept)', () => {
            const res = demonstrateRoundingMethods('-1.86855', false, 3);

            it('truncates to -1.868', () => {
                expect(res.chopping).toBe('-1.868');
            });

            it('rounds up (toward +infinity) to -1.868', () => {
                expect(res.roundUp).toBe('-1.868');
            });

            it('rounds down (toward -infinity) to -1.869', () => {
                expect(res.roundDown).toBe('-1.869');
            });

            it('rounds to nearest, ties to even, to -1.869', () => {
                expect(res.tiesToEven).toBe('-1.869');
            });
        });

        describe('b) 3 decimal digits (2 fractional digits kept)', () => {
            const res = demonstrateRoundingMethods('-1.86855', false, 2);

            it('truncates to -1.86', () => {
                expect(res.chopping).toBe('-1.86');
            });

            it('rounds up (toward +infinity) to -1.86', () => {
                expect(res.roundUp).toBe('-1.86');
            });

            it('rounds down (toward -infinity) to -1.87', () => {
                expect(res.roundDown).toBe('-1.87');
            });

            it('rounds to nearest, ties to even, to -1.87', () => {
                expect(res.tiesToEven).toBe('-1.87');
            });
        });
    });

    describe('PS Question 2: -1.011100, binary rounding', () => {
        describe('a) 4 binary digits (3 fractional bits kept)', () => {
            const res = demonstrateRoundingMethods('-1.011100', true, 3);

            it('truncates to -1.011', () => {
                expect(res.chopping).toBe('-1.011');
            });

            it('rounds up (toward +infinity) to -1.011', () => {
                expect(res.roundUp).toBe('-1.011');
            });

            it('rounds down (toward -infinity) to -1.100', () => {
                expect(res.roundDown).toBe('-1.100');
            });

            it('rounds to nearest, ties to even, to -1.100', () => {
                expect(res.tiesToEven).toBe('-1.100');
            });
        });

        describe('b) 3 binary digits (2 fractional bits kept)', () => {
            const res = demonstrateRoundingMethods('-1.011100', true, 2);

            it('truncates to -1.01', () => {
                expect(res.chopping).toBe('-1.01');
            });

            it('rounds up (toward +infinity) to -1.01', () => {
                expect(res.roundUp).toBe('-1.01');
            });

            it('rounds down (toward -infinity) to -1.10', () => {
                expect(res.roundDown).toBe('-1.10');
            });

            it('rounds to nearest, ties to even, to -1.10', () => {
                expect(res.tiesToEven).toBe('-1.10');
            });
        });
    });
});