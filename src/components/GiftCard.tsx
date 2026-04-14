import type { Gift } from '@/types/gift'
import { getInitials } from '@/types/gift'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Users, Sparkles } from 'lucide-react'

interface GiftCardProps {
  gift: Gift
  isComplete: boolean
  onReserve: () => void
  index: number
}

export function GiftCard({ gift, isComplete, onReserve, index }: GiftCardProps) {
  const maxContributors = gift.type === 'single' ? 1 : gift.maxContributors ?? 1
  const progress = Math.round((gift.contributors.length / maxContributors) * 100)
  const staggerClass = `stagger-${Math.min((index % 8) + 1, 8)}`

  return (
    <Card 
      className={`
        h-full flex flex-col
        ${isComplete ? 'opacity-90' : ''}
        animate-fade-in-up opacity-0 ${staggerClass}
        border border-gray-100 shadow-sm card-hover
      `}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden group flex-shrink-0">
        {gift.image ? (
          <>
            <img 
              src={gift.image} 
              alt={gift.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {isComplete && (
              <div className="absolute inset-0 gradient-overlay" />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pastel-green/20 to-pastel-green/10">
            <Package className="w-12 h-12 md:w-16 md:h-16 text-text/20" />
          </div>
        )}
        
        {gift.type === 'group' && !isComplete && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1 text-xs font-semibold shadow-sm">
            <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-pastel-green" />
            <span className="text-text">{gift.contributors.length}/{maxContributors}</span>
          </div>
        )}

        {isComplete && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 flex items-center gap-1 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500" />
            <span className="text-text">Completado</span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 p-4 md:p-5">
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-text text-base md:text-lg leading-tight">{gift.name}</h3>
          
          {gift.description && (
            <p className="text-xs md:text-sm text-text/50 leading-relaxed line-clamp-2 mt-1">
              {gift.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-auto pt-3">
          {gift.type === 'group' && !isComplete && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs md:text-sm text-text/60">
                <span>{gift.contributors.length} de {maxContributors} reservados</span>
                <span className="font-medium text-pastel-green">{progress}%</span>
              </div>
              <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-pastel-green to-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 md:gap-2 items-center min-h-[28px]">
            {isComplete ? (
              <>
                <span className="text-xs md:text-sm text-text/60">
                  {gift.type === 'group' 
                    ? `${gift.contributors.length} de ${maxContributors}`
                    : 'Reservado'}
                </span>
                <span className="text-green-600 font-medium">✓</span>
                <div className="flex flex-wrap gap-1.5 md:gap-2 ml-auto">
                  {gift.contributors.map((c, i) => (
                    <span 
                      key={i} 
                      className="text-xs font-medium bg-pastel-red/20 text-text/80 px-2.5 py-0.5 rounded-full shadow-sm"
                    >
                      {getInitials(c.name, c.lastname)}
                    </span>
                  ))}
                </div>
              </>
            ) : gift.contributors.length > 0 ? (
              gift.contributors.map((c, i) => (
                <span 
                  key={i} 
                  className="text-xs font-medium bg-pastel-red/20 text-text/80 px-2.5 py-0.5 rounded-full shadow-sm"
                >
                  {getInitials(c.name, c.lastname)}
                </span>
              ))
            ) : (
              <span className="text-xs text-text/40 italic">
                {gift.type === 'group' ? 'Sé el primero en aportar' : 'Pendiente de reservar'}
              </span>
            )}
          </div>

          <Button 
            className="w-full btn-transition font-medium shadow-sm text-sm md:text-base animate-heartbeat"
            onClick={onReserve}
          >
            <span className="flex items-center justify-center gap-1">
              <span>👉</span>
              {isComplete ? 'Completado' : gift.type === 'group' ? 'Aporta aquí' : 'Reserva aquí'}
              <span>👈</span>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
