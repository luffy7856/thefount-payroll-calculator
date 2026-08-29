import Link from 'next/link';

export function ManualButton({ slug }: { slug: string }) {
  return <Link className="manual-button" href={`/manual/${slug}`}>사용매뉴얼 <span aria-hidden="true">→</span></Link>;
}
