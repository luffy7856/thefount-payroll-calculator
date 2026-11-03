import { useId, useState, type ReactNode } from 'react';
import { korean } from './calc';

const digits = (s: string) => Number(s.replace(/\D/g, '').slice(0, 12)) || 0;

export function MoneyField({ label, value, onChange, hint, big = false, unit = '원', placeholder = '0' }: {
  label: string; value: number; onChange: (v: number) => void; hint?: ReactNode; big?: boolean; unit?: string; placeholder?: string;
}) {
  const id = useId();
  return <div className={`field money ${big ? 'big' : ''}`}>
    <label htmlFor={id}>{label}</label>
    <div className="money-box">
      <input id={id} inputMode="numeric" autoComplete="off" enterKeyHint="done" placeholder={placeholder}
        value={value ? value.toLocaleString('ko-KR') : ''} onChange={(e) => onChange(digits(e.target.value))}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
      <span className="unit">{unit}</span>
      {value > 0 && <button type="button" className="clear" aria-label={`${label} 지우기`} onClick={() => onChange(0)}>×</button>}
    </div>
    <div className="money-read">{unit === '원' && value > 0 ? korean(value) : ' '}{hint && <span className="hint">{hint}</span>}</div>
  </div>;
}

export function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix: string }) {
  const id = useId();
  return <div className="field num">
    <label htmlFor={id}>{label}</label>
    <div className="money-box small">
      <input id={id} inputMode="numeric" autoComplete="off" placeholder="0" value={value ? String(value) : ''}
        onChange={(e) => onChange(Math.min(400, digits(e.target.value)))} />
      <span className="unit">{suffix}</span>
    </div>
  </div>;
}

export function Stepper({ label, sub, value, min, max, onChange }: { label: string; sub?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return <div className="row stepper-row">
    <div className="row-text"><b>{label}</b>{sub && <small>{sub}</small>}</div>
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label={`${label} 줄이기`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`${label} 늘리기`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  </div>;
}

export function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="row toggle-row">
    <span className="row-text"><b>{label}</b>{sub && <small>{sub}</small>}</span>
    <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="switch" aria-hidden="true" />
  </label>;
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: readonly (readonly [T, string])[]; onChange: (v: T) => void; label: string }) {
  return <div className="segmented" role="radiogroup" aria-label={label} style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}>
    {options.map(([v, text]) => <button key={v} type="button" role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>{text}</button>)}
  </div>;
}

export function Fold({ title, badge, children, defaultOpen = false }: { title: string; badge?: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <section className={`fold ${open ? 'open' : ''}`}>
    <button type="button" className="fold-head" aria-expanded={open} onClick={() => setOpen(!open)}>
      <span>{title}</span>{badge && <em>{badge}</em>}<i aria-hidden="true">⌄</i>
    </button>
    {open && <div className="fold-body">{children}</div>}
  </section>;
}

export function Line({ label, value, sub, strong, minus, tone }: { label: ReactNode; value: string; sub?: string; strong?: boolean; minus?: boolean; tone?: string }) {
  return <div className={`line ${strong ? 'strong' : ''}`}>
    <span className="line-label">{tone && <i className="dot" style={{ background: tone }} />}{label}{sub && <small>{sub}</small>}</span>
    <span className={`line-value ${minus ? 'minus' : ''}`}>{value}</span>
  </div>;
}

export function StackBar({ parts, label }: { parts: { value: number; color: string; name: string }[]; label: string }) {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0) || 1;
  return <div className="stackbar" role="img" aria-label={label}>
    {parts.map((p) => p.value > 0 && <span key={p.name} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />)}
  </div>;
}
