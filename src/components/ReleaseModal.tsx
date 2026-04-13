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
import { Loader2 } from 'lucide-react'

interface ReleaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  giftName: string
  onSubmit: (contributor: Contributor) => Promise<void>
  error?: string | null
}

export function ReleaseModal({ 
  open, 
  onOpenChange, 
  giftName, 
  onSubmit,
  error 
}: ReleaseModalProps) {
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
      await onSubmit({ name: name.trim(), lastname: lastname.trim(), email: email.trim() })
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Liberar {giftName}</DialogTitle>
          <DialogDescription>
            Ingresá los datos que usaste para hacer tu reserva.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="release-name">Nombre</Label>
              <Input 
                id="release-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release-lastname">Apellido</Label>
              <Input 
                id="release-lastname" 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Pérez"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="release-email">Correo electrónico</Label>
            <Input 
              id="release-email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-sm text-pastel-red text-center bg-pastel-red/10 py-2 px-3 rounded-md">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              className="flex-1" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Liberando...
                </>
              ) : (
                'Liberar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
