import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '../../site-chrome';

type Step = { title: string; items: string[] };
type Manual = { kicker: string; title: string; description: string; calculator: string; prepare: string[]; steps: Step[]; example: string[]; results: string[]; cautions: string[] };

const manuals: Record<string, Manual> = {
  payroll: {
    kicker: '직원 인건비 계산기', title: '한 명의 실제 고용비용을 확인하는 법', calculator: '/',
    description: '근로계약서에 적힌 급여 조건을 그대로 옮기고, 병원이 매월 추가로 부담하는 보험료와 퇴직금까지 확인합니다.',
    prepare: ['근로계약 기준(세전 또는 실수령)', '월 급여와 부양가족 수', '비과세 수당 및 연장·야간·휴일근로 시간'],
    steps: [
      { title: '1. 계약 기준 선택', items: ['계약서가 세전 금액이면 ‘총 지급액 기준’, 통장 입금액 약정이면 ‘실수령액 기준’을 선택합니다.', '실수령액에 퇴직금이 포함된 약정인지 반드시 구분합니다.'] },
      { title: '2. 급여·가족 입력', items: ['월 급여는 상여금을 제외한 매월 반복 금액을 입력합니다.', '부양가족은 근로자 본인을 포함하고, 자녀 수는 해당 연령 조건에 맞는 인원만 입력합니다.'] },
      { title: '3. 수당·비과세 입력', items: ['연장·야간·휴일근로 시간은 월 합계로 입력합니다.', '식대·보육·자가운전보조금은 실제 급여명세서의 비과세 항목만 입력합니다.'] },
    ],
    example: ['실수령액 350만원', '부양가족 1명(본인)', '식대 20만원', '연장근로 10시간'],
    results: ['병원 월 총부담: 세전급여 + 사업주 보험료 + 퇴직금 적립액', '직원 실수령액: 공제 후 실제 수령 예상액', '추가 부담: 약정 급여 외에 병원이 준비해야 할 금액'],
    cautions: ['두루누리는 실제 지원요건을 충족할 때만 선택하세요.', '성과급·연차수당 등 비정기 지급액은 별도로 더해 예산을 잡으세요.'],
  },
  team: {
    kicker: '팀 인건비 계산기', title: '직원 전체의 월·연간 예산을 만드는 법', calculator: '/team',
    description: '직원별 계약 조건을 한 줄씩 입력해 팀 전체 인건비와 직무별 부담을 비교합니다.',
    prepare: ['전체 직원 명단과 직무', '직원별 세전·실수령 계약 금액', '직원별 부양가족·자녀 수'],
    steps: [
      { title: '1. 직원 한 명씩 등록', items: ['이름 대신 ‘상담실장 A’처럼 직무를 써도 됩니다.', '각 직원의 계약서 기준에 맞춰 세전 또는 실수령을 선택합니다.'] },
      { title: '2. 인원 조정', items: ['직원 추가 버튼으로 행을 늘리고, 퇴사자나 비교에서 제외할 직원은 삭제합니다.', '계약 금액이 같은 직원도 각각 입력해야 인원당 평균이 정확해집니다.'] },
      { title: '3. 예산 비교', items: ['현재 인력과 채용 예정 인력을 각각 계산해 월 총액 차이를 비교합니다.', '연간 팀 예산에는 매월 반복되는 총 고용비용이 반영됩니다.'] },
    ],
    example: ['간호조무사 2명 각 세전 260만원', '상담실장 1명 실수령 350만원', '피부관리사 1명 세전 300만원'],
    results: ['월 총 인건비와 연간 팀 예산', '직원 1인당 평균 고용비용', '직원별 세전·실수령·병원 추가부담'],
    cautions: ['입사월이 다른 직원의 기간 차이는 ‘고용기간 계산’에서 확인하세요.', '상여금·인센티브가 고정 지급이면 월 금액에 포함해 비교하세요.'],
  },
  period: {
    kicker: '고용기간 계산', title: '특정 기간의 총 인건비를 추정하는 법', calculator: '/period',
    description: '입사·퇴사 또는 사업계획 기간을 지정해 월별 고용비용이 누적되는 규모를 확인합니다.',
    prepare: ['계산 시작·종료 연월', '세전 또는 실수령 월급', '매월 고정 비과세 수당'],
    steps: [
      { title: '1. 기간 설정', items: ['시작월과 종료월을 포함해 계산하므로 실제 급여가 발생하는 달을 선택합니다.', '중도 입·퇴사로 일할계산이 필요한 달은 결과에서 별도 조정합니다.'] },
      { title: '2. 월 조건 입력', items: ['기간 중 반복되는 표준 월 급여를 입력합니다.', '식대·보육·자가운전보조금은 매월 고정 지급분만 입력합니다.'] },
      { title: '3. 연도별 확인', items: ['총액뿐 아니라 연도별 구간을 확인해 다음 해 예산을 분리합니다.', '급여 인상 예정이면 인상 전·후 기간을 나누어 두 번 계산합니다.'] },
    ],
    example: ['2026년 3월~2027년 2월', '세전 월급 320만원', '식대 20만원'],
    results: ['총 고용 개월 수와 기간 총비용', '연도별 비용 구간', '표준 월 병원 부담과 직원 실수령 예상액'],
    cautions: ['중도 입·퇴사 일할계산과 무급휴직은 자동 반영되지 않습니다.', '연도별 보험요율·세율 변화로 실제 금액은 달라질 수 있습니다.'],
  },
  hiring: {
    kicker: '추가채용 수익성 계산', title: '새 직원의 손익분기점을 분석하는 법', calculator: '/hiring',
    description: '채용에 드는 월 비용과 기대 매출효과를 같은 기준으로 놓고 손익분기 매출·회수기간을 확인합니다.',
    prepare: ['채용 직무와 급여 조건', '채용·교육 등 일회성 비용', '예상 매출효과와 변동비율'],
    steps: [
      { title: '1. 채용비용 입력', items: ['월 급여·비과세 수당과 매월 추가 운영비를 구분합니다.', '채용광고·교육·장비 등 한 번만 드는 비용은 일회성 비용에 입력합니다.'] },
      { title: '2. 효과 방식 선택', items: ['직접 매출, 원장 시간 절감, 전환율 개선 중 실제 업무와 가장 가까운 방식을 선택합니다.', '평균 객단가·근무일·예상 건수는 최근 병원 실적을 기준으로 보수적으로 입력합니다.'] },
      { title: '3. 수익성 판독', items: ['변동비와 환불·할인율을 반영한 순효과가 월 총 고용비를 넘는지 확인합니다.', '기준·보수·낙관 시나리오를 함께 보고 채용 결정을 내립니다.'] },
    ],
    example: ['상담실장 실수령 350만원', '일회성 비용 300만원', '객단가 80만원·월 8건 증가', '변동비 20%'],
    results: ['월 총 고용비와 손익분기 매출·건수', '예상 월 순이익', '일회성 비용 회수기간과 누적 손익'],
    cautions: ['희망 매출이 아니라 최근 3~6개월 실제 전환율을 사용하세요.', '채용 직후 적응기간은 보수 시나리오로 별도 검토하세요.'],
  },
  startup: {
    kicker: '개원자금 계산기', title: '필요자금과 개원 후 버틸 기간을 설계하는 법', calculator: '/startup',
    description: '개원 전 일회성 지출, 개원 후 월 고정비, 예비운전자금과 대출을 구분해 총 필요자금을 계산합니다.',
    prepare: ['견적서 기준 일회성 개원비', '월 임차료·인건비·운영비', '자기자금·대출 조건과 예상 환자 지표'],
    steps: [
      { title: '1. 개원비 입력', items: ['보증금, 인테리어, 장비, 가구·IT, 초도물품 등 견적 금액을 부가세 포함 여부와 같은 기준으로 입력합니다.', '아직 견적이 없는 항목은 보수적인 예상액을 넣고 예비비율을 더합니다.'] },
      { title: '2. 운전자금 계산', items: ['월 임차료·인건비·마케팅비 등 매월 나가는 비용을 입력합니다.', '매출이 안정될 때까지 버틸 개월 수를 예비운전자금 개월로 설정합니다.'] },
      { title: '3. 조달·손익 확인', items: ['자기자금과 대출의 금리·기간을 실제 조건대로 입력합니다.', '매출총이익률, 객단가, 진료일수로 월·일 손익분기 환자 수를 확인합니다.'] },
    ],
    example: ['일회성 개원비 7억원', '월 운영비 8천만원·예비기간 6개월', '자기자금 4억원·대출 7억원', '객단가 15만원·진료 24일'],
    results: ['총 필요자금과 조달 후 부족·여유금', '월 원리금·총 이자와 월 현금유출', '손익분기 매출 및 월·일 환자 수'],
    cautions: ['보증금처럼 회수 가능한 돈도 개원 시점에는 필요한 현금입니다.', '대출 거치기간, 세금, 카드수수료 등 계약별 차이는 별도 반영하세요.'],
  },
};

export function generateStaticParams() { return Object.keys(manuals).map(slug => ({ slug })); }

export default async function ManualPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const manual = manuals[slug];
  if (!manual) notFound();
  return <main><SiteHeader/><article className="manual-page">
    <div className="manual-topbar"><Link className="manual-back" href={manual.calculator}>← 계산기로 돌아가기</Link><a className="manual-download" href="/thefount-calculator-manual-summary.pdf" download>전체 매뉴얼 1장 PDF ↓</a></div>
    <header className="manual-heading"><span>{manual.kicker} · USER GUIDE</span><h1>{manual.title}</h1><p>{manual.description}</p></header>
    <section className="manual-section manual-prepare"><div><span className="manual-number">00</span><h2>계산 전에 준비하세요</h2></div><ul>{manual.prepare.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="manual-section"><div><span className="manual-number">01</span><h2>입력 순서</h2></div><div className="manual-steps">{manual.steps.map(step=><section key={step.title}><h3>{step.title}</h3><ul>{step.items.map(item=><li key={item}>{item}</li>)}</ul></section>)}</div></section>
    <section className="manual-example"><span>입력 예시</span><div>{manual.example.map(item=><p key={item}>{item}</p>)}</div></section>
    <div className="manual-two-column"><section className="manual-section"><div><span className="manual-number">02</span><h2>결과 읽는 법</h2></div><ul className="manual-check-list">{manual.results.map(item=><li key={item}>{item}</li>)}</ul></section><section className="manual-section manual-caution"><div><span className="manual-number">03</span><h2>주의할 점</h2></div><ul>{manual.cautions.map(item=><li key={item}>{item}</li>)}</ul></section></div>
    <aside className="manual-note"><strong>계산 결과는 의사결정용 예상치입니다.</strong><p>실제 급여·세금·보험료·대출 조건은 개인과 계약에 따라 달라질 수 있으므로 실행 전 노무·세무·금융 전문가와 확인하세요.</p></aside>
    <Link className="manual-final-cta" href={manual.calculator}>이제 계산해보기 <span>→</span></Link>
  </article><SiteFooter/></main>;
}
