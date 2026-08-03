import React from 'react';

interface BitRegisterProps {
    /** Any string containing 32 binary digits (spaces/other chars are stripped). */
    bin32: string;
    /** Optional caption shown above the register, e.g. the source decimal value. */
    caption?: string;
}

const clean = (s: string) => {
    const digits = (s || '').replace(/[^01]/g, '');
    return (digits + '0'.repeat(32)).slice(0, 32);
};

const BitRegister: React.FC<BitRegisterProps> = ({ bin32, caption }) => {
    const bits = clean(bin32);
    const sign = bits.slice(0, 1);
    const exponent = bits.slice(1, 9);
    const mantissa = bits.slice(9, 32);

    const expVal = parseInt(exponent, 2);
    const bias = expVal - 127;

    const renderCells = (str: string, field: 'sign' | 'exp' | 'mant') => (
        <div className="bit-cells">
            {str.split('').map((bit, i) => (
                <span key={i} className={`bit-cell bit-${field}`}>{bit}</span>
            ))}
        </div>
    );

    return (
        <div className="bit-register">
            {caption && <div className="bit-register-caption">register · {caption}</div>}
            <div className="bit-register-row">
                <div className="bit-field">
                    {renderCells(sign, 'sign')}
                    <span className="bit-field-label">S</span>
                </div>
                <div className="bit-field">
                    {renderCells(exponent, 'exp')}
                    <span className="bit-field-label">exponent (8)</span>
                </div>
                <div className="bit-field">
                    {renderCells(mantissa, 'mant')}
                    <span className="bit-field-label">mantissa (23)</span>
                </div>
            </div>
            <div className="bit-register-readout">
                <span><b>sign</b> {sign === '0' ? '+' : '\u2212'}</span>
                <span><b>E</b> {expVal} <i>(bias 127 &rarr; {bias})</i></span>
                <span className="mono"><b>M</b> {mantissa}</span>
            </div>
        </div>
    );
};

export default BitRegister;