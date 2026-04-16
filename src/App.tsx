import { useState } from 'react'
import type { Contributor } from './types/gift'
import { OpenGiftModal } from './components/OpenGiftModal'
import { Hero } from './components/Hero'
import { GiftList } from './components/GiftList'
import { ScrollIndicator } from './components/ScrollIndicator'
import { ReleaseByEmailModal } from './components/ReleaseByEmailModal'
import { Decorations } from './components/Decorations'
import { SkeletonGrid } from './components/SkeletonCard'
import { ToastContainer, useToast } from './components/Toast'
import { useGifts } from './hooks/useGifts'
import { useOpenGifts } from './hooks/useOpenGifts'

const SUPABASE_URL = 'https://whfjzeqayikvupmjnuya.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZmp6ZXFheWlrdnVwbWpudXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTQ2ODcsImV4cCI6MjA5MTU5MDY4N30.0IIzl3oJGOd_0-wdJk7ZcfgQc_dJKNK-XNiMY0sshAU'

async function sendConfirmationEmail(email: string, name: string, giftName: string) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 20px; border-radius: 20px;">
          <h1 style="color: #333; margin: 0;">¡Hola ${name}! 💕</h1>
        </div>
        <div style="padding: 30px 20px;">
          <p style="font-size: 18px; color: #555; line-height: 1.6;">
            Gracias por reservar el regalo <strong>"${giftName}"</strong> para Alisha.
          </p>
          <p style="font-size: 16px; color: #777;">
            Nos hacen mucha ilusióntus regalos y los esperamos el día del evento.
          </p>
          <div style="background: #fff5f0; padding: 20px; border-radius: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              📅 <strong>Baby Shower - 2 de Mayo</strong><br>
              🕒 <strong>3:00 PM</strong>
            </p>
          </div>
          <p style="color: #999; font-size: 14px;">
            Con cariño, la familia de Alisha 💕
          </p>
        </div>
      </div>
    `
    
    await fetch(`${SUPABASE_URL}/functions/v1/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        subject: '¡Gracias por tu regalo para Alisha! 💕',
        from_name: 'Alisha',
        html,
      }),
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

function App() {
  const { gifts, loading, error, reserveGift, releaseByEmail, isGiftComplete, giftsByCategory } = useGifts()
  const { openGifts, addOpenGift, refetch: refetchOpenGifts } = useOpenGifts()
  const [releaseModalOpen, setReleaseModalOpen] = useState(false)
  const [openGiftModalOpen, setOpenGiftModalOpen] = useState(false)
  const toast = useToast()

  const handleReserve = async (giftId: string, contributor: Parameters<typeof reserveGift>[1]) => {
    const result = await reserveGift(giftId, contributor)
    if (result.success) {
      toast.success('¡Reserva exitosa! Gracias por tu regalo 🎁')
      refetchOpenGifts()
      
      const gift = gifts.find(g => g.id === giftId)
      await sendConfirmationEmail(contributor.email, contributor.name, gift?.name || 'regalo')
    } else if (result.error) {
      toast.error(result.error)
    }
    return result
  }

  const handleOpenGiftAdd = async (data: Contributor & { giftName: string }) => {
    const { name, lastname, email, giftName } = data
    const result = await addOpenGift({ name, lastname, email }, giftName)
    if (result.success) {
      toast.success('¡Gracias por tu regalo personalizado! 🎁')
      await sendConfirmationEmail(email, name, giftName)
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
    <div className="min-h-screen bg-background relative pb-4">
      <Decorations />
      
      <Hero onOpenGiftClick={() => setOpenGiftModalOpen(true)} />
      
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
            openGifts={openGifts}
            onOpenGiftAdd={handleOpenGiftAdd}
          />
        )}
        
        <ScrollIndicator />
      </main>
      
      <ReleaseByEmailModal
        open={releaseModalOpen}
        onOpenChange={setReleaseModalOpen}
        onSubmit={handleReleaseByEmail}
      />
      
      <OpenGiftModal
        open={openGiftModalOpen}
        onOpenChange={(open) => {
          if (!open) setOpenGiftModalOpen(false)
        }}
        onSubmit={async (data) => {
          const { name, lastname, email, giftName } = data
          const result = await addOpenGift({ name, lastname, email }, giftName)
          if (result.success) {
            toast.success('¡Gracias por tu regalo personalizado! 🎁')
            setOpenGiftModalOpen(false)
          } else if (result.error) {
            toast.error(result.error)
          }
          return result
        }}
      />
      
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      
      <footer className="pb-20 pt-4 text-center text-xs text-text/40">
        Desarrollado con ❤️ por Mami y Papi © 2026
      </footer>
    </div>
  )
}

export default App
