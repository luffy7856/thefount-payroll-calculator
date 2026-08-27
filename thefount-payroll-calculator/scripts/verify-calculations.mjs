import { calculatePayroll } from '../app/payroll.ts';
import { calculateStartup } from '../app/startup/startup.ts';
import { calculateHiring } from '../app/hiring/hiring.ts';
const base={netIncludesSeverance:false,dependents:1,children:0,employerSize:'under150',durunuri:false,smallWorkplace:false,overtime:0,night:0,holiday:0,meal:0,childcare:0,transport:0};
const cases=[
 {name:'총 지급액 300만원',input:{...base,inputType:'gross',amount:3000000},expected:{gross:3000000,net:2626693,employerTotal:3567022}},
 {name:'실수령 230만원',input:{...base,inputType:'net',amount:2300000},expected:{gross:2594870,net:2300003,employerTotal:3085319}},
 {name:'실수령 350만원',input:{...base,inputType:'net',amount:3500000},expected:{gross:4134995,net:3500003,employerTotal:4916539}},
 {name:'페이닥터 실수령 1,300만원',input:{...base,inputType:'net',amount:13000000},expected:{gross:19905184,net:12999999,employerTotal:23024488}},
];
let failed=0;
for(const c of cases){const actual=calculatePayroll(c.input);const diffs=Object.fromEntries(Object.entries(c.expected).map(([k,v])=>[k,Math.abs(actual[k]-v)]));const ok=Object.values(diffs).every(d=>d<=8);console.log(`${ok?'PASS':'FAIL'} ${c.name}`,{actual:{gross:actual.gross,net:actual.net,employerTotal:actual.employerTotal},diffs});if(!ok)failed++;}
const included=calculatePayroll({...base,inputType:'net',netIncludesSeverance:true,amount:5000000});
const includedDiff=Math.abs(included.net+included.severance-5000000);
const includedOk=includedDiff<=8&&included.net<5000000;
console.log(`${includedOk?'PASS':'FAIL'} 퇴직금 포함 실수령 500만원`,{actual:{contractedNet:included.net+included.severance,employeeNet:included.net,severance:included.severance},diff:includedDiff});
if(!includedOk)failed++;
const startup=calculateStartup({oneTimeCosts:[400000000],monthlyCosts:[50000000],reserveMonths:6,contingencyRate:10,funding:[{kind:'bank',amount:200000000,annualRate:6,termYears:5},{kind:'personal',amount:300000000,annualRate:0,termYears:0}],grossMarginRate:70,averageRevenue:100000,workDays:25});
const startupOk=startup.requiredCapital===740000000&&startup.fundingGap===-240000000&&startup.monthlyDebtPayment===3866560&&startup.totalInterest===31993618;
console.log(`${startupOk?'PASS':'FAIL'} 개원자금 및 대출이자`,{requiredCapital:startup.requiredCapital,fundingGap:startup.fundingGap,monthlyDebtPayment:startup.monthlyDebtPayment,totalInterest:startup.totalInterest});
if(!startupOk)failed++;
const hiring=calculateHiring({payroll:{...base,inputType:'gross',amount:3000000,meal:200000},initialCosts:[2500000],monthlyOther:200000,effectMode:'direct',workDays:22,averageRevenue:120000,unitsPerDay:3,variableCostRate:20,refundRate:3,savedHoursPerDay:1,productiveUseRate:60,patientsPerHour:2,monthlyInquiries:200,currentConversionRate:30,afterConversionRate:38});
const hiringOk=hiring.addedCases===66&&hiring.addedRevenue===7920000&&hiring.monthlyProfit===2352513&&hiring.breakEvenCases===41;
console.log(`${hiringOk?'PASS':'FAIL'} 직원 추가채용 손익`,{addedCases:hiring.addedCases,addedRevenue:hiring.addedRevenue,monthlyProfit:hiring.monthlyProfit,breakEvenCases:hiring.breakEvenCases});
if(!hiringOk)failed++;
if(failed)process.exit(1);

