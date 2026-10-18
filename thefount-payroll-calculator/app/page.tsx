import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from './site-chrome';

const venture='https://www.thefount.co.kr/invest';
const homepage='https://www.thefount.co.kr/';

export const metadata:Metadata={alternates:{canonical:'https://www.thefount.co.kr/payroll'},openGraph:{title:'더파운트 병의원 인건비 계산기 | 실수령액·4대보험·퇴직금',description:'실수령액부터 병원이 부담하는 월·연간 총 인건비까지 확인하는 병의원 경영 계산기 모음입니다.',url:'https://www.thefount.co.kr/payroll',type:'website',images:['https://www.thefount.co.kr/payroll/og.png']}};

const schema={
  '@context':'https://schema.org',
  '@type':'WebApplication',
  '@id':'https://www.thefount.co.kr/payroll#application',
  name:'더파운트 병의원 인건비 계산기',
  alternateName:'THE FOUNT Clinic Payroll Calculator',
  url:'https://www.thefount.co.kr/payroll',
  applicationCategory:'BusinessApplication',
  operatingSystem:'Web',
  inLanguage:'ko-KR',
  isAccessibleForFree:true,
  description:'직원 실수령액, 세전 급여, 4대보험, 퇴직금과 병원의 총 인건비를 계산하는 병의원 전용 경영 도구',
  publisher:{'@type':'Organization','@id':'https://www.thefount.co.kr/#organization',name:'더파운트 주식회사',url:'https://www.thefount.co.kr/'},
  offers:{'@type':'Offer',price:'0',priceCurrency:'KRW'}
};

export default function CalculatorHome(){return <main className="hub-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><SiteHeader/>
  <section className="hub-hero"><span>THE FOUNT · CLINIC MANAGEMENT TOOLS</span><h1>원장님, 무엇을<br/>계산하시겠어요?</h1><p>병원 운영에 필요한 숫자를 쉽고 정확하게 확인하고,<br/>다음 의사결정까지 한곳에서 이어가세요.</p><a className="hub-launcher" href="#tools"><span>계산기와 경영 정보를 선택하세요</span><b>도구 보기 ↓</b></a></section>
  <section className="hub-tools" id="tools">
    <div className="hub-section-title"><span>CALCULATORS &amp; INSIGHTS</span><h2>필요한 도구를 바로 시작하세요</h2></div>
    <div className="hub-bento">
      <Link className="hub-card hub-payroll" href="/payroll"><div><span>01 · PAYROLL</span><h3>직원 인건비<br/>계산기</h3><p>실수령액부터 병원의 실제 부담까지</p></div><div className="hub-chart" aria-hidden="true"><i/><i/><i/><i/><i/><i/><b>월 총비용</b></div><strong>계산하기 →</strong></Link>
      <Link className="hub-card hub-startup" href="/startup"><div><span>02 · OPENING CAPITAL</span><h3>개원자금<br/>계산기</h3><p>필요자금·금융비용·손익분기를 한 번에</p></div><div className="hub-stack" aria-hidden="true"><i>인테리어</i><i>장비</i><i>운전자금</i></div><strong>계산하기 →</strong></Link>
      <Link className="hub-card hub-mini hub-team" href="/team"><span>03 · TEAM</span><div className="hub-orb">₩</div><h3>팀 인건비</h3><p>직원 전체의 월·연간 예산</p><b>시작하기 →</b></Link>
      <Link className="hub-card hub-mini hub-hiring" href="/hiring"><span>04 · HIRING</span><div className="hub-people"><i/><i/><i/></div><h3>추가채용 분석</h3><p>새 직원의 손익분기와 회수기간</p><b>분석하기 →</b></Link>
      <Link className="hub-card hub-mini hub-period" href="/period"><span>05 · PERIOD</span><div className="hub-calendar"><b>12</b><small>MONTHS</small></div><h3>재직기간 계산</h3><p>기간별 누적 고용비용</p><b>계산하기 →</b></Link>
      <Link className="hub-card hub-info" href="/info"><div><span>06 · CLINIC OPERATIONS</span><h3>병원 노무·운영<br/>정보 가이드</h3><p>네트제 계약, 두루누리, 근로계약서, 퇴사와 인센티브까지 실무 핵심만 정리했습니다.</p></div><div className="hub-tags"><i>NET</i><i>5인</i><i>보험</i><i>계약</i></div><strong>정보 보기 →</strong></Link>
      <a className="hub-card hub-venture" href={venture} target="_blank" rel="noopener noreferrer"><div><span>07 · VENTURE INVESTMENT</span><h3>벤처투자<br/>소득공제</h3><p>절세 구조와 투자 기회를 함께 확인하세요.</p></div><div className="hub-gold-mark">V</div><strong>바로가기 ↗</strong></a>
      <a className="hub-card hub-advisory" href={homepage} target="_blank" rel="noopener noreferrer"><div><span>THE FOUNT · MEDICAL ADVISORY</span><h3>숫자를 확인했다면,<br/>이제 병원의 구조를 설계할 차례입니다.</h3><p>세무·노무·법무·경영 전문가가 하나의 팀으로 답합니다.</p></div><div className="hub-advisory-mark"><b><i>THE</i> FOUNT</b><small>MEDICAL ADVISORY</small></div><strong>더파운트 홈페이지 →</strong></a>
    </div>
  </section><aside style={{padding:'24px',textAlign:'center',background:'#f5f4ef',color:'#102d3b'}} aria-label="인건비 계산기 사용 안내"><a href="https://www.thefount.co.kr/tools/payroll">병의원 인건비 계산기 사용법·결과 해석 안내 →</a></aside><SiteFooter/></main>}
