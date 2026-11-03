import { useMemo } from 'react';
import { compute, defaultPay, korean, MIN_WAGE_MONTHLY, short, won, type Company } from './calc';
import { CompanyFields } from './CompanyFields';
import { C } from './PayTab';
import { Segmented, StackBar } from './ui';

export type Member = { id: number; label: string; mode: 'gross' | 'net'; amount: number; dependents: number };

export const examples: Record<string, { title: string; members: Omit<Member, 'id'>[] }> = {
  shop: { title: '가게·매장', members: [
    { label: '점장', mode: 'gross', amount: 3_000_000, dependents: 1 },
    { label: '직원 1', mode: 'gross', amount: MIN_WAGE_MONTHLY, dependents: 1 },
    { label: '직원 2', mode: 'gross', amount: MIN_WAGE_MONTHLY, dependents: 1 }] },
  office: { title: '사무실', members: [
    { label: '팀장', mode: 'net', amount: 4_000_000, dependents: 3 },
    { label: '대리', mode: 'gross', amount: 3_300_000, dependents: 1 },
    { label: '사원', mode: 'gross', amount: 2_800_000, dependents: 1 }] },
  clinic: { title: '병원·의원', members: [
    { label: '간호조무사', mode: 'gross', amount: 2_800_000, dependents: 1 },
    { label: '상담실장', mode: 'net', amount: 3_500_000, dependents: 1 },
    { label: '피부관리사', mode: 'net', amount: 2_500_000, dependents: 1 }] },
};
export const withIds = (ms: Omit<Member, 'id'>[]) => ms.map((m, i) => ({ ...m, id: Date.now() + i }));

const digits = (s: string) => Number(s.replace(/\D/g, '').slice(0, 12)) || 0;

export function TeamTab({ members, setMembers, company, setCompany, clinic }: {
  members: Member[]; setMembers: (m: Member[]) => void; company: Company; setCompany: (c: Company) => void; clinic: boolean;
}) {
  const rows = useMemo(() => members.map((m) => ({ m, r: compute({ ...defaultPay, mode: m.mode, amount: m.amount, dependents: m.dependents }, company) })), [members, company]);
  const valid = rows.filter((x) => x.r);
  const sum = (f: (r: NonNullable<(typeof rows)[number]['r']>) => number) => valid.reduce((s, x) => s + f(x.r!), 0);
  const total = sum((r) => r.employerTotal), net = sum((r) => r.net), gross = sum((r) => r.gross), ins = sum((r) => r.employerContributions.total), sev = sum((r) => r.severance);
  const up = (id: number, p: Partial<Member>) => setMembers(members.map((m) => (m.id === id ? { ...m, ...p } : m)));
  const exampleKeys = clinic ? ['shop', 'office', 'clinic'] : ['shop', 'office'];

  return <div className="tab-grid">
    <div className="col-input">
      <section className="card">
        <div className="card-head"><h2 className="card-title">직원 구성</h2><span className="count">{members.length}명</span></div>
        <p className="card-sub">직원마다 세전 월급 또는 실수령액 기준을 골라 섞어서 입력할 수 있어요.</p>
        <div className="chips">
          <span className="chips-label">예시로 채우기</span>
          {exampleKeys.map((k) => <button key={k} type="button" className="chip" onClick={() => setMembers(withIds(examples[k].members))}>{examples[k].title}</button>)}
        </div>
        <div className="members">
          {members.map((m, i) => {
            const r = rows[i].r;
            return <article className="member" key={m.id}>
              <div className="member-top">
                <input className="member-label" aria-label={`${i + 1}번째 직원 구분`} maxLength={12} value={m.label} placeholder={`직원 ${i + 1}`} onChange={(e) => up(m.id, { label: e.target.value })} />
                <button type="button" className="remove" aria-label={`${m.label || `직원 ${i + 1}`} 삭제`} onClick={() => setMembers(members.filter((x) => x.id !== m.id))}>삭제</button>
              </div>
              <Segmented label="계약 기준" value={m.mode} options={[['gross', '세전 월급'], ['net', '실수령액']] as const} onChange={(v) => up(m.id, { mode: v })} />
              <div className="member-fields">
                <div className="money-box">
                  <input aria-label={`${m.label} 월 금액`} inputMode="numeric" placeholder="0" value={m.amount ? m.amount.toLocaleString('ko-KR') : ''} onChange={(e) => up(m.id, { amount: digits(e.target.value) })} />
                  <span className="unit">원</span>
                </div>
                <div className="stepper mini" role="group" aria-label="공제대상 가족 수">
                  <button type="button" aria-label="가족 수 줄이기" disabled={m.dependents <= 1} onClick={() => up(m.id, { dependents: m.dependents - 1 })}>−</button>
                  <output>가족 {m.dependents}</output>
                  <button type="button" aria-label="가족 수 늘리기" disabled={m.dependents >= 11} onClick={() => up(m.id, { dependents: m.dependents + 1 })}>+</button>
                </div>
              </div>
              {r ? <div className="member-result"><span>실수령 <b>{short(r.net)}</b></span><span>세전 <b>{short(r.gross)}</b></span><span className="cost">회사 부담 <b>{short(r.employerTotal)}</b></span></div>
                : <div className="member-result muted">금액을 입력해 주세요</div>}
            </article>;
          })}
        </div>
        <button type="button" className="add" onClick={() => setMembers([...members, { id: Date.now(), label: `직원 ${members.length + 1}`, mode: 'gross', amount: 0, dependents: 1 }])} disabled={members.length >= 30}>+ 직원 추가</button>
      </section>
      <CompanyFields company={company} setCompany={setCompany} />
    </div>

    <div className="col-result">
      <section className="hero-card" aria-live="polite">
        <div className="hero-row"><span>팀 전체 월 인건비</span><strong>{won(total)}</strong><small>1년 {korean(total * 12)}</small></div>
        <div className="hero-split">
          <div><span>직원 실수령 합계</span><b>{won(net)}</b><small>월 기준</small></div>
          <div><span>1인 평균 회사 부담</span><b>{short(total / Math.max(1, valid.length))}</b><small>{valid.length}명 기준</small></div>
        </div>
      </section>
      <section className="card">
        <div className="card-head"><h3>팀 인건비 구성</h3></div>
        <StackBar label="팀 인건비 구성" parts={[{ name: '세전 급여', value: gross, color: C.gross }, { name: '사업주 4대보험', value: ins, color: C.health }, { name: '퇴직금 적립', value: sev, color: C.severance }]} />
        <div className="line"><span className="line-label"><i className="dot" style={{ background: C.gross }} />세전 급여 합계</span><span className="line-value">{won(gross)}</span></div>
        <div className="line"><span className="line-label"><i className="dot" style={{ background: C.health }} />사업주 4대보험</span><span className="line-value">{won(ins)}</span></div>
        <div className="line"><span className="line-label"><i className="dot" style={{ background: C.severance }} />퇴직금 적립</span><span className="line-value">{won(sev)}</span></div>
        <div className="line strong"><span className="line-label">월 총 인건비</span><span className="line-value">{won(total)}</span></div>
      </section>
      {valid.length > 0 && <section className="card">
        <div className="card-head"><h3>직원별 회사 부담</h3></div>
        <div className="rank">
          {[...valid].sort((a, b) => b.r!.employerTotal - a.r!.employerTotal).map(({ m, r }) => <div key={m.id} className="rank-row">
            <span className="rank-name">{m.label || '직원'}</span>
            <span className="rank-bar"><i style={{ width: `${(r!.employerTotal / Math.max(...valid.map((x) => x.r!.employerTotal))) * 100}%` }} /></span>
            <span className="rank-val">{short(r!.employerTotal)}</span>
          </div>)}
        </div>
        <p className="micro">자녀 공제·비과세 수당은 반영하지 않은 단순 비교예요. 한 사람씩 자세히 보려면 ‘월급·인건비’ 탭을 이용하세요.</p>
      </section>}
    </div>
  </div>;
}
