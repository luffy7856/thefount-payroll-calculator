import {calculatePayroll,type CalculationInput} from '../payroll';
export type EffectMode='direct'|'time'|'conversion';
export type HiringInput={payroll:CalculationInput;initialCosts:number[];monthlyOther:number;effectMode:EffectMode;workDays:number;averageRevenue:number;unitsPerDay:number;variableCostRate:number;refundRate:number;savedHoursPerDay:number;productiveUseRate:number;patientsPerHour:number;monthlyInquiries:number;currentConversionRate:number;afterConversionRate:number};
const round=(n:number)=>Math.round(Number.isFinite(n)?n:0);
export function calculateHiring(input:HiringInput){
 const payroll=calculatePayroll(input.payroll),initialCost=input.initialCosts.reduce((sum,value)=>sum+Math.max(0,value),0);
 let addedCases=0;
 if(input.effectMode==='direct')addedCases=Math.max(0,input.unitsPerDay)*Math.max(0,input.workDays);
 if(input.effectMode==='time')addedCases=Math.max(0,input.savedHoursPerDay)*Math.max(0,input.productiveUseRate)/100*Math.max(0,input.patientsPerHour)*Math.max(0,input.workDays);
 if(input.effectMode==='conversion')addedCases=Math.max(0,input.monthlyInquiries)*(Math.max(0,input.afterConversionRate)-Math.max(0,input.currentConversionRate))/100;
 addedCases=Math.max(0,addedCases);
 const addedRevenue=round(addedCases*Math.max(0,input.averageRevenue));
 const contributionRate=Math.max(.01,1-Math.max(0,input.variableCostRate)/100-Math.max(0,input.refundRate)/100);
 const addedContribution=round(addedRevenue*contributionRate),monthlyEmploymentCost=payroll.employerTotal+Math.max(0,input.monthlyOther),monthlyProfit=addedContribution-monthlyEmploymentCost;
 const breakEvenRevenue=round(monthlyEmploymentCost/contributionRate),breakEvenCases=input.averageRevenue>0?Math.ceil(breakEvenRevenue/input.averageRevenue):0;
 const recoveryMonths=monthlyProfit>0?initialCost/monthlyProfit:null;
 const scenarios=[{label:'보수적',factor:.7},{label:'기준',factor:1},{label:'낙관적',factor:1.3}].map(item=>({...item,revenue:round(addedRevenue*item.factor),profit:round(addedContribution*item.factor-monthlyEmploymentCost)}));
 const verdict:'good'|'conditional'|'burden'=scenarios[0].profit>=0&&recoveryMonths!==null&&recoveryMonths<=6?'good':monthlyProfit>0&&recoveryMonths!==null&&recoveryMonths<=12?'conditional':'burden';
 return {payroll,initialCost,addedCases:round(addedCases),addedRevenue,addedContribution,monthlyEmploymentCost,monthlyProfit,breakEvenRevenue,breakEvenCases,recoveryMonths,scenarios,verdict,cumulative:[3,6,12].map(months=>({months,profit:round(monthlyProfit*months-initialCost)}))};
}
export const hiringWon=(n:number)=>`${Math.round(n).toLocaleString('ko-KR')}원`;
export const hiringEasyWon=(n:number)=>Math.abs(n)>=100000000?`${(n/100000000).toFixed(1).replace('.0','')}억원`:Math.abs(n)>=10000?`${Math.round(n/10000).toLocaleString('ko-KR')}만원`:hiringWon(n);

