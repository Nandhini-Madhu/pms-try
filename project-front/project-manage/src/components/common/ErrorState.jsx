function ErrorState({ message, onRetry }) {
  return (
    <div className="panel space-y-3 p-5 text-red-700">
      <h3 className="font-display text-lg font-semibold">Something failed</h3>
      <p className="text-sm text-red-600">{message}</p>
      {onRetry ? (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState
