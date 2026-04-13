import { useState, useEffect } from 'react'
import type { Contributor } from '@/types/gift'
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
import { Loader2, Gift } from 'lucide-react'

interface ReserveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  giftName: string
  onReserve: (contributor: Contributor) => Promise<{ success: boolean; error?: string }>
  isGroup: boolean
  error?: string | null
  onSuccess?: () => void
}

export function ReserveModal({ 
  open, 
  onOpenChange, 
  giftName, 
  onReserve,
  isGroup,
  error,
  onSuccess
}: ReserveModalProps) {
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setLastname('')
      setEmail('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !lastname.trim() || !email.trim()) return
    
    setIsSubmitting(true)
    try {
      const result = await onReserve({ name: name.trim(), lastname: lastname.trim(), email: email.trim() })
      if (result.success) {
        onSuccess?.()
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName('')
    setLastname('')
    setEmail('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-pastel-green/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-pastel-green" />
            </div>
            <DialogTitle className="text-xl">
              {isGroup ? 'Aportar' : 'Reservar'} {giftName}
            </DialogTitle>
          </div>
          <DialogDescription>
            Ingresá tus datos para {isGroup ? 'aportar' : 'reservar'} este regalo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reserve-name" className="text-sm font-medium">Nombre</Label>
              <Input 
                id="reserve-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan"
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reserve-lastname" className="text-sm font-medium">Apellido</Label>
              <Input 
                id="reserve-lastname" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Pérez"
                required
                disabled={isSubmitting}
                className="h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reserve-email" className="text-sm font-medium">Correo electrónico</Label>
            <Input 
              id="reserve-email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {error && (
            <div className="bg-pastel-red/10 border border-pastel-red/30 text-text text-sm text-center py-3 px-4 rounded-xl animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-11" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-11" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
