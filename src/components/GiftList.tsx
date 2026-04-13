import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import type { Gift, Contributor } from "@/types/gift";
import { categoryConfig } from "@/types/gift";
import { GiftCard } from "@/components/GiftCard";
import { ReserveModal } from "@/components/ReserveModal";

interface GiftListProps {
  gifts: Gift[];
  onReserve: (
    giftId: string,
    contributor: Contributor,
  ) => Promise<{ success: boolean; error?: string }>;
  isGiftComplete: (gift: Gift) => boolean;
  giftsByCategory: (category: "essential" | "optional" | "detail") => Gift[];
  onReleaseClick: () => void;
}

export function GiftList({
  gifts,
  onReserve,
  isGiftComplete,
  giftsByCategory,
  onReleaseClick,
}: GiftListProps) {
  const [reserveModal, setReserveModal] = useState<{
    open: boolean;
    giftId: string;
  }>({ open: false, giftId: "" });
  const [reserveError, setReserveError] = useState<string | null>(null);

  const categories: Array<"essential" | "optional" | "detail"> = [
    "essential",
    "optional",
    "detail",
  ];
  let globalIndex = 0;

  const selectedReserveGift = gifts.find((g) => g.id === reserveModal.giftId);

  const handleReserve = async (
    contributor: Contributor,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!reserveModal.giftId)
      return { success: false, error: "No se seleccionó regalo" };

    const result = await onReserve(reserveModal.giftId, contributor);
    if (result.success) {
      setReserveModal({ open: false, giftId: "" });
      setReserveError(null);
    } else {
      setReserveError(result.error || "Error al reservar");
    }
    return result;
  };

  return (
    <div id="gifts-list" className="pb-[env(safe-area-inset-bottom)]">
      {categories.map((category) => {
        const categoryGifts = giftsByCategory(category);
        if (categoryGifts.length === 0) return null;

        const config = categoryConfig[category];

        return (
          <section
            key={category}
            id={`category-${category}`}
            className="py-8 md:py-12 scroll-mt-16 md:scroll-mt-20"
          >
            <div className="sticky top-0 z-20 bg-[#FFF5F0] py-3 md:py-4 px-4 md:px-6 shadow-sm">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <span className="text-xl md:text-2xl">{config.icon}</span>
                    <h2
                      className={`text-lg md:text-2xl font-bold ${config.color}`}
                    >
                      {config.label}
                    </h2>
                  </div>
                  <p className="text-xs md:text-sm text-text/50 ml-7 md:ml-9">
                    {config.description}
                  </p>
                  <div
                    className={`h-0.5 md:h-1 w-16 md:w-20 ${config.bgColor} rounded-full mt-2 md:mt-3 ml-7 md:ml-9`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReleaseClick}
                  className="text-text/40 hover:text-text/70 hover:bg-gray-100 border border-transparent btn-transition shrink-0"
                >
                  <Frown className="w-4 h-4 mr-1" />
                  <span className="text-xs">Liberar reserva</span>
                </Button>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 items-stretch">
                {categoryGifts.map((gift) => {
                  const currentIndex = globalIndex++;
                  return (
                    <GiftCard
                      key={gift.id}
                      gift={gift}
                      isComplete={isGiftComplete(gift)}
                      index={currentIndex}
                      onReserve={() => {
                        setReserveError(null);
                        setReserveModal({ open: true, giftId: gift.id });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {selectedReserveGift && (
        <ReserveModal
          open={reserveModal.open}
          onOpenChange={(open) => {
            if (!open) setReserveError(null);
            setReserveModal((prev) => ({ ...prev, open }));
          }}
          giftName={selectedReserveGift.name}
          isGroup={selectedReserveGift.type === "group"}
          onReserve={handleReserve}
          error={reserveError}
          onSuccess={() => {
            setReserveModal({ open: false, giftId: "" });
            setReserveError(null);
          }}
        />
      )}
    </div>
  );
}
