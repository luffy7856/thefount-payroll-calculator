import { useMemo } from 'react';
import { compute, defaultPay, korean, short, won, type Company } from './calc';
import { CompanyFields } from './CompanyFields';
import { C } from './PayTab';
import { MoneyField, Segmented } from './ui';

export type PeriodForm = { mode: 'gross' | 'net'; amount: number; dependents: number; meal: number; startY: number; startM: number; endY: number; endM: number };
export const defaultPeriod: PeriodForm = { mode: 'gross', amount: 3_000_000, dependents: 1, meal: 0, startY: 2026, startM: 1, endY: 2027, endM: 12 };

const years = Array.from({ length: 16 }, (_, i) => 2020 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function YM({ label, y, m, onChange, minY }: { label: string; y: number; m: number; onChange: (y: number, m: number) => void; minY?: number }) {
  return <div className="field">
    <label>{label}</label>
    <div className="ym">
      <div className="select-box"><select aria-label={`${label} 연도`} value={y} onChange={(e) => onChange(Number(e.target.value), m)}>{years.filter((v) => !minY || v >= minY).map((v) => <option key={v} value={v}>{v}년</option>)}</select></div>
      <div className="select-box"><select aria-label={`${label} 월`} value={m} onChange={(e) => onChange(y, Number(e.target.value))}>{months.map((v) => <option key={v} value={v}>{v}월</option>)}</select></div>
    </div>
  </div>;
}

export function PeriodTab({ form, setForm, company, setCompany }: { form: PeriodForm; setForm: (f: PeriodForm) => void; company: Company; setCompany: (c: Company) => void }) {
  const r = useMemo(() => compute({ ...defaultPay, mode: form.mode, amount: form.amount, dependents: form.dependents, meal: form.meal }, company), [form, company]);
  const startIdx = form.startY * 12 + form.startM - 1, endIdx = form.endY * 12 + form.endM - 1;
  const duration = Math.max(1, endIdx - startIdx + 1);
  const valid = endIdx >= startIdx;
  const segments = useMemo(() => {
    const out: { year: number; from: number; to: number; n: number }[] = [];
    for (let y = form.startY; y <= form.endY; y++) {
      const from = y === form.startY ? form.startM : 1, to = y === form.endY ? form.endM : 12;
      if (to >= from) out.push({ year: y, from, to, n: to - from + 1 });
    }
    return out;
  }, [form]);
  const up = <K extends keyof PeriodForm>(k: K, v: PeriodForm[K]) => setForm({ ...form, [k]: v });
  const setStart = (y: number, m: number) => { const f = { ...form, startY: y, startM: m }; if (f.endY * 12 + f.endM < y * 12 + m) { f.endY = y; f.endM = m; } setForm(f); };
  const total = r ? r.employerTotal * duration : 0;
  const severanceTotal = r ? r.severance * duration : 0;
  const underYear = duration < 12;
  const maxSeg = Math.max(1, ...segments.map((s) => s.n));

  return <div className="tab-grid">
    <div className="col-input">
      <section className="card">
        <h2 className="card-title">언제부터 언제까지 일하나요?</h2>
        <YM label="입사 (시작)" y={form.startY} m={form.startM} onChange={setStart} />
        <YM label="퇴사 (종료)" y={form.endY} m={form.endM} minY={form.startY} onChange={(y, m) => setForm({ ...form, endY: y, endM: m })} />
        <div className="period-pill">{form.startY}.{String(form.startM).padStart(2, '0')} → {form.endY}.{String(form.endM).padStart(2, '0')} <b>총 {duration}개월</b></div>
      </section>
      <section className="card">
        <h2 className="card-title">급여 조건</h2>
        <Segmented label="계약 기준" value={form.mode} options={[['gross', '세전 월급'], ['net', '실수령액']] as const} onChange={(v) => up('mode', v)} />
        <MoneyField big label={form.mode === 'gross' ? '세전 월급' : '월 실수령액'} value={form.amount} onChange={(v) => up('amount', v)} />
        <MoneyField label="비과세 식대 (선택)" value={form.meal} onChange={(v) => up('meal', Math.min(v, 1_000_000))} />
      </section>
      <CompanyFields company={company} setCompany={setCompany} />
    </div>

    <div className="col-result">
      {!r || !valid ? <section className="card empty"><b>기간과 금액을 확인해 주세요</b></section> : <>
        <section className="hero-card" aria-live="polite">
          <div className="hero-row"><span>재직기간 전체 인건비</span><strong>{korean(total)}</strong><small>정확히 {won(total)} · {duration}개월</small></div>
          <div className="hero-split">
            <div><span>직원이 받는 돈 합계</span><b>{korean(r.net * duration)}</b><small>월 {short(r.net)}</small></div>
            <div><span>월 회사 부담</span><b>{won(r.employerTotal)}</b><small>세전 {short(r.gross)}</small></div>
          </div>
        </section>
        {underYear
          ? <div className="alert soft"><b>1년 미만 근무예요</b><span>계속근로 1년 미만이면 퇴직금 지급 의무가 없어요. 퇴직금 적립분 {won(severanceTotal)}을 빼면 실제 부담은 <strong>{won(total - severanceTotal)}</strong>이에요.</span></div>
          : <div className="alert soft ok"><b>퇴직 시 퇴직금 약 {korean(severanceTotal)}</b><span>매달 세전 급여의 1/12을 쌓은 금액이에요. 실제 퇴직금은 퇴직 전 3개월 평균임금으로 계산해요.</span></div>}
        <section className="card">
          <div className="card-head"><h3>연도별 회사 부담</h3></div>
          <div className="years">
            {segments.map((s) => <div className="year-row" key={s.year}>
              <div className="year-head"><b>{s.year}년</b><span>{s.from}월~{s.to}월 · {s.n}개월</span></div>
              <div className="year-bar"><i style={{ width: `${(s.n / maxSeg) * 100}%`, background: C.gross }} /></div>
              <div className="year-val">{korean(r.employerTotal * s.n)}</div>
            </div>)}
          </div>
          <p className="micro">2026년 요율을 모든 연도에 똑같이 적용한 예상치예요. 해마다 보험료율과 급여가 바뀌면 달라져요.</p>
        </section>
      </>}
    </div>
  </div>;
}
