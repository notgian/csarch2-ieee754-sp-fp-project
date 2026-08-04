import React, { useMemo, useState } from 'react';
import { demonstrateRoundingMethods, isValidMagnitude } from '../operations';

type Base = 'decimal' | 'binary';
type MethodKey = 'chopping' | 'roundUp' | 'roundDown' | 'tiesToEven';

const METHOD_META: { key: MethodKey; label: string; rule: string }[] = [
    { key: 'chopping', label: 'Truncating', rule: 'Truncate \u2014 always toward zero' },
    { key: 'roundUp', label: 'Round Up', rule: 'Toward +\u221e' },
    { key: 'roundDown', label: 'Round Down', rule: 'Toward \u2212\u221e' },
    { key: 'tiesToEven', label: 'Ties to Even', rule: 'Nearest; exact ties resolve to an even last digit' },
];

const RoundingDemo: React.FC = () => {
    const [base, setBase] = useState<Base>('binary');
    const [value, setValue] = useState('1.101101101');
    const [target, setTarget] = useState(4);

    const isBinary = base === 'binary';
    const isValid = isValidMagnitude(value, isBinary);

    const results = useMemo(() => {
        try {
            return demonstrateRoundingMethods(value, isBinary, target) as Record<MethodKey, string>;
        } catch {
            return null;
        }
    }, [value, isBinary, target]);

    const strip = useMemo(() => {
        const isNeg = value.trim().startsWith('-');
        const mag = isNeg ? value.trim().slice(1) : value.trim();
        const [ip, fpRaw] = mag.includes('.') ? mag.split('.') : [mag, ''];
        const fp = fpRaw ?? '';
        return {
            isNeg,
            ip: ip || '0',
            kept: fp.slice(0, target),
            guard: fp.slice(target, target + 1),
            sticky: fp.slice(target + 1),
        };
    }, [value, target]);

    return (
        <section className="panel">
            <header className="panel-head">
                <span className="panel-eyebrow">PROC.02</span>
                <h2>Rounding Methods</h2>
                <p>Round a binary or decimal magnitude to a target number of fractional digits, and compare all four IEEE 754 rounding methods side by side.</p>
            </header>

            <div className="field-grid">
                <div className="field-row">
                    <label htmlFor="round-base">Input format</label>
                    <select id="round-base" value={base} onChange={(e) => setBase(e.target.value as Base)}>
                        <option value="binary">Binary</option>
                        <option value="decimal">Decimal</option>
                    </select>
                </div>
                <div className="field-row">
                    <label htmlFor="round-value">Value</label>
                    <input
                        id="round-value"
                        className="mono"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder={isBinary ? 'e.g. 1.101101101' : 'e.g. 3.14159'}
                    />
                </div>
                <div className="field-row">
                    <label htmlFor="round-target">Target digits</label>
                    <input
                        id="round-target"
                        className="mono"
                        type="number"
                        min={0}
                        value={target}
                        onChange={(e) => setTarget(Math.max(0, Number(e.target.value) || 0))}
                    />
                </div>
            </div>

            {!isValid && (
                <p className="output-rule">
                    Not a valid {isBinary ? 'binary' : 'decimal'} value &mdash; every rounding method returns NaN.
                </p>
            )}

            {isValid && (
            <div className="digit-strip" aria-hidden="true">
                {strip.isNeg && <span className="digit-cell digit-sign">&minus;</span>}
                {strip.ip.split('').map((d, i) => (
                    <span key={`i${i}`} className="digit-cell digit-int">{d}</span>
                ))}
                <span className="digit-point">.</span>
                {strip.kept.split('').map((d, i) => (
                    <span key={`k${i}`} className="digit-cell digit-kept">{d}</span>
                ))}
                {strip.guard && <span className="digit-cell digit-guard">{strip.guard}</span>}
                {strip.sticky.split('').map((d, i) => (
                    <span key={`s${i}`} className="digit-cell digit-sticky">{d}</span>
                ))}
            </div>
            )}
            {isValid && (
            <div className="digit-legend">
                <span><i className="swatch swatch-kept" />kept digits</span>
                <span><i className="swatch swatch-guard" />guard digit</span>
                <span><i className="swatch swatch-sticky" />sticky remainder</span>
            </div>
            )}

            {results && (
                <div className="output-grid two">
                    {METHOD_META.map((m) => (
                        <div className="output-card" key={m.key}>
                            <span className="output-label">{m.label}</span>
                            <code className="output-value mono">{results[m.key]}</code>
                            <span className="output-rule">{m.rule}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RoundingDemo;