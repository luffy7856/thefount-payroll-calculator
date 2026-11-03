import { useEffect, useMemo, useState } from 'react';
import { compute, defaultCompany, defaultPay, load, loadList, save, short, type Company, type PayForm } from './calc';
import { PayTab } from './PayTab';
import { defaultPeriod, PeriodTab, type PeriodForm } from './PeriodTab';
import { Standards } from './Standards';
import { examples, TeamTab, withIds, type Member } from './TeamTab';

type Tab = 'pay' | 'team' | 'period';
const tabs: [Tab, string][] = [['pay', '월급·인건비'], ['team', '여러 명 합산'], ['period', '재직기간']];
const K = { pay: 'tf-pay-v1', company: 'tf-company-v1', team: 'tf-team-v1', period: 'tf-period-v1', tab: 'tf-tab-v1', clinic: 'tf-clinic-v1' };

function initialTab(): Tab {
  const q = new URLSearchParams(location.search).get('tab');
  if (q === 'pay' || q === 'team' || q === 'period') return q;
  try { const t = localStorage.getItem(K.tab); if (t === 'pay' || t === 'team' || t === 'period') return t; } catch { /* */ }
  return 'pay';
}

export function App() {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [pay, setPay] = useState<PayForm>(() => load(K.pay, defaultPay));
  const [company, setCompany] = useState<Company>(() => load(K.company, defaultCompany));
  const [members, setMembers] = useState<Member[]>(() => loadList(K.team, withIds(examples.shop.members)));
  const [period, setPeriod] = useState<PeriodForm>(() => load(K.period, defaultPeriod));
  const [clinic, setClinic] = useState<boolean>(() => { try { return localStorage.getItem(K.clinic) === '1'; } catch { return false; } });

  useEffect(() => save(K.pay, pay), [pay]);
  useEffect(() => save(K.company, company), [company]);
  useEffect(() => save(K.team, members), [members]);
  useEffect(() => save(K.period, period), [period]);
  useEffect(() => { try { localStorage.setItem(K.tab, tab); localStorage.setItem(K.clinic, clinic ? '1' : '0'); } catch { /* */ } }, [tab, clinic]);

  const go = (t: Tab) => { setTab(t); window.scrollTo({ top: 0 }); };

  /* mobile: a bottom bar with the live result while the result cards are below the fold */
  const live = useMemo(() => (tab === 'pay' ? compute(pay, company) : null), [tab, pay, company]);
  const [resultVisible, setResultVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById('result');
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setResultVisible(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [tab]);

  return <div className="app">
    <header className="top">
      <div className="brand-row">
        <span className="wordmark" aria-label="THE FOUNT"><i>THE</i> FOUNT</span>
        <span className="badge">2026년 기준</span>
      </div>
      <h1>월급 실수령액과{' '}<br />회사 총 인건비를 한 번에</h1>
      <p className="lead">세전 월급·연봉·실수령액 중 하나만 넣으면 4대보험, 소득세, 퇴직금 적립까지 계산해요.</p>
    </header>

    <nav className="tabs" aria-label="계산기 선택">
      {tabs.map(([t, label]) => <button key={t} type="button" className={tab === t ? 'on' : ''} aria-current={tab === t ? 'page' : undefined} onClick={() => go(t)}>{label}</button>)}
    </nav>

    <main>
      {tab === 'pay' && <PayTab pay={pay} setPay={setPay} company={company} setCompany={setCompany} clinic={clinic} setClinic={setClinic} />}
      {tab === 'team' && <TeamTab members={members} setMembers={setMembers} company={company} setCompany={setCompany} clinic={clinic} />}
      {tab === 'period' && <PeriodTab form={period} setForm={setPeriod} company={company} setCompany={setCompany} />}
      <div className="tab-grid single"><Standards /></div>
    </main>

    <footer className="foot">
      <p>참고용 결과이며 계약·신고·투자 전 전문가와 확인하세요. 입력한 값은 이 기기에만 저장되고 어디에도 전송되지 않아요.</p>
      <span className="credit">by 더파운트 · THE FOUNT</span>
    </footer>

    {live && !resultVisible && <button type="button" className="dock" onClick={() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
      <span><small>실수령액</small><b>{short(live.net)}</b></span>
      <span><small>회사 부담</small><b>{short(live.employerTotal)}</b></span>
      <em>결과 보기</em>
    </button>}
  </div>;
}
