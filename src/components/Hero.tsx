import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/CountdownTimer'

interface HeroProps {
  onOpenGiftClick?: () => void
}

export function Hero({ onOpenGiftClick }: HeroProps) {
  const targetDate = new Date('2026-05-02T15:00:00')

  const scrollToList = () => {
    const listSection = document.getElementById('gifts-list')
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-start px-3 pt-6 pb-6 md:pt-10 md:pb-10 overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        
        {/* Título */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-serif text-text tracking-wide italic">
            Bienvenida al mundo,
          </h1>
          <p className="text-4xl md:text-6xl font-serif text-text mt-1 tracking-wider">
            Alisha 💕
          </p>
        </div>

        {/* Foto cuadrada con countdown dentro */}
        <div className="mb-4 md:mb-6 relative rounded-xl overflow-hidden shadow-xl">
          <img 
            src="/baby-placeholder.jpg" 
            alt="Alisha" 
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 md:p-4">
            <p className="text-white text-xs md:text-sm font-medium mb-2">
              Baby Shower - 2 de Mayo 3:00 PM
            </p>
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>

        {/* Texto emocional más grande */}
        <div className="space-y-2 md:space-y-3 mb-6 px-2">
          <p className="text-lg md:text-xl text-text font-medium">
            Cada día falta menos para conocerte y llenar nuestras vidas de amor.
          </p>
          <p className="text-base md:text-lg text-text/70">
            Nos hace muy felices compartir este momento contigo.
          </p>
          <p className="text-base md:text-lg text-text/60">
            Si deseas regalarnos algo, hemos prepararado{' '}
            <span className="font-medium text-text/80">
              esta lista con mucho cariño
            </span>{' '}
            para que puedas reservarlo fácilmente.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={scrollToList}
            className="h-12 md:h-14 px-6 md:px-10 
                       text-sm md:text-base font-semibold 
                       shadow-lg hover:shadow-xl
                       btn-transition rounded-full
                       bg-pastel-green hover:bg-pastel-green/70 hover:-translate-y-0.5
                       transition-all duration-200
                       animate-heartbeat"
          >
            Ver lista de deseos 🎁
          </Button>
          
          {onOpenGiftClick && (
            <Button
              onClick={onOpenGiftClick}
              className="h-12 md:h-14 px-6 md:px-10 
                         text-sm md:text-base font-semibold 
                         shadow-lg hover:shadow-xl
                         btn-transition rounded-full
                         bg-pink-400 hover:bg-pink-400/70 hover:-translate-y-0.5
                         transition-all duration-200
                         animate-heartbeat"
            >
              Regalo Personalizado 🎁
            </Button>
          )}
        </div>

        {/* Agradecimiento */}
        <p className="mt-6 md:mt-8 text-sm md:text-base text-pastel-green font-medium">
          Gracias por acompañarnos 💕
        </p>

        {/* Indicador scroll */}
        <p className="mt-4 flex items-center justify-center gap-1 text-xs text-text/30">
          <span>✨</span>
          <span>Desliza</span>
          <span>✨</span>
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-[#FFF5F0] to-transparent pointer-events-none" />
    </section>
  )
}