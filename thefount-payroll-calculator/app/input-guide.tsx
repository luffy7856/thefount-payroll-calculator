export function Guide({title,meaning,example}:{title:string;meaning:string;example:string}){
 return <span className="input-guide" tabIndex={0} aria-label={`${title} 작성 가이드`}><span className="guide-trigger"><i aria-hidden="true">▤</i>작성 가이드</span><span className="guide-pop"><span className="guide-pop-head"><span aria-hidden="true">▤</span><strong>{title} 작성 가이드</strong></span><span className="guide-pop-body"><p>{meaning}</p><em>참고 · {example}</em></span></span></span>
}

export function GuideLabel({children,title,meaning,example}:{children:React.ReactNode;title:string;meaning:string;example:string}){
 return <span className="guide-label"><b>{children}</b><Guide title={title} meaning={meaning} example={example}/></span>
}
