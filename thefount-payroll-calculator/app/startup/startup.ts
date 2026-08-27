export type FundingKind='bank'|'guarantee'|'personal'|'other';
export type FundingSource={kind:FundingKind;amount:number;annualRate:number;termYears:number};
export type StartupInput={oneTimeCosts:number[];monthlyCosts:number[];reserveMonths:number;contingencyRate:number;funding:FundingSource[];grossMarginRate:number;averageRevenue:number;workDays:number};

const round=(n:number)=>Math.round(Number.isFinite(n)?n:0);

export function loanPayment(source:FundingSource){
  if(source.amount<=0||source.annualRate<=0||source.termYears<=0)return {monthlyPayment:0,firstMonthInterest:0,totalInterest:0};
  const months=source.termYears*12,rate=source.annualRate/100/12;
  const monthlyPayment=source.amount*rate*Math.pow(1+rate,months)/(Math.pow(1+rate,months)-1);
  return {monthlyPayment:round(monthlyPayment),firstMonthInterest:round(source.amount*rate),totalInterest:round(monthlyPayment*months-source.amount)};
}

export function calculateStartup(input:StartupInput){
  const oneTimeBase=input.oneTimeCosts.reduce((sum,value)=>sum+Math.max(0,value),0);
  const contingency=round(oneTimeBase*Math.max(0,input.contingencyRate)/100);
  const oneTimeTotal=oneTimeBase+contingency;
  const monthlyOperating=input.monthlyCosts.reduce((sum,value)=>sum+Math.max(0,value),0);
  const reserve=monthlyOperating*Math.max(0,input.reserveMonths);
  const requiredCapital=oneTimeTotal+reserve;
  const fundingTotal=input.funding.reduce((sum,source)=>sum+Math.max(0,source.amount),0);
  const debt=input.funding.map(source=>({...source,...loanPayment(source)}));
  const monthlyDebtPayment=debt.reduce((sum,source)=>sum+source.monthlyPayment,0);
  const firstMonthInterest=debt.reduce((sum,source)=>sum+source.firstMonthInterest,0);
  const totalInterest=debt.reduce((sum,source)=>sum+source.totalInterest,0);
  const monthlyCashOut=monthlyOperating+monthlyDebtPayment;
  const margin=Math.max(.01,input.grossMarginRate/100);
  const breakEvenRevenue=round(monthlyCashOut/margin);
  const monthlyPatients=input.averageRevenue>0?Math.ceil(breakEvenRevenue/input.averageRevenue):0;
  const dailyPatients=input.workDays>0?Math.ceil(monthlyPatients/input.workDays):0;
  return {oneTimeBase,contingency,oneTimeTotal,monthlyOperating,reserve,requiredCapital,fundingTotal,fundingGap:fundingTotal-requiredCapital,debt,monthlyDebtPayment,firstMonthInterest,totalInterest,monthlyCashOut,breakEvenRevenue,monthlyPatients,dailyPatients};
}

export const startupWon=(n:number)=>`${Math.round(n).toLocaleString('ko-KR')}원`;
export const startupEasyWon=(n:number)=>{const value=Math.round(n);if(Math.abs(value)>=100000000)return `${(value/100000000).toFixed(1).replace('.0','')}억원`;if(Math.abs(value)>=10000)return `${Math.round(value/10000).toLocaleString('ko-KR')}만원`;return startupWon(value)};

