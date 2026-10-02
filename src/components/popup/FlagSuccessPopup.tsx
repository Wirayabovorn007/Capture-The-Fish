import { X } from "lucide-react"

type FishRarity = "common" | "rare" | "legendary"

type FishReward = {
  fishId?: string
  name: string
  imageUrl: string
  amount: number
  rarity: FishRarity
}

type FlagSuccessPopupProps = {
  open: boolean
  fishReward?: FishReward
  onClose: () => void
  firstSolve?: boolean
  totalFish?: number
}

const rarityLabel: Record<FishRarity, string> = {
  common: "ทั่วไป",
  rare: "หายาก",
  legendary: "หายากระดับตำนาน",
}

const rarityClass: Record<FishRarity, string> = {
  common: "bg-slate-100 text-slate-700",
  rare: "bg-amber-100 text-amber-700",
  legendary: "bg-purple-100 text-purple-700",
}

export default function FlagSuccessPopup({
  open,
  fishReward,
  onClose,
  firstSolve = true,
  totalFish = 0,
}: FlagSuccessPopupProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flag-success-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h2
          id="flag-success-title"
          className="text-3xl font-bold text-[#2f2927]"
        >
          ยินดีด้วย!
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {firstSolve ? "คุณพิชิต Challenge สำเร็จและได้รับรางวัล" : "Flag ถูกต้อง แต่ Challenge นี้เคยผ่านแล้ว"}
        </p>

        {fishReward ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white p-3">
              <img
                src={fishReward.imageUrl}
                alt={fishReward.name}
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mt-4 text-xl font-bold text-[#3c3232]">
              {fishReward.name}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${rarityClass[fishReward.rarity]}`}
              >
                {rarityLabel[fishReward.rarity]}
              </span>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#B01414]">
                จำนวน ×{fishReward.amount}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-gray-600">
              คุณได้รับปลาเข้าคลังแล้ว!
            </p>
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">
            {firstSolve ? "Challenge นี้ไม่มีรางวัลปลา" : "คุณเคยรับรางวัลจาก Challenge นี้แล้ว จึงไม่ได้รับปลาซ้ำ"}
          </p>
        )}

        <p className="mt-4 text-sm font-semibold text-gray-600">
          ปลาทั้งหมดในคลัง: {totalFish} ตัว
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#B01414] px-6 py-3 font-semibold text-white transition hover:bg-[#8F1010] active:scale-[0.98]"
        >
          รับรางวัล
        </button>
      </div>
    </div>
  )
}
