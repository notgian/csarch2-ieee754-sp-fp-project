import { useState } from 'react';
import './App.css';
import DecToBin from './components/DecToBin';
import RoundingDemo from './components/RoundingDemo';
import ArithmeticOp from './components/ArithmeticOp';

type ProcId = 1 | 2 | 3;

const PROCESSES: { id: ProcId; tag: string; label: string }[] = [
    { id: 1, tag: 'PROC.01', label: 'Decimal \u2192 Binary' },
    { id: 2, tag: 'PROC.02', label: 'Rounding Methods' },
    { id: 3, tag: 'PROC.03', label: 'Arithmetic' },
];

const App = () => {
    const [active, setActive] = useState<ProcId>(1);

    return (
        <div className="console">
            <header className="console-head">
                <span className="console-eyebrow">Machine 2 &middot; Binary 32-bit Floating-Point</span>
                <h1>IEEE 754 Console</h1>
                <p>Single-precision conversion, rounding, and arithmetic &mdash; worked step by step.</p>
            </header>

            <nav className="proc-select" role="tablist" aria-label="Select process">
                {PROCESSES.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={active === p.id}
                        className={`proc-btn ${active === p.id ? 'is-active' : ''}`}
                        onClick={() => setActive(p.id)}
                    >
                        <span className="proc-tag">{p.tag}</span>
                        <span className="proc-label">{p.label}</span>
                    </button>
                ))}
            </nav>

            <main className="console-body">
                {active === 1 && <DecToBin />}
                {active === 2 && <RoundingDemo />}
                {active === 3 && <ArithmeticOp />}
            </main>
        </div>
    );
};

export default App;