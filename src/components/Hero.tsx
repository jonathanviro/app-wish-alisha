import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/CountdownTimer'

export function Hero() {
  const targetDate = new Date('2026-05-02T15:00:00')

  const scrollToList = () => {
    const listSection = document.getElementById('gifts-list')
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-start px-3 pt-8 pb-8 md:pt-12 md:pb-16 overflow-hidden">
      {/* Decoraciones sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-4 w-24 h-24 bg-pastel-green/10 rounded-full blur-3xl" />
        <div className="absolute top-32 right-4 w-20 h-20 bg-pink-100/25 rounded-full blur-3xl" />
        <div className="absolute bottom-24 left-8 w-16 h-16 bg-yellow-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-6 w-12 h-12 bg-pastel-red/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        
        {/* Título */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-5xl font-serif text-text tracking-wide italic">
            Bienvenida al mundo,
          </h1>
          <p className="text-4xl md:text-7xl font-serif text-text mt-1 tracking-wider">
            Alisha 💕
          </p>
        </div>

        {/* Foto principal circular */}
        <div className="mb-6 md:mb-10">
          <div className="w-36 h-36 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-pink-100 via-green-50 to-yellow-50">
            <img 
              src="/baby-placeholder.jpg" 
              alt="Alisha" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-6 md:mb-10">
          <p className="text-xs text-text/50 mb-2">
            Baby Shower - 2 de Mayo 3:00 PM
          </p>
          <CountdownTimer targetDate={targetDate} />
        </div>

        {/* Texto emocional */}
        <div className="space-y-2 text-xs md:text-sm text-text/70 leading-relaxed mb-6 md:mb-8 px-2 md:px-4">
          <p className="font-medium text-text/90">
            Cada día falta menos para conocerte y llenar nuestras vidas de amor.
          </p>
          <p className="text-[10px] md:text-xs text-text/50">
            Nos hace muy felices compartir este momento contigo.
          </p>
          <p className="text-[10px] md:text-xs text-text/60">
            Si deseas regalarnos algo, hemos preparado{' '}
            <span className="font-medium text-text/80">
              esta lista con mucho cariño
            </span>{' '}
            para que puedas reservarlo fácilmente.
          </p>
        </div>

        {/* Botón */}
        <Button
          onClick={scrollToList}
          className="mt-4 h-12 md:h-16 px-8 md:px-12 
                     text-sm md:text-base font-semibold 
                     shadow-lg hover:shadow-xl
                     btn-transition rounded-full
                     bg-pastel-green hover:bg-pastel-green/70 hover:-translate-y-0.5
                     transition-all duration-200
                     animate-heartbeat"
        >
          Ver lista de deseos 🎁
        </Button>

        {/* Agradecimiento */}
        <p className="mt-6 md:mt-10 text-xs md:text-sm text-pastel-green font-medium">
          Gracias por acompañarnos 💕
        </p>

        {/* Indicador scroll */}
        <p className="mt-4 md:mt-6 flex items-center justify-center gap-1 text-xs text-text/30">
          <span>✨</span>
          <span>Desliza</span>
          <span>✨</span>
        </p>
      </div>

      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-[#FFF5F0] to-transparent pointer-events-none" />
    </section>
  )
}
