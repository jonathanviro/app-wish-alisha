import { useState, useEffect } from 'react'
import type { Contributor } from '@/types/gift'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface OpenGiftModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Contributor & { giftName: string }) => Promise<{ success: boolean; error?: string }>
}

export function OpenGiftModal({ 
  open, 
  onOpenChange, 
  onSubmit
}: OpenGiftModalProps) {
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [giftName, setGiftName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setLastname('')
      setEmail('')
      setGiftName('')
      setShowSuccess(false)
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !lastname.trim() || !email.trim() || !giftName.trim()) return
    
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await onSubmit({ 
        name: name.trim(), 
        lastname: lastname.trim(), 
        email: email.trim(),
        giftName: giftName.trim() 
      })
      if (result.success) {
        setShowSuccess(true)
      } else {
        setError(result.error || 'Error al guardar')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setLastname('')
    setEmail('')
    setGiftName('')
    setShowSuccess(false)
    setError(null)
    onOpenChange(false)
  }

  if (!open) return null

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
          <div className="text-6xl mb-4">💕</div>
          <h2 className="text-2xl font-bold text-text mb-2">
            ¡Gracias por tu regalo!
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
          Mi Regalo Personalizado
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
            <label className="block text-sm font-medium text-text mb-2">Nombre</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan"
              required
              disabled={isSubmitting}
              className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-green/50"
            />
          </div>
          
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

          <div>
            <label className="block text-sm font-medium text-text mb-2">Regalo que deseas dar</label>
            <input 
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="Pañales, Ropa, Juguetes..."
              required
              disabled={isSubmitting}
              className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-green/50"
            />
          </div>

          {error && (
            <div className="bg-pastel-red/10 text-pastel-red text-sm text-center py-3 px-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-xs text-text/50 text-center">
            Nota: Este regalo no asegura que otro invitado no lo regale también
          </div>

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
                  Guardando...
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