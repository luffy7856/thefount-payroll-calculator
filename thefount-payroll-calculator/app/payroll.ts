export type EmployerSize = 'under150'|'priority'|'under1000'|'over1000';
export type CalculationInput = { inputType:'net'|'gross'; amount:number; dependents:number; children:number; employerSize:EmployerSize; durunuri:boolean; smallWorkplace:boolean; overtime:number; night:number; holiday:number; meal:number; childcare:number; transport:number };

const RATES = { pension:.0475, health:.03595, ltc:.1314, employeeEmployment:.009, accident:.006 };
const employmentRate:Record<EmployerSize,number> = { under150:.0115, priority:.0135, under1000:.0155, over1000:.0175 };
const taxAnchors:[number,number][] = [[0,0],[1060000,0],[1500000,8920],[2000000,19520],[2594870,38830],[3000000,74350],[3500000,133500],[4134995,211980],[5000000,366470],[6500000,653380],[8000000,1044210],[10000000,1510740],[14000000,2641210],[19905184,5103490],[25000000,7140000]];
const round = (n:number) => Math.round(n);
const interpolate = (x:number, points:[number,number][]) => { for(let i=1;i<points.length;i++){const [x1,y1]=points[i-1],[x2,y2]=points[i]; if(x<=x2) return round(y1+(y2-y1)*(x-x1)/(x2-x1));} const [x1,y1]=points.at(-2)!,[x2,y2]=points.at(-1)!; return round(y2+(y2-y1)*(x-x2)/(x2-x1)); };
const incomeTax = (taxable:number, dependents:number, children:number) => Math.max(0, round((interpolate(taxable,taxAnchors) - Math.max(0,dependents-1)*22000 - children*12500)/10)*10);

function calculateGross(gross:number, input:CalculationInput){
  const cappedNonTax = Math.min(input.meal,200000)+Math.min(input.childcare,200000)+Math.min(input.transport,200000);
  const taxable = Math.max(0,gross-cappedNonTax);
  const pensionBase = Math.min(taxable,6370000);
  const pension=round(pensionBase*RATES.pension), health=round(taxable*RATES.health), longTermCare=round(health*RATES.ltc), unemployment=round(taxable*RATES.employeeEmployment);
  const taxIncome=incomeTax(taxable,input.dependents,input.children), local=round(taxIncome*.1);
  const employeeTotal=pension+health+longTermCare+unemployment;
  const net=gross-employeeTotal-taxIncome-local;
  const employerUnemployment=round(taxable*employmentRate[input.employerSize]), accident=round(taxable*RATES.accident);
  const employerTotal=pension+health+longTermCare+employerUnemployment+accident;
  const eligible=input.durunuri && taxable<2700000;
  const support=eligible?round((pension+round(taxable*.009))*.8):0;
  return { gross, net, taxable, employeeContributions:{pension,health,longTermCare,unemployment,total:employeeTotal}, employerContributions:{pension,health,longTermCare,unemployment:employerUnemployment,accident,total:employerTotal}, tax:{income:taxIncome,local}, durunuri:{eligible,employeeSupport:support,employerSupport:support} };
}

export function calculatePayroll(input:CalculationInput){
  let baseGross=input.inputType==='gross'?input.amount:input.amount*1.15;
  if(input.inputType==='net'){let lo=input.amount,hi=input.amount*2.2+1000000;for(let i=0;i<42;i++){const mid=(lo+hi)/2;calculateGross(mid,input).net<input.amount?lo=mid:hi=mid;}baseGross=round((lo+hi)/2);}
  const hourly=baseGross/209, multiplier=input.smallWorkplace?1:1.5;
  const overtime=round(hourly*input.overtime*multiplier), night=round(hourly*input.night*(input.smallWorkplace?1:.5)), holiday=round(hourly*input.holiday*multiplier), overtimeTotal=overtime+night+holiday;
  const gross=baseGross+overtimeTotal, core=calculateGross(gross,input), severance=round(gross/12);
  const employerTotal=core.gross+core.employerContributions.total+severance-core.durunuri.employerSupport;
  return {...core,severance,employerTotal,overtimePay:{hourlyWage:round(hourly),overtime,night,holiday,total:overtimeTotal}};
}
export const formatWon=(n:number)=>`${Math.round(n).toLocaleString('ko-KR')}원`;
export const formatEasyWon=(n:number)=>{
  const rounded=Math.round(n), absolute=Math.abs(rounded);
  if(absolute>=100000000){const value=(rounded/100000000).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');return `${value}억원`;}
  if(absolute>=10000)return `${Math.round(rounded/10000).toLocaleString('ko-KR')}만원`;
  return `${rounded.toLocaleString('ko-KR')}원`;
};
