import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail } from 'lucide-react'

interface ReleaseByEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (email: string) => Promise<{ success: boolean; giftName?: string; error?: string }>
}

export function ReleaseByEmailModal({ 
  open, 
  onOpenChange, 
  onSubmit 
}: ReleaseByEmailModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; giftName?: string; error?: string } | null>(null)

  useEffect(() => {
    if (!open) {
      setEmail('')
      setResult(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setIsSubmitting(true)
    setResult(null)
    try {
      const submitResult = await onSubmit(email.trim().toLowerCase())
      setResult(submitResult)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-pastel-red/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-pastel-red" />
            </div>
            <DialogTitle className="text-xl">Liberar mi reserva</DialogTitle>
          </div>
          <DialogDescription>
            Ingresá el correo con el que hiciste tu reserva para liberarla.
          </DialogDescription>
        </DialogHeader>
        
        {!result && (
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label htmlFor="release-email" className="text-sm font-medium">Correo electrónico</Label>
              <Input 
                id="release-email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar mi reserva'
              )}
            </Button>
          </form>
        )}

        {result && !result.success && result.error && (
          <div className="space-y-4 mt-6">
            <div className="bg-pastel-red/10 border border-pastel-red/30 text-center py-4 px-4 rounded-xl animate-fade-in">
              <p className="text-text font-medium">{result.error}</p>
            </div>
            <Button variant="outline" className="w-full h-11" onClick={() => setResult(null)}>
              Intentar con otro correo
            </Button>
          </div>
        )}

        {result && result.success && result.giftName && (
          <div className="space-y-4 mt-6 animate-fade-in">
            <div className="bg-pastel-green/20 border border-pastel-green/30 text-center py-4 px-4 rounded-xl">
              <p className="font-semibold text-text text-lg">¡Reserva liberada!</p>
              <p className="text-sm text-text/70 mt-2">
                Tu reserva en <span className="font-medium">{result.giftName}</span> ha sido liberada.
              </p>
            </div>
            <Button className="w-full h-11" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
