import type { Fish } from "../../types/challenge";

export type FishRarity = "common" | "rare" | "ultimate";

type Props = {
  mode: "new" | "existing";
  onModeChange: (mode: "new" | "existing") => void;
  fishes: Fish[];
  selectedFishId: string;
  onSelectedFishIdChange: (fishId: string) => void;
  fishName: string;
  onFishNameChange: (value: string) => void;
  fishImageUrl: string;
  fishAmount: number | "";
  onFishAmountChange: (value: number | "") => void;
  fishRarity: FishRarity;
  onFishRarityChange: (value: FishRarity) => void;
  fishDescription: string;
  onFishDescriptionChange: (value: string) => void;
  fishXp: number | "";
  onFishXpChange: (value: number | "") => void;
  uploadingFish: boolean;
  onFishImageUpload: (file: File) => void | Promise<void>;
};

export default function FishRewardSelector({
  mode,
  onModeChange,
  fishes,
  selectedFishId,
  onSelectedFishIdChange,
  fishName,
  onFishNameChange,
  fishImageUrl,
  fishAmount,
  onFishAmountChange,
  fishRarity,
  onFishRarityChange,
  fishDescription,
  onFishDescriptionChange,
  fishXp,
  onFishXpChange,
  uploadingFish,
  onFishImageUpload,
}: Props) {
  return (
    <>
      <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-[#d8d2cf] bg-white p-1">
        <button
          type="button"
          onClick={() => {
            onModeChange("new");
            onSelectedFishIdChange("");
          }}
          className={`h-11 rounded-lg text-sm font-semibold transition-all ${mode === "new" ? "bg-[#b01414] text-white shadow-sm" : "text-[#77716e] hover:bg-[#f5f2f1]"}`}
        >
          + สร้างปลาใหม่
        </button>
        <button
          type="button"
          onClick={() => onModeChange("existing")}
          className={`h-11 rounded-lg text-sm font-semibold transition-all ${mode === "existing" ? "bg-[#b01414] text-white shadow-sm" : "text-[#77716e] hover:bg-[#f5f2f1]"}`}
        >
          ใช้ปลาที่มีอยู่
        </button>
      </div>

      {mode === "new" ? (
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                ชื่อปลา
              </label>
              <input
                type="text"
                value={fishName}
                onChange={(e) => onFishNameChange(e.target.value)}
                placeholder="เช่น Golden Fish"
                className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                จำนวนปลา
              </label>
              <input
                type="number"
                min="1"
                value={fishAmount}
                onChange={(e) =>
                  onFishAmountChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                ความแรร์
              </label>
              <select
                value={fishRarity}
                onChange={(e) =>
                  onFishRarityChange(e.target.value as FishRarity)
                }
                className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
              >
                <option value="common">COMMON</option>
                <option value="rare">RARE</option>
                <option value="ultimate">ULTIMATE</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                XP ของปลา
              </label>
              <input
                type="number"
                min="1"
                value={fishXp}
                onChange={(e) =>
                  onFishXpChange(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="เช่น 100"
                className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
              />
              <p className="mt-2 text-xs text-[#999390]">
                ผู้เล่นจะได้รับ XP นี้เมื่อค้นพบปลาชนิดนี้ครั้งแรก
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                คำอธิบายปลา
              </label>
              <textarea
                value={fishDescription}
                onChange={(e) => onFishDescriptionChange(e.target.value)}
                rows={3}
                placeholder="อธิบายลักษณะหรือเรื่องราวของปลา"
                className="w-full resize-y rounded-xl border border-[#d8d2cf] bg-white px-4 py-3 text-sm outline-none focus:border-[#b01414]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                รูปปลา
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingFish}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onFishImageUpload(file);
                }}
                className="block w-full rounded-xl border border-[#d8d2cf] bg-white px-3 py-2.5 text-sm"
              />
              <p className="mt-2 text-xs text-[#999390]">
                {uploadingFish
                  ? "กำลังอัปโหลดรูป..."
                  : "รูปจะถูกอัปโหลดไปยัง S3"}
              </p>
            </div>
          </div>
          {fishImageUrl && (
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-[#e7e3e1] bg-white p-4">
              <img
                src={fishImageUrl}
                alt={fishName || "Fish preview"}
                className="h-24 w-24 rounded-xl object-contain"
              />
              <div>
                <p className="font-bold text-[#403a38]">
                  {fishName || "ยังไม่ได้ตั้งชื่อปลา"}
                </p>
                <p className="mt-1 text-sm text-[#77716e]">
                  จำนวน ×{fishAmount}
                </p>
                <p className="mt-1 text-sm text-[#77716e]">
                  {fishRarity === "ultimate"
                    ? "ULTIMATE"
                    : fishRarity === "rare"
                      ? "RARE"
                      : "COMMON"}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {fishes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d8d2cf] bg-white p-6 text-center text-sm text-[#77716e]">
              ยังไม่มีปลาในระบบ กรุณาเลือก “สร้างปลาใหม่” ก่อน
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {fishes.map((fish) => {
                const selected = selectedFishId === fish.fishId;
                return (
                  <button
                    key={fish.fishId}
                    type="button"
                    onClick={() => onSelectedFishIdChange(fish.fishId)}
                    className={`group relative flex items-center gap-3 overflow-hidden border bg-white p-3 text-left transition-all hover:-translate-y-0.5 ${fish.rarity === "ultimate" ? "border-[#B01414]/40" : "border-black/10"} ${selected ? "ring-2 ring-[#B01414] ring-offset-2" : ""}`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#b01414] text-[11px] font-bold text-white shadow-sm">
                        ✓
                      </span>
                    )}
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border ${fish.rarity === "ultimate" ? "border-red-300 bg-red-50" : fish.rarity === "rare" ? "border-blue-300 bg-blue-50" : "border-gray-300 bg-gray-100"}`}
                    >
                      <img
                        src={fish.imageUrl}
                        alt={fish.name}
                        className="h-14 w-14 object-contain"
                      />
                    </div>
                    <div className="min-w-0 pr-5">
                      <p className="truncate text-sm font-bold text-[#403a38]">
                        {fish.name}
                      </p>
                      <span
                        className={`mt-1.5 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${fish.rarity === "ultimate" ? "border-red-300 bg-red-50 text-[#B01414]" : fish.rarity === "rare" ? "border-blue-300 bg-blue-50 text-[#2563EB]" : "border-gray-300 bg-gray-100 text-[#6B7280]"}`}
                      >
                        {fish.rarity === "ultimate"
                          ? "ULTIMATE"
                          : fish.rarity === "rare"
                            ? "RARE"
                            : "COMMON"}
                      </span>
                      <p className="mt-1 text-xs font-semibold text-[#77716e]">
                        {fish.xp ?? 0} XP
                      </p>
                      {selected && (
                        <p className="mt-1.5 text-xs font-semibold text-[#b01414]">
                          เลือกแล้ว
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-5 max-w-xs">
            <label className="mb-2 block text-sm font-semibold text-[#403a38]">
              จำนวนปลา
            </label>
            <input
              type="number"
              min="1"
              value={fishAmount}
              onChange={(e) =>
                onFishAmountChange(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
            />
          </div>
        </div>
      )}
    </>
  );
}
