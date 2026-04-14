import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Contributor } from "@/types/gift";

export type OpenGift = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  gift_name: string;
  created_at: string;
};

export function useOpenGifts() {
  const [openGifts, setOpenGifts] = useState<OpenGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenGifts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("open_gifts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setOpenGifts(data || []);
    } catch (err) {
      console.error("Error fetching open gifts:", err);
      setError("Error al cargar los regalos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpenGifts();
  }, [fetchOpenGifts]);

  const addOpenGift = useCallback(
    async (
      contributor: Contributor,
      giftName: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const { data: existingReservation } = await supabase
          .from("contributors")
          .select(
            `
          gift_id,
          gifts (name)
        `,
          )
          .ilike("email", contributor.email)
          .single();

        if (existingReservation) {
          return {
            success: false,
            error: `Este correo ya tiene una reserva en la lista de deseos`,
          };
        }

        const { error: insertError } = await supabase
          .from("open_gifts")
          .insert({
            name: contributor.name,
            lastname: contributor.lastname,
            email: contributor.email,
            gift_name: giftName,
          });

        if (insertError) {
          if (insertError.message.includes("email")) {
            return {
              success: false,
              error: "Este correo ya tiene un regalo personalizado registrado",
            };
          }
          throw insertError;
        }

        await fetchOpenGifts();
        return { success: true };
      } catch (err) {
        console.error("Error adding open gift:", err);
        return { success: false, error: "Error al guardar el regalo" };
      }
    },
    [fetchOpenGifts],
  );

  return {
    openGifts,
    loading,
    error,
    addOpenGift,
    refetch: fetchOpenGifts,
  };
}
