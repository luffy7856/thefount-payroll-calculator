import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../site-chrome';

const guides=[
  {n:'01',href:'/articles/net-contract',title:'네트제 계약 가이드',description:'실수령 계약의 구조와 병원 부담'},
  {n:'02',href:'/articles/durunuri',title:'두루누리 지원제도',description:'지원대상과 보험료 절감 조건'},
  {n:'03',href:'/info/workplace-size',title:'5인 미만·이상 차이',description:'근로기준법 적용 항목 비교'},
  {n:'04',href:'/info/employment-contract',title:'근로계약서 체크리스트',description:'채용 전 놓치면 안 되는 조항'},
  {n:'05',href:'/info/resignation',title:'직원 퇴사 체크리스트',description:'퇴사 통보부터 정산까지'},
  {n:'06',href:'/info/incentive',title:'인센티브 계약 가이드',description:'분쟁을 줄이는 성과급 설계'},
  {n:'07',href:'/info/non-covered',title:'비급여 보고·가격 공개',description:'병원 의무와 일정 정리'},
  {n:'08',href:'/info/minimum-wage',title:'최저임금·주휴수당',description:'2026년 기준 급여 계산'}
] as const;

export default function InfoLibrary(){return <main className="info-library"><SiteHeader/>
  <section className="info-library-hero"><div><span>CLINIC OPERATIONS LIBRARY</span><h1>병원 운영의 중요한 순간,<br/>필요한 실무정보를 확인하세요.</h1><p>채용부터 퇴사, 급여계약과 지원제도까지 원장님이 자주 마주하는 상황을 정리했습니다.</p></div></section>
  <section className="info-library-main"><Link className="info-featured" href="/articles/net-contract"><div><span>이번 주 추천 가이드</span><h2>네트제 계약,<br/>총 인건비는 얼마일까요?</h2><p>실수령액 약정 시 반드시 확인할 계약 문구와<br/>보험료·퇴직금 부담을 한 번에 확인하세요.</p><strong>가이드 읽기 →</strong></div><div className="info-featured-visual" aria-hidden="true"><i/><i/><b>NET</b></div></Link>
    <div className="info-library-heading"><span>ALL GUIDES · 8</span><h2>병원경영 실무정보 전체보기</h2></div>
    <div className="info-library-grid">{guides.map(g=><Link className="info-library-card" href={g.href} key={g.href}><span>{g.n}</span><div><h3>{g.title}</h3><p>{g.description}</p></div><b>→</b></Link>)}</div>
  </section><SiteFooter/></main>}
