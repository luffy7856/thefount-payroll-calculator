/* The Toss build's thin layer over the website's own calculator (../../app/payroll.ts).
   Everything is computed on the device; nothing is sent anywhere. */
import { calculatePayroll, type CalculationInput, type EmployerSize } from '../../app/payroll';

export { type EmployerSize };

/* 2026 기준값 — 출처는 계산 기준 시트(Standards.tsx)에 함께 적었습니다. */
export const PENSION_CAP = 6_590_000;          // 국민연금 기준소득월액 상한 (2026.7~2027.6, 보건복지부고시 제2026-31호)
export const MIN_WAGE_HOURLY = 10_320;         // 2026 최저임금 시간급 (고용노동부고시 제2025-47호)
export const MIN_WAGE_MONTHLY = 2_156_880;     // 주 40시간 · 월 209시간 환산
export const DEFAULT_ACCIDENT_RATE = 0.6;      // 산재보험 사업주 요율 % (업종별 상이 · 기본값은 보건업 수준)

export type Company = { employerSize: EmployerSize; accidentRate: number; durunuri: boolean; smallWorkplace: boolean };
export const defaultCompany: Company = { employerSize: 'under150', accidentRate: DEFAULT_ACCIDENT_RATE, durunuri: false, smallWorkplace: false };

export type PayMode = 'gross' | 'annual' | 'net';
export type PayForm = {
  mode: PayMode; amount: number;
  annualIncludesSeverance: boolean;   // 연봉에 퇴직금이 포함된 계약 (연봉 ÷ 13)
  netIncludesSeverance: boolean;      // 실수령액에 퇴직금이 포함된 계약
  dependents: number; children: number;
  meal: number; childcare: number; transport: number;
  overtime: number; night: number; holiday: number;
};

export const defaultPay: PayForm = {
  mode: 'gross', amount: 3_000_000, annualIncludesSeverance: false, netIncludesSeverance: false,
  dependents: 1, children: 0, meal: 0, childcare: 0, transport: 0, overtime: 0, night: 0, holiday: 0,
};

export function toInput(pay: PayForm, company: Company): CalculationInput {
  const monthly = pay.mode === 'annual' ? Math.round(pay.amount / (pay.annualIncludesSeverance ? 13 : 12)) : pay.amount;
  return {
    inputType: pay.mode === 'net' ? 'net' : 'gross',
    netIncludesSeverance: pay.mode === 'net' && pay.netIncludesSeverance,
    amount: Math.max(0, monthly),
    dependents: Math.max(1, pay.dependents), children: Math.max(0, pay.children),
    employerSize: company.employerSize, durunuri: company.durunuri, smallWorkplace: company.smallWorkplace,
    overtime: pay.overtime, night: pay.night, holiday: pay.holiday,
    meal: pay.meal, childcare: pay.childcare, transport: pay.transport,
    pensionCap: PENSION_CAP, accidentRate: Number((company.accidentRate / 100).toFixed(6)),
  };
}

export type Payroll = ReturnType<typeof calculatePayroll>;
export function compute(pay: PayForm, company: Company): Payroll | null {
  const input = toInput(pay, company);
  if (!(input.amount > 0)) return null;
  return calculatePayroll(input);
}

export const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;
/* 3,512,340 → "351만 2,340원", 123,456,789 → "1억 2,345만원" (Toss style reading aid) */
export function korean(n: number): string {
  const v = Math.round(Math.abs(n));
  if (v === 0) return '0원';
  const eok = Math.floor(v / 1e8), man = Math.floor((v % 1e8) / 1e4), rest = v % 1e4;
  const parts: string[] = [];
  if (eok) parts.push(`${eok.toLocaleString('ko-KR')}억`);
  if (man) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (rest && !eok) parts.push(rest.toLocaleString('ko-KR'));
  return (n < 0 ? '-' : '') + parts.join(' ') + '원';
}
/* short: 3,512,340 → "351만원", 1.5억 → "1.5억원" */
export function short(n: number): string {
  const v = Math.round(n), a = Math.abs(v);
  if (a >= 1e8) return `${(v / 1e8).toFixed(2).replace(/\.?0+$/, '')}억원`;
  if (a >= 1e4) return `${Math.round(v / 1e4).toLocaleString('ko-KR')}만원`;
  return `${v.toLocaleString('ko-KR')}원`;
}
export const pct = (n: number, digits = 1) => `${(n * 100).toFixed(digits).replace(/\.0$/, '')}%`;

export const employerSizeLabel: Record<EmployerSize, string> = {
  under150: '150인 미만', priority: '우선지원대상기업', under1000: '150인 이상 1,000인 미만', over1000: '1,000인 이상·국가기관',
};
export const employerSizeRate: Record<EmployerSize, number> = { under150: 0.25, priority: 0.45, under1000: 0.65, over1000: 0.85 };

/* local, per-device convenience only */
export function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (!raw) return fallback; return { ...fallback, ...JSON.parse(raw) }; } catch { return fallback; }
}
export function loadList<T>(key: string, fallback: T[]): T[] {
  try { const raw = localStorage.getItem(key); const v = raw ? JSON.parse(raw) : null; return Array.isArray(v) && v.length ? v : fallback; } catch { return fallback; }
}
export function save(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } }
