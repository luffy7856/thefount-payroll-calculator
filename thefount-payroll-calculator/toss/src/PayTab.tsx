import { useMemo } from 'react';
import { compute, korean, MIN_WAGE_HOURLY, MIN_WAGE_MONTHLY, pct, short, won, type Company, type PayForm, type PayMode } from './calc';
import { CompanyFields } from './CompanyFields';
import { Fold, Line, MoneyField, NumberField, Segmented, StackBar, Stepper, Toggle } from './ui';

const modes = [['gross', '세전 월급'], ['annual', '연봉'], ['net', '실수령액']] as const;
const quick: Record<PayMode, readonly (readonly [string, number])[]> = {
  gross: [['최저임금', MIN_WAGE_MONTHLY], ['250만', 2_500_000], ['300만', 3_000_000], ['400만', 4_000_000], ['500만', 5_000_000]],
  annual: [['3,000만', 30_000_000], ['4,000만', 40_000_000], ['5,000만', 50_000_000], ['7,000만', 70_000_000], ['1억', 100_000_000]],
  net: [['200만', 2_000_000], ['250만', 2_500_000], ['300만', 3_000_000], ['350만', 3_500_000], ['400만', 4_000_000]],
};
/* 병원·의원 직군 예시 (더파운트 병의원 인건비 계산기와 같은 값, 실수령액 기준) */
const clinicPresets = [['간호조무사', 2_300_000], ['피부관리사', 2_500_000], ['상담실장', 3_500_000], ['페이닥터', 13_000_000]] as const;

export const C = { pension: '#2D6CDF', health: '#16A383', ltc: '#7FD6BC', employment: '#F2A93B', tax: '#8E6FD8', accident: '#E36464', severance: '#A88445', gross: '#102C42' };

export function PayTab({ pay, setPay, company, setCompany, clinic, setClinic }: {
  pay: PayForm; setPay: (p: PayForm) => void; company: Company; setCompany: (c: Company) => void; clinic: boolean; setClinic: (v: boolean) => void;
}) {
  const r = useMemo(() => compute(pay, company), [pay, company]);
  const up = <K extends keyof PayForm>(k: K, v: PayForm[K]) => setPay({ ...pay, [k]: v });
  const amountLabel = pay.mode === 'gross' ? '세전 월급 (기본급+고정수당)' : pay.mode === 'annual' ? '세전 연봉' : (pay.netIncludesSeverance ? '퇴직금 포함 계약 실수령액' : '받고 싶은 월 실수령액');
  const nonTax = pay.meal + pay.childcare + pay.transport;
  const extraHours = pay.overtime + pay.night + pay.holiday;

  return <div className="tab-grid">
    <div className="col-input">
      <section className="card">
        <h2 className="card-title">무엇을 기준으로 계산할까요?</h2>
        <Segmented label="계산 기준" value={pay.mode} options={modes} onChange={(m) => setPay({ ...pay, mode: m, amount: m === pay.mode ? pay.amount : (m === 'annual' ? 36_000_000 : 3_000_000) })} />
        <MoneyField big label={amountLabel} value={pay.amount} onChange={(v) => up('amount', v)} />
        <div className="chips" aria-label="빠른 입력">
          {quick[pay.mode].map(([t, v]) => <button key={t} type="button" className={pay.amount === v ? 'chip on' : 'chip'} onClick={() => up('amount', v)}>{t}</button>)}
        </div>
        {pay.mode === 'annual' && <Toggle label="퇴직금 포함 연봉이에요" sub="연봉을 13으로 나눠 월급을 구해요" checked={pay.annualIncludesSeverance} onChange={(v) => up('annualIncludesSeverance', v)} />}
        {pay.mode === 'net' && <Toggle label="실수령액에 퇴직금이 포함돼 있어요" sub="네트 계약 · 월 수령액 + 퇴직금 적립액 = 입력액" checked={pay.netIncludesSeverance} onChange={(v) => up('netIncludesSeverance', v)} />}
        <div className="clinic">
          <Toggle label="병원·의원 직군 예시 보기" sub="간호조무사 · 상담실장 · 페이닥터 등" checked={clinic} onChange={setClinic} />
          {clinic && <div className="chips clinic-chips">
            {clinicPresets.map(([t, v]) => <button key={t} type="button" className={pay.mode === 'net' && pay.amount === v ? 'chip on' : 'chip'}
              onClick={() => setPay({ ...pay, mode: 'net', netIncludesSeverance: false, amount: v })}>{t} <em>실수령 {short(v).replace('원', '')}</em></button>)}
          </div>}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">소득세 기준</h2>
        <Stepper label="공제대상 가족 수" sub="본인 포함 · 기본공제 받는 가족만" value={pay.dependents} min={1} max={11} onChange={(v) => up('dependents', v)} />
        <Stepper label="8세~20세 자녀 수" sub="공제대상 가족 중 해당 자녀" value={pay.children} min={0} max={Math.max(0, pay.dependents - 1)} onChange={(v) => up('children', v)} />
      </section>

      <Fold title="비과세 수당" badge={nonTax ? short(nonTax) : '선택'}>
        <p className="fold-note">월급에 포함된 금액 중 비과세로 처리하는 부분이에요. 항목별로 월 20만원까지 비과세예요.</p>
        <div className="chips"><button type="button" className={pay.meal === 200_000 ? 'chip on' : 'chip'} onClick={() => up('meal', pay.meal === 200_000 ? 0 : 200_000)}>식대 20만원 비과세</button></div>
        <MoneyField label="식대" value={pay.meal} onChange={(v) => up('meal', v)} />
        <MoneyField label="보육수당 (6세 이하 자녀)" value={pay.childcare} onChange={(v) => up('childcare', v)} />
        <MoneyField label="자가운전보조금" value={pay.transport} onChange={(v) => up('transport', v)} />
      </Fold>

      <Fold title="연장·야간·휴일 근로" badge={extraHours ? `${extraHours}시간` : '선택'}>
        <p className="fold-note">통상시급(월급 ÷ 209시간)에 5인 이상 사업장은 연장·휴일 1.5배, 야간 0.5배 가산을 더해요.</p>
        <div className="triple">
          <NumberField label="연장" value={pay.overtime} onChange={(v) => up('overtime', v)} suffix="시간" />
          <NumberField label="야간" value={pay.night} onChange={(v) => up('night', v)} suffix="시간" />
          <NumberField label="휴일" value={pay.holiday} onChange={(v) => up('holiday', v)} suffix="시간" />
        </div>
      </Fold>

      <CompanyFields company={company} setCompany={setCompany} />
    </div>

    <div className="col-result" id="result">
      {!r ? <section className="card empty"><b>금액을 입력해 주세요</b><p>세전 월급, 연봉, 실수령액 중 하나만 알면 돼요.</p></section> : <Result r={r} pay={pay} company={company} />}
    </div>
  </div>;
}

function Result({ r, pay, company }: { r: NonNullable<ReturnType<typeof compute>>; pay: PayForm; company: Company }) {
  const deductions = r.gross - r.net;
  const extraCost = r.employerTotal - r.net;
  const hourly = r.overtimePay.hourlyWage;
  const lowWage = hourly > 0 && hourly < MIN_WAGE_HOURLY;
  const perManwon = r.net > 0 ? r.employerTotal / r.net : 0;
  const e = r.employerContributions, w = r.employeeContributions;
  return <>
    <section className="hero-card" aria-live="polite">
      <div className="hero-row">
        <span>매달 통장에 들어오는 돈</span>
        <strong>{won(r.net)}</strong>
        <small>세전 {won(r.gross)}에서 {won(deductions)} 공제 ({pct(r.gross ? deductions / r.gross : 0)})</small>
      </div>
      <div className="hero-split">
        <div><span>회사가 매달 쓰는 돈</span><b>{won(r.employerTotal)}</b><small>1년 {korean(r.employerTotal * 12)}</small></div>
        <div><span>실수령액 대비</span><b>{perManwon ? perManwon.toFixed(2) : '-'}배</b><small>{short(r.net)} 받을 때 {short(r.employerTotal)}</small></div>
      </div>
      {pay.mode === 'net' && pay.netIncludesSeverance && <p className="hero-note">계약 실수령액 {won(r.contractedNet)} = 월 수령액 {won(r.net)} + 퇴직금 적립 {won(r.severance)}</p>}
    </section>

    {lowWage && <div className="alert"><b>최저임금 확인이 필요해요</b><span>통상시급이 약 {won(hourly)}로 2026년 최저임금 {won(MIN_WAGE_HOURLY)}(월 209시간 {short(MIN_WAGE_MONTHLY)})보다 낮아요. 실제 판단은 최저임금 산입 범위로 다시 확인하세요.</span></div>}

    <section className="card">
      <div className="card-head"><h3>직원 공제 내역</h3><span className="total-minus">-{won(deductions)}</span></div>
      <StackBar label="공제 구성" parts={[
        { name: '국민연금', value: w.pension, color: C.pension }, { name: '건강보험', value: w.health, color: C.health },
        { name: '장기요양', value: w.longTermCare, color: C.ltc }, { name: '고용보험', value: w.unemployment, color: C.employment },
        { name: '세금', value: r.tax.income + r.tax.local, color: C.tax }]} />
      <Line tone={C.pension} label="국민연금" sub="4.75%" value={won(w.pension)} />
      <Line tone={C.health} label="건강보험" sub="3.595%" value={won(w.health)} />
      <Line tone={C.ltc} label="장기요양보험" sub="건강보험료의 13.14%" value={won(w.longTermCare)} />
      <Line tone={C.employment} label="고용보험" sub="0.9%" value={won(w.unemployment)} />
      <Line tone={C.tax} label="근로소득세" sub={`간이세액표 · 가족 ${pay.dependents}명${pay.children ? ` · 자녀 ${pay.children}명` : ''}`} value={won(r.tax.income)} />
      <Line tone={C.tax} label="지방소득세" sub="소득세의 10%" value={won(r.tax.local)} />
      <Line strong label="실수령액" value={won(r.net)} />
      {r.durunuri.eligible && <p className="micro">두루누리 지원을 받으면 국민연금·고용보험 근로자 부담분의 80%, 월 약 {won(r.durunuri.employeeSupport)}를 지원받을 수 있어요 (위 실수령액에는 반영하지 않았어요).</p>}
    </section>

    <section className="card">
      <div className="card-head"><h3>회사 부담 내역</h3><span className="total-plus">+{won(extraCost)}</span></div>
      <p className="card-sub">직원 실수령액 외에 회사가 더 쓰는 돈이에요.</p>
      <StackBar label="회사 부담 구성" parts={[
        { name: '세전 급여', value: r.gross, color: C.gross }, { name: '사업주 4대보험', value: e.total, color: C.health }, { name: '퇴직금 적립', value: r.severance, color: C.severance }]} />
      <Line tone={C.gross} label="세전 급여" sub={r.overtimePay.total ? `가산수당 ${won(r.overtimePay.total)} 포함` : undefined} value={won(r.gross)} />
      <Line tone={C.health} label="사업주 4대보험" value={won(e.total)} />
      <div className="sublines">
        <Line label="국민연금" value={won(e.pension)} />
        <Line label="건강보험 + 장기요양" value={won(e.health + e.longTermCare)} />
        <Line label="고용보험" sub={`0.9% + 고용안정 ${company.employerSize === 'under150' ? '0.25' : company.employerSize === 'priority' ? '0.45' : company.employerSize === 'under1000' ? '0.65' : '0.85'}%`} value={won(e.unemployment)} />
        <Line label="산재보험" sub={`${company.accidentRate}%`} value={won(e.accident)} />
      </div>
      <Line tone={C.severance} label="퇴직금 적립" sub="세전 급여의 1/12" value={won(r.severance)} />
      {r.durunuri.eligible && <Line label="두루누리 사업주 지원 예상" value={`-${won(r.durunuri.employerSupport)}`} minus />}
      <Line strong label="월 총 인건비" value={won(r.employerTotal)} />
    </section>

    <section className="card">
      <div className="card-head"><h3>1년으로 보면</h3></div>
      <Line label="세전 연봉" sub={pay.mode === 'annual' && pay.annualIncludesSeverance ? '퇴직금 제외' : undefined} value={korean(r.gross * 12)} />
      <Line label="연 실수령액" value={korean(r.net * 12)} />
      <Line label="1년 퇴직금 (적립 기준)" value={korean(r.severance * 12)} />
      <Line strong label="회사 연간 총 인건비" value={korean(r.employerTotal * 12)} />
      <p className="micro">연 실수령액은 매달 같은 금액 기준이에요. 연말정산 결과에 따라 달라질 수 있어요.</p>
    </section>
  </>;
}
