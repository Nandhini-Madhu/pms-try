function Loader({ text = 'Loading...' }) {
  return (
    <div className="panel flex items-center justify-center gap-3 p-6 text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      <span>{text}</span>
    </div>
  )
}

export default Loader
