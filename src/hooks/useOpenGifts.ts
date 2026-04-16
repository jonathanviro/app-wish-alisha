import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Contributor } from "@/types/gift";

const EVENT_DATE = "Sábado 2 de Mayo a las 15:00";
const EVENT_NAME = "Alisha";

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await supabase.functions.invoke("resend", {
      body: {
        to,
        subject,
        html,
        from_name: EVENT_NAME,
      },
    });
    if (error) {
      console.error("Error sending email:", error);
      return false;
    }
    console.log("Email sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
}

function buildOpenGiftEmailHtml(name: string, giftName: string): string {
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
      Gracias por regalar <strong>${giftName}</strong> a ${EVENT_NAME}.
    </p>
    <div style="background-color: #FFF7F5; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center;">
      <p style="color: #4CAF50; font-weight: 600; font-size: 16px; margin: 0;">
        ¡Tu regalo ha sido registrado!
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
  </div>
</body>
</html>
  `.trim();
}

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
        const { data: existingReservation, error: reservationError } = await supabase
          .from("contributors")
          .select(`
            gift_id,
            gifts (name)
          `)
          .ilike("email", contributor.email)
          .maybeSingle();

        if (reservationError) {
          console.error('Error checking reservation:', reservationError);
        }

        if (existingReservation) {
          const giftsData = existingReservation.gifts as unknown as { name: string }[] | null;
          const giftNameReserved = giftsData?.[0]?.name || 'la lista de deseos';
          return {
            success: false,
            error: `Este correo ya tiene una reserva en "${giftNameReserved}"`,
          };
        }

        const { data: existingOpenGift, error: openGiftError } = await supabase
          .from("open_gifts")
          .select("gift_name")
          .ilike("email", contributor.email)
          .maybeSingle();

        if (openGiftError) {
          console.error('Error checking open gift:', openGiftError);
        }

        if (existingOpenGift) {
          return {
            success: false,
            error: `Este correo ya tiene un regalo personalizado: "${existingOpenGift.gift_name}"`,
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

        const html = buildOpenGiftEmailHtml(contributor.name, giftName);
        sendEmail(
          contributor.email,
          `Confirmación de regalo personalizado - Para ${EVENT_NAME}`,
          html
        );

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
