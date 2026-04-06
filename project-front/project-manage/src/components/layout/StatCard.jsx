function StatCard({ title, value, tone = 'ink' }) {
  const toneClass = {
    ink: 'from-ink/15 to-transparent text-ink',
    sea: 'from-sea/20 to-transparent text-sea',
    coral: 'from-coral/20 to-transparent text-coral',
    sun: 'from-sun/20 to-transparent text-amber-700',
  }[tone]

  return (
    <article className="panel overflow-hidden p-5">
      <div className={`mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r ${toneClass}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <h3 className="mt-1 font-display text-3xl font-bold text-ink">{value}</h3>
    </article>
  )
}

export default StatCard
