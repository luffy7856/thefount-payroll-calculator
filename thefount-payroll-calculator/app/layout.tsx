import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import './globals.css';
import './subpages.css';
export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'), title:'더파운트 병의원 인건비 계산기', description:'실수령액부터 병원 총부담까지 한 번에 계산하는 2026 병의원 인건비 계산기', openGraph:{title:'더파운트 병의원 인건비 계산기',description:'실수령액부터 병원 총부담까지 한 번에',images:['/og.png']}, twitter:{card:'summary_large_image',title:'더파운트 병의원 인건비 계산기',description:'실수령액부터 병원 총부담까지 한 번에',images:['/og.png']} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}<Analytics /><Script id="microsoft-clarity" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","ychi5yzwen");` }} /></body></html>}
