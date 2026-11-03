import { DEFAULT_ACCIDENT_RATE, employerSizeLabel, employerSizeRate, type Company, type EmployerSize } from './calc';
import { useEffect, useState } from 'react';
import { Fold, Toggle } from './ui';

/* keeps the typed text (so "0." can be typed) and reports the number */
function RateInput({ id, value, onChange }: { id: string; value: number; onChange: (v: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => { if (Number(text) !== value) setText(String(value)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <input id={id} inputMode="decimal" autoComplete="off" value={text} onChange={(e) => {
    const t = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 5);
    setText(t); const v = Number(t); if (t !== '' && Number.isFinite(v)) onChange(Math.min(20, v));
  }} />;
}

const sizes = Object.keys(employerSizeLabel) as EmployerSize[];
const accidentPresets = [['기본값', 0.6], ['2026 전체 업종 평균', 1.47]] as const;

export function CompanyFields({ company, setCompany, defaultOpen = false }: { company: Company; setCompany: (c: Company) => void; defaultOpen?: boolean }) {
  const up = <K extends keyof Company>(k: K, v: Company[K]) => setCompany({ ...company, [k]: v });
  const changed = company.employerSize !== 'under150' || company.accidentRate !== DEFAULT_ACCIDENT_RATE || company.durunuri || company.smallWorkplace;
  return <Fold title="회사 조건 (사업주 부담)" badge={changed ? '변경됨' : '기본값'} defaultOpen={defaultOpen}>
    <div className="field">
      <label htmlFor="emp-size">회사 규모 · 고용보험 고용안정 요율</label>
      <div className="select-box">
        <select id="emp-size" value={company.employerSize} onChange={(e) => up('employerSize', e.target.value as EmployerSize)}>
          {sizes.map((s) => <option key={s} value={s}>{employerSizeLabel[s]} ({employerSizeRate[s]}%)</option>)}
        </select>
      </div>
      <p className="fold-note">대부분의 가게·의원·소규모 회사는 150인 미만이에요.</p>
    </div>
    <div className="field">
      <label htmlFor="acc-rate">산재보험 요율 (업종별로 달라요)</label>
      <div className="money-box small">
        <RateInput id="acc-rate" value={company.accidentRate} onChange={(v) => up('accidentRate', v)} />
        <span className="unit">%</span>
      </div>
      <div className="chips">{accidentPresets.map(([t, v]) => <button key={t} type="button" className={company.accidentRate === v ? 'chip on' : 'chip'} onClick={() => up('accidentRate', v)}>{t} {v}%</button>)}</div>
      <p className="fold-note">업종별 요율에 출퇴근재해 요율 0.06%를 더한 값을 넣어 주세요. 우리 회사 요율은 근로복지공단 고지서에서 확인할 수 있어요.</p>
    </div>
    <Toggle label="두루누리 지원 적용" sub="근로자 10명 미만 · 월 보수 270만원 미만 · 신규 가입" checked={company.durunuri} onChange={(v) => up('durunuri', v)} />
    <Toggle label="상시근로자 5명 미만" sub="연장·야간·휴일 가산수당을 적용하지 않아요" checked={company.smallWorkplace} onChange={(v) => up('smallWorkplace', v)} />
  </Fold>;
}
