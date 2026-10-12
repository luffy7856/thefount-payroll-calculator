import type { MetadataRoute } from 'next';

const paths=[
  '', 'payroll', 'team', 'period', 'hiring', 'startup', 'info',
  'articles/net-contract', 'articles/durunuri',
  'info/workplace-size', 'info/employment-contract', 'info/resignation',
  'info/incentive', 'info/non-covered', 'info/minimum-wage'
];

export default function sitemap():MetadataRoute.Sitemap{
  const base='https://www.thefount.co.kr/payroll';
  const lastModified=new Date('2026-09-22');
  return paths.map((path,index)=>({
    url:path?`${base}/${path}`:`${base}/`,
    lastModified,
    changeFrequency:index===0?'weekly':'monthly',
    priority:index===0?1:(path==='payroll'?0.95:0.75)
  }));
}
