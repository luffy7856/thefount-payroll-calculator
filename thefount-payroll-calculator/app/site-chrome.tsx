'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menus=[{href:'/',label:'인건비 계산기',short:'계산기'},{href:'/period',label:'재직기간',short:'재직기간'},{href:'/team',label:'팀 인건비',short:'팀 인건비'},{href:'/articles/durunuri',label:'두루누리',short:'두루누리'},{href:'/articles/net-contract',label:'네트제 계약',short:'네트제'}] as const;
const venture='https://nextbridge-vercel-upload.vercel.app/';

export function SiteHeader(){const pathname=usePathname();return <><header className="topbar site-nav"><Link className="brand" href="/"><span className="brand-mark">F</span><span>THE FOUNT</span></Link><nav aria-label="주요 메뉴">{menus.map(item=><Link key={item.href} className={pathname===item.href?'active':''} href={item.href}>{item.label}</Link>)}<a className="venture-link" href={venture} target="_blank" rel="noopener noreferrer"><span>벤처투자 소득공제</span><i>↗</i></a></nav><span className="year-badge">2026 기준</span></header><div className="mobile-nav">{menus.map(item=><Link key={item.href} className={pathname===item.href?'active':''} href={item.href}>{item.short}</Link>)}<a className="venture-link" href={venture} target="_blank" rel="noopener noreferrer">벤처투자 소득공제 ↗</a></div></>}
export function SiteFooter(){return <footer><div className="brand"><span className="brand-mark">F</span><span>THE FOUNT</span></div><p>병의원 운영 의사결정을 위한 참고용 계산 도구입니다. 실제 신고·급여 지급 전 세무사 또는 노무사 확인을 권장합니다.</p><span>© 2026 THE FOUNT</span></footer>}
