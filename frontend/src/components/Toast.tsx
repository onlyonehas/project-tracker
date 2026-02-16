interface ToastProps {
  message: string
}

function Toast({ message }: ToastProps) {
  return (
    <div className="toast-container" aria-live="polite">
      <div className="toast">{message}</div>
    </div>
  )
}

export default Toast
