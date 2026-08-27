'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const payrollMenus=[{href:'/',label:'인건비 계산기'},{href:'/period',label:'재직기간 계산기'},{href:'/team',label:'팀 인건비'}] as const;
const infoMenus=[{href:'/articles/net-contract',label:'네트제 계약'},{href:'/articles/durunuri',label:'두루누리'}] as const;
const venture='https://nextbridge-vercel-upload.vercel.app/';

function MenuGroup({label,items,pathname}:{label:string;items:readonly {href:string;label:string}[];pathname:string}){const active=items.some(item=>pathname===item.href);return <div className={`nav-group ${active?'group-active':''}`}><button type="button" aria-haspopup="true">{label}<i>▾</i></button><div className="nav-dropdown">{items.map(item=><Link key={item.href} className={pathname===item.href?'active':''} href={item.href}>{item.label}</Link>)}</div></div>}

export function SiteHeader(){const pathname=usePathname();return <><header className="topbar site-nav"><Link className="brand" href="/"><span className="brand-mark">F</span><span>THE FOUNT</span></Link><nav aria-label="주요 메뉴"><MenuGroup label="인건비 계산기" items={payrollMenus} pathname={pathname}/><Link className={pathname==='/startup'?'active':''} href="/startup">개원자금 계산기</Link><MenuGroup label="정보" items={infoMenus} pathname={pathname}/><a className="venture-link" href={venture} target="_blank" rel="noopener noreferrer"><span>벤처투자 소득공제</span><i>↗</i></a></nav><span className="year-badge">2026 기준</span></header><div className="mobile-nav"><details className="mobile-menu-group" open={payrollMenus.some(item=>pathname===item.href)}><summary>인건비 계산기</summary><div>{payrollMenus.map(item=><Link key={item.href} className={pathname===item.href?'active':''} href={item.href}>{item.label}</Link>)}</div></details><Link className={pathname==='/startup'?'active':''} href="/startup">개원자금 계산기</Link><details className="mobile-menu-group" open={infoMenus.some(item=>pathname===item.href)}><summary>정보</summary><div>{infoMenus.map(item=><Link key={item.href} className={pathname===item.href?'active':''} href={item.href}>{item.label}</Link>)}</div></details><a className="venture-link" href={venture} target="_blank" rel="noopener noreferrer">벤처투자 소득공제 ↗</a></div></>}
export function SiteFooter(){return <footer><div className="brand"><span className="brand-mark">F</span><span>THE FOUNT</span></div><p>병의원 운영 의사결정을 위한 참고용 계산 도구입니다. 실제 신고·급여 지급 전 세무사 또는 노무사 확인을 권장합니다.</p><span>© 2026 THE FOUNT</span></footer>}

