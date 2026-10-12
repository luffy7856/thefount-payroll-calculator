import type { Metadata } from 'next';

const title='병의원 인건비 계산기 | 실수령액·4대보험·퇴직금';
const description='병원 직원의 실수령액 또는 세전 급여를 입력하면 근로자 공제액, 사업주 4대보험, 퇴직금과 병원의 실제 월·연간 인건비를 계산합니다.';

export const metadata:Metadata={
  title,
  description,
  alternates:{canonical:'/payroll'},
  openGraph:{title:`${title} | 더파운트`,description,url:'/payroll',type:'website'},
  twitter:{card:'summary_large_image',title:`${title} | 더파운트`,description}
};

export default function PayrollLayout({children}:{children:React.ReactNode}){return children;}
