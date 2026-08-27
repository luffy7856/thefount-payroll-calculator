import { calculatePayroll } from '../app/payroll.ts';
const base={dependents:1,children:0,employerSize:'under150',durunuri:false,smallWorkplace:false,overtime:0,night:0,holiday:0,meal:0,childcare:0,transport:0};
const cases=[
 {name:'총 지급액 300만원',input:{...base,inputType:'gross',amount:3000000},expected:{gross:3000000,net:2626693,employerTotal:3567022}},
 {name:'실수령 230만원',input:{...base,inputType:'net',amount:2300000},expected:{gross:2594870,net:2300003,employerTotal:3085319}},
 {name:'실수령 350만원',input:{...base,inputType:'net',amount:3500000},expected:{gross:4134995,net:3500003,employerTotal:4916539}},
 {name:'페이닥터 실수령 1,300만원',input:{...base,inputType:'net',amount:13000000},expected:{gross:19905184,net:12999999,employerTotal:23024488}},
];
let failed=0;
for(const c of cases){const actual=calculatePayroll(c.input);const diffs=Object.fromEntries(Object.entries(c.expected).map(([k,v])=>[k,Math.abs(actual[k]-v)]));const ok=Object.values(diffs).every(d=>d<=8);console.log(`${ok?'PASS':'FAIL'} ${c.name}`,{actual:{gross:actual.gross,net:actual.net,employerTotal:actual.employerTotal},diffs});if(!ok)failed++;}
if(failed)process.exit(1);
