import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import './subpages.css';
import './fount-brand.css';
import './fount-upgrade.css';
const siteUrl='https://www.thefount.co.kr/payroll';
const title='더파운트 병의원 인건비 계산기 | 실수령액·4대보험·퇴직금';
const description='직원 실수령액을 입력하면 세전 급여, 4대보험 사업주 부담금, 퇴직금과 병원의 월·연간 총 인건비를 계산하는 더파운트 병의원 인건비 계산기입니다.';
export const metadata: Metadata = {
  metadataBase:new URL(siteUrl),
  title:{default:title,template:'%s | 더파운트'},
  description,
  keywords:['더파운트 인건비 계산기','병원 인건비 계산기','병의원 인건비','실수령액 계산기','4대보험 계산기','퇴직금 계산기','네트제 급여','병원 직원 월급'],
  openGraph:{title,description,url:'/',siteName:'THE FOUNT 병의원 경영 계산기',locale:'ko_KR',type:'website',images:[{url:'https://www.thefount.co.kr/payroll/og.png',width:1200,height:630,alt:'더파운트 병의원 인건비 계산기'}]},
  twitter:{card:'summary_large_image',title,description,images:['https://www.thefount.co.kr/payroll/og.png']},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1}},
  verification:{
    google:'nRJqHwegymSY3Kz9qBkiObdmdWg4qjIMv4DC6wANwXE',
    other:{'naver-site-verification':'be043663445390bdaacec236607e8bd014ba56ab'}
  }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}<Analytics /><Script src="/payroll/fount-language.js?v=20261007a" data-common="true" strategy="afterInteractive" /></body></html>}
