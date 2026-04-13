import { useState } from 'react'
import { Hero } from './components/Hero'
import { GiftList } from './components/GiftList'
import { ReleaseByEmailModal } from './components/ReleaseByEmailModal'
import { Decorations } from './components/Decorations'
import { SkeletonGrid } from './components/SkeletonCard'
import { ToastContainer, useToast } from './components/Toast'
import { useGifts } from './hooks/useGifts'

function App() {
  const { gifts, loading, error, reserveGift, releaseByEmail, isGiftComplete, giftsByCategory } = useGifts()
  const [releaseModalOpen, setReleaseModalOpen] = useState(false)
  const toast = useToast()

  const handleReserve = async (giftId: string, contributor: Parameters<typeof reserveGift>[1]) => {
    const result = await reserveGift(giftId, contributor)
    if (result.success) {
      toast.success('¡Reserva exitosa! Gracias por tu regalo 🎁')
    } else if (result.error) {
      toast.error(result.error)
    }
    return result
  }

  const handleReleaseByEmail = async (email: string) => {
    const result = await releaseByEmail(email)
    if (result.success) {
      toast.success(`¡Reserva liberada de ${result.giftName}!`)
    } else if (result.error) {
      toast.error(result.error)
    }
    return result
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Decorations />
      
      <Hero />
      
      <main>
        {loading && <SkeletonGrid />}
        
        {error && (
          <div className="text-center py-16 md:py-20 px-4">
            <div className="bg-pastel-red/10 text-pastel-red py-3 px-5 md:py-4 md:px-6 rounded-xl inline-block">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <GiftList 
            gifts={gifts}
            onReserve={handleReserve}
            isGiftComplete={isGiftComplete}
            giftsByCategory={giftsByCategory}
            onReleaseClick={() => setReleaseModalOpen(true)}
          />
        )}
      </main>
      
      <ReleaseByEmailModal
        open={releaseModalOpen}
        onOpenChange={setReleaseModalOpen}
        onSubmit={handleReleaseByEmail}
      />
      
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  )
}

export default App
