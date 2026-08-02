import React, { useState } from 'react';
import { performOperation } from '../operations';
import BitRegister from './BitRegister';

type Op = 'addition' | 'multiplication';
type Mode = 'tiesToEven' | 'chopping' | 'roundUp' | 'roundDown';

const MODE_LABEL: Record<Mode, string> = {
    tiesToEven: 'Round to Nearest, Ties to Even',
    chopping: 'Chopping (Truncation)',
    roundUp: 'Round Up (\u2192 +\u221e)',
    roundDown: 'Round Down (\u2192 \u2212\u221e)',
};

type OpResult = ReturnType<typeof performOperation>;

const lineClass = (line: string) => {
    if (line.startsWith('===')) return 'term-header';
    if (line.startsWith('---')) return 'term-sub';
    if (line.startsWith('Special Case')) return 'term-danger';
    if (line.trim() === '') return 'term-blank';
    return 'term-line';
};

const ArithmeticOp: React.FC = () => {
    const [a, setA] = useState('3.25');
    const [b, setB] = useState('1.5');
    const [op, setOp] = useState<Op>('addition');
    const [mode, setMode] = useState<Mode>('tiesToEven');
    const [result, setResult] = useState<OpResult | null>(null);

    const run = () => {
        setResult(performOperation(a, b, op, mode));
    };

    return (
        <section className="panel">
            <header className="panel-head">
                <span className="panel-eyebrow">PROC.03</span>
                <h2>Addition &amp; Multiplication with Rounding</h2>
                <p>Operands accept a decimal value or an 8-digit IEEE hexadecimal value (e.g. 40490FDB). Every step of alignment, normalization, and rounding is logged below.</p>
            </header>

            <div className="field-grid">
                <div className="field-row">
                    <label htmlFor="operand-a">Operand A</label>
                    <input id="operand-a" className="mono" value={a} onChange={(e) => setA(e.target.value)} spellCheck={false} autoComplete="off" />
                </div>
                <div className="field-row">
                    <label htmlFor="operand-b">Operand B</label>
                    <input id="operand-b" className="mono" value={b} onChange={(e) => setB(e.target.value)} spellCheck={false} autoComplete="off" />
                </div>
                <div className="field-row">
                    <label htmlFor="op-select">Operation</label>
                    <select id="op-select" value={op} onChange={(e) => setOp(e.target.value as Op)}>
                        <option value="addition">Addition</option>
                        <option value="multiplication">Multiplication</option>
                    </select>
                </div>
                <div className="field-row">
                    <label htmlFor="mode-select">Rounding mode</label>
                    <select id="mode-select" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                        {(Object.keys(MODE_LABEL) as Mode[]).map((key) => (
                            <option key={key} value={key}>{MODE_LABEL[key]}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="button" className="execute-btn" onClick={run}>Execute</button>

            {result && (
                <>
                    <div className="terminal">
                        {result.steps.join('\n').split('\n').map((line, i) => (
                            <div key={i} className={lineClass(line)}>{line || '\u00a0'}</div>
                        ))}
                    </div>

                    <BitRegister bin32={result.binary.replace(/\s+/g, '')} caption={`result = ${result.decimal}`} />

                    <div className="output-grid three">
                        <div className="output-card">
                            <span className="output-label">i &middot; Binary</span>
                            <code className="output-value mono">{result.binarySpaced4}</code>
                        </div>
                        <div className="output-card">
                            <span className="output-label">ii &middot; Hexadecimal</span>
                            <code className="output-value mono">0x{result.hex}</code>
                        </div>
                        <div className="output-card">
                            <span className="output-label">iii &middot; Decimal</span>
                            <code className="output-value mono">{result.decimal}</code>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default ArithmeticOp;