import { useState, useEffect } from 'react'
import type { Contributor } from '@/types/gift'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ReserveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  giftName: string
  onReserve: (contributor: Contributor) => Promise<{ success: boolean; error?: string }>
  isGroup: boolean
  isGiftGroup?: boolean
  error?: string | null
  onSuccess?: () => void
}

export function ReserveModal({ 
  open, 
  onOpenChange, 
  giftName, 
  onReserve,
  isGroup,
  isGiftGroup = false,
  error,
  onSuccess
}: ReserveModalProps) {
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setLastname('')
      setEmail('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isGiftGroup) {
      if (!name.trim() || !email.trim()) return
    } else {
      if (!name.trim() || !lastname.trim() || !email.trim()) return
    }
    
    setIsSubmitting(true)
    try {
      const lastnameValue = isGiftGroup ? '' : lastname.trim()
      const result = await onReserve({ name: name.trim(), lastname: lastnameValue, email: email.trim() })
      if (result.success) {
        setShowSuccess(true)
        onSuccess?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setLastname('')
    setEmail('')
    setShowSuccess(false)
    onOpenChange(false)
  }

  if (!open) return null

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-text mb-2">
            ¡Gracias por reservar este obsequio!
          </h2>
          <p className="text-lg text-text/70 mb-6">
            Te esperamos el día del evento 🎉
          </p>
          <Button 
            onClick={handleClose}
            className="h-12 px-8 text-base font-semibold w-full"
          >
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-12 md:pt-20 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full my-4">
        <h2 className="text-xl font-bold text-text text-center mb-6">
          {isGroup ? 'Aportar' : 'Reservar'} {giftName}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Correo electrónico</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              required
              disabled={isSubmitting}
              className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-green/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {isGiftGroup ? 'Nombre de Familia/Grupo' : 'Nombre'}
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isGiftGroup ? 'Familia García' : 'Juan'}
              required
              disabled={isSubmitting}
              className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-green/50"
            />
          </div>
          
          {!isGiftGroup && (
            <div>
              <label className="block text-sm font-medium text-text mb-2">Apellido</label>
              <input 
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Pérez"
                required
                disabled={isSubmitting}
                className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-green/50"
              />
            </div>
          )}

          {error && (
            <div className="bg-pastel-red/10 text-pastel-red text-sm text-center py-3 px-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 h-12 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-pastel-green text-white rounded-lg font-medium hover:bg-pastel-green/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirmando...
                </span>
              ) : (
                'Confirmar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}