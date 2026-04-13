import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div 
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-pastel-red" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const styles = {
    success: 'bg-white border-green-200 shadow-lg shadow-green-100',
    error: 'bg-white border-pastel-red/30 shadow-lg shadow-red-100',
    info: 'bg-white border-blue-200 shadow-lg shadow-blue-100'
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 md:gap-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border min-w-[280px] md:min-w-[300px] max-w-[calc(100vw-2rem)]',
        styles[toast.type],
        isExiting ? 'toast-exit' : 'toast-enter'
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-text">{toast.message}</p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-text/50" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (type: ToastData['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message)
  }
}
