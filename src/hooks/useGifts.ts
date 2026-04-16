import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Gift, Contributor, Category } from '@/types/gift'
import { rowToGift } from '@/types/gift'

const EVENT_DATE = 'Sábado 2 de Mayo a las 15:00'
const EVENT_NAME = 'Alisha'

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await supabase.functions.invoke('resend', {
      body: {
        to,
        subject,
        html,
        from_name: EVENT_NAME
      }
    })
    if (error) {
      console.error('Error sending email:', error)
      return false
    }
    console.log('Email sent successfully:', data)
    return true
  } catch (err) {
    console.error('Error sending email:', err)
    return false
  }
}

function buildReservationEmailHtml(
  name: string,
  giftName: string,
  isGroup: boolean,
  currentContributors: number,
  maxContributors: number
): string {
  const statusText = isGroup 
    ? `¡Ahora hay ${currentContributors} de ${maxContributors} personas que han reservado este regalo!`
    : '¡Ya está reservado para ti!'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF7F5; padding: 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">💕</span>
    </div>
    <h1 style="color: #333333; text-align: center; margin: 0 0 16px 0; font-size: 24px;">
      ¡Gracias por tu regalo!
    </h1>
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Hola <strong>${name}</strong>,<br><br>
      Gracias por reservar <strong>${giftName}</strong> para ${EVENT_NAME}.
    </p>
    <div style="background-color: #FFF7F5; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="color: #4CAF50; font-weight: 600; font-size: 16px; margin: 0;">
        ${statusText}
      </p>
    </div>
    <div style="border-top: 1px solid #EEEEEE; padding-top: 16px; margin-top: 16px;">
      <p style="color: #333333; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
        📅 Detalles del evento
      </p>
      <p style="color: #666666; font-size: 14px; margin: 0;">
        ${EVENT_DATE}
      </p>
    </div>
    <p style="color: #999999; font-size: 12px; text-align: center; margin: 24px 0 0 0;">
      Si necesitas liberar tu reserva, puedes hacerlo en cualquier momento en la página.
    </p>
  </div>
</body>
</html>
  `.trim()
}

function buildReleaseEmailHtml(name: string, giftName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF7F5; padding: 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">💔</span>
    </div>
    <h1 style="color: #333333; text-align: center; margin: 0 0 16px 0; font-size: 24px;">
      Reserva liberada
    </h1>
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Hola <strong>${name}</strong>,<br><br>
      Tu reserva de <strong>${giftName}</strong> para ${EVENT_NAME} ha sido liberada.
    </p>
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      El regalo ahora está disponible para otra persona. Si deseas reservar otro regalo, puedes hacerlo en cualquier momento.
    </p>
    <div style="border-top: 1px solid #EEEEEE; padding-top: 16px; margin-top: 16px;">
      <p style="color: #333333; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
        📅Detalles del evento
      </p>
      <p style="color: #666666; font-size: 14px; margin: 0;">
        ${EVENT_DATE}
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGifts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: giftsData, error: giftsError } = await supabase
        .from('gifts')
        .select('*')
        .order('created_at', { ascending: true })

      if (giftsError) throw giftsError

      const { data: contributorsData, error: contributorsError } = await supabase
        .from('contributors')
        .select('*')

      if (contributorsError) throw contributorsError

      const gifts = (giftsData || []).map(gift => {
        const contributors = (contributorsData || []).filter(c => c.gift_id === gift.id)
        return rowToGift(gift, contributors)
      })

      setGifts(gifts)
    } catch (err) {
      console.error('Error fetching gifts:', err)
      setError('Error al cargar los regalos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGifts()
  }, [fetchGifts])

  const checkEmailExistsInAnyGift = useCallback(async (email: string, excludeGiftId?: string): Promise<Gift | null> => {
    const { data, error } = await supabase
      .from('contributors')
      .select(`
        gift_id,
        gifts (
          id,
          name
        )
      `)
      .ilike('email', email)

    if (error) {
      console.error('Error checking email:', error)
      return null
    }

    if (data && data.length > 0) {
      const existing = data.find((c: { gift_id: string }) => c.gift_id !== excludeGiftId)
      if (existing) {
        const gift = gifts.find(g => g.id === existing.gift_id)
        if (gift) {
          return gift
        }
      }
    }
    return null
  }, [gifts])

  const reserveGift = useCallback(async (giftId: string, contributor: Contributor): Promise<{ success: boolean; error?: string }> => {
    try {
      const gift = gifts.find(g => g.id === giftId)
      if (!gift) return { success: false, error: 'Regalo no encontrado' }

      const isAlreadyReservedInThisGift = gift.contributors.some(
        c => c.email.toLowerCase() === contributor.email.toLowerCase()
      )
      if (isAlreadyReservedInThisGift) {
        return { success: false, error: 'Este email ya está registrado en este regalo' }
      }

      const existingGift = await checkEmailExistsInAnyGift(contributor.email, giftId)
      if (existingGift) {
        return { 
          success: false, 
          error: `Este correo ya tiene una reserva en "${existingGift.name}"` 
        }
      }

      const { data: existingOpenGift, error: openGiftError } = await supabase
        .from('open_gifts')
        .select('gift_name')
        .ilike('email', contributor.email)
        .maybeSingle()

      if (openGiftError) {
        console.error('Error checking open gifts:', openGiftError)
      }

      if (existingOpenGift) {
        return { 
          success: false, 
          error: `Este correo ya tiene un regalo personalizado: "${existingOpenGift.gift_name}"` 
        }
      }

      const maxContributors = gift.type === 'single' ? 1 : gift.maxContributors ?? 1
      if (gift.contributors.length >= maxContributors) {
        return { success: false, error: 'Este regalo ya está completo' }
      }

      const { error: insertError } = await supabase
        .from('contributors')
        .insert({
          gift_id: giftId,
          name: contributor.name,
          lastname: contributor.lastname,
          email: contributor.email
        })

      if (insertError) throw insertError

      await fetchGifts()

      const updatedGift = gifts.find(g => g.id === giftId)
      const currentCount = updatedGift?.contributors.length ?? 0
      const max = gift.type === 'single' ? 1 : gift.maxContributors ?? 1

      const html = buildReservationEmailHtml(
        contributor.name,
        gift.name,
        gift.type === 'group',
        currentCount + 1,
        max
      )
      sendEmail(
        contributor.email,
        `Confirmación de reserva - Regalo para ${EVENT_NAME}`,
        html
      )

      return { success: true }
    } catch (err) {
      console.error('Error reserving gift:', err)
      return { success: false, error: 'Error al reservar el regalo' }
    }
  }, [gifts, fetchGifts, checkEmailExistsInAnyGift])

  const releaseByEmail = useCallback(async (email: string): Promise<{ success: boolean; giftName?: string; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('contributors')
        .select(`
          id,
          name,
          gift_id,
          gifts (name)
        `)
        .ilike('email', email)

      if (error) throw error

      if (!data || data.length === 0) {
        return { success: false, error: 'Este correo no tiene ninguna reserva activa' }
      }

      const reservation = data[0]
      const contributorName = reservation.name
      const giftData = reservation.gifts as unknown as { name: string } | { name: string }[]
      let giftName = 'este regalo'
      
      if (giftData) {
        if (Array.isArray(giftData)) {
          giftName = giftData[0]?.name || 'este regalo'
        } else {
          giftName = giftData.name || 'este regalo'
        }
      }

      const { error: deleteError } = await supabase
        .from('contributors')
        .delete()
        .eq('id', reservation.id)

      if (deleteError) throw deleteError

      await fetchGifts()

      const html = buildReleaseEmailHtml(contributorName, giftName)
      sendEmail(
        email,
        `Reserva liberada - Regalo para ${EVENT_NAME}`,
        html
      )

      return { success: true, giftName }
    } catch (err) {
      console.error('Error releasing by email:', err)
      return { success: false, error: 'Error al liberar la reserva' }
    }
  }, [fetchGifts])

  const isGiftComplete = useCallback((gift: Gift) => {
    const max = gift.type === 'single' ? 1 : gift.maxContributors ?? 1
    return gift.contributors.length >= max
  }, [])

  const giftsByCategory = useCallback((category: Category) => {
    return gifts.filter(g => g.category === category)
  }, [gifts])

  return {
    gifts,
    loading,
    error,
    reserveGift,
    releaseByEmail,
    isGiftComplete,
    giftsByCategory,
    refetch: fetchGifts
  }
}
