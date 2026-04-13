import { Heart, Star, Cloud } from 'lucide-react'

export function Decorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <Cloud className="absolute w-24 h-24 text-pastel-green/20 animate-float-slow" style={{ top: '10%', left: '5%' }} />
      <Cloud className="absolute w-16 h-16 text-pastel-green/15 animate-float-slow" style={{ top: '20%', right: '10%', animationDelay: '1s' }} />
      <Cloud className="absolute w-20 h-20 text-pastel-red/15 animate-float-slow" style={{ bottom: '15%', left: '8%', animationDelay: '2s' }} />
      
      <Star className="absolute w-4 h-4 text-yellow-300/40 animate-float" style={{ top: '15%', left: '20%', animationDelay: '0.5s' }} />
      <Star className="absolute w-3 h-3 text-yellow-300/30 animate-float" style={{ top: '25%', right: '25%', animationDelay: '1.5s' }} />
      <Star className="absolute w-5 h-5 text-yellow-300/25 animate-float" style={{ top: '60%', left: '3%', animationDelay: '0.8s' }} />
      <Star className="absolute w-3 h-3 text-yellow-300/35 animate-float" style={{ top: '75%', right: '15%', animationDelay: '2s' }} />
      <Star className="absolute w-4 h-4 text-yellow-300/30 animate-float" style={{ top: '85%', left: '25%', animationDelay: '1s' }} />
      
      <Heart className="absolute w-5 h-5 text-pastel-red/20 animate-float" style={{ top: '8%', right: '5%', animationDelay: '0.3s' }} />
      <Heart className="absolute w-4 h-4 text-pastel-red/15 animate-float" style={{ top: '40%', left: '2%', animationDelay: '1.2s' }} />
      <Heart className="absolute w-6 h-6 text-pastel-red/10 animate-float" style={{ bottom: '30%', right: '3%', animationDelay: '0.7s' }} />
      <Heart className="absolute w-3 h-3 text-pastel-red/25 animate-float" style={{ top: '50%', right: '20%', animationDelay: '1.8s' }} />
    </div>
  )
}
