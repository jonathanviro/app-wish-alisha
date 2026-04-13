import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

interface HeaderProps {
  onReleaseClick: () => void
}

export function Header({ onReleaseClick }: HeaderProps) {
  return (
    <header className="text-center py-10 md:py-14 relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">
        Deseos de Alisha 💕
      </h1>
      <p className="text-text/60 max-w-md mx-auto px-4 text-base md:text-lg leading-relaxed">
        Estamos felices por su llegada. Si deseas regalarnos algo, puedes reservarlo aquí de forma sencilla.
      </p>
      <Button 
        variant="outline"
        size="sm"
        onClick={onReleaseClick}
        className="absolute top-4 right-4 md:top-6 md:right-6 text-text/70 hover:text-text border-pastel-red/30 hover:border-pastel-red/50 hover:bg-pastel-red/10 btn-transition"
      >
        <Mail className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Liberar mi reserva</span>
        <span className="sm:hidden">Liberar</span>
      </Button>
    </header>
  )
}
