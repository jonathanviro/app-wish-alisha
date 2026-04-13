import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Gift, Contributor, Category } from '@/types/gift'
import { rowToGift } from '@/types/gift'

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
          gift_id,
          gifts (name)
        `)
        .ilike('email', email)

      if (error) throw error

      if (!data || data.length === 0) {
        return { success: false, error: 'Este correo no tiene ninguna reserva activa' }
      }

      const reservation = data[0]
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
