import React, { useMemo, useState } from 'react';
import { convertDec2BinFPSP, convertDec2HexFPSP } from '../operations';
import BitRegister from './BitRegister';

const parseInput = (raw: string): number => {
    const t = raw.trim();
    if (t === '') return NaN;
    const lower = t.toLowerCase();
    if (lower === 'infinity' || lower === '+infinity' || lower === '\u221e') return Infinity;
    if (lower === '-infinity' || lower === '-\u221e') return -Infinity;
    if (lower === 'nan') return NaN;
    return Number(t);
};

const DecToBin: React.FC = () => {
    const [raw, setRaw] = useState('3.14');

    const num = useMemo(() => parseInput(raw), [raw]);
    const binary = useMemo(() => convertDec2BinFPSP(num), [num]);
    const hex = useMemo(() => convertDec2HexFPSP(num), [num]);
    const bin32 = binary.replace(/\s+/g, '');

    return (
        <section className="panel">
            <header className="panel-head">
                <span className="panel-eyebrow">PROC.01</span>
                <h2>Decimal &rarr; IEEE 754 Single-Precision</h2>
                <p>Enter a decimal value and convert it to its 32-bit single-precision representation. Special cases (NaN, &plusmn;Infinity, &plusmn;0) are detected automatically.</p>
            </header>

            <div className="field-row">
                <label htmlFor="dec-input">Decimal input</label>
                <input
                    id="dec-input"
                    className="mono"
                    type="text"
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    placeholder="e.g. -19.625, Infinity, NaN"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>

            <BitRegister bin32={bin32} caption={Number.isNaN(num) ? 'NaN' : String(num)} />

            <div className="output-grid two">
                <div className="output-card">
                    <span className="output-label">i &middot; Binary</span>
                    <code className="output-value mono">{binary}</code>
                </div>
                <div className="output-card">
                    <span className="output-label">ii &middot; Hexadecimal</span>
                    <code className="output-value mono">0x{hex}</code>
                </div>
            </div>
        </section>
    );
};

export default DecToBin;