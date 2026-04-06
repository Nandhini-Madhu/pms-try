import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="panel w-full max-w-xl p-8 text-center">
        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
