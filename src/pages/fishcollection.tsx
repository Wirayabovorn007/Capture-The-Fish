import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/effects/Reveal";

import { useEffect, useMemo, useState } from "react";
import { getAuthHeaders } from "../utils/auth";

const RED = "#B01414";

type FishRarity = "common" | "rare" | "ultimate";
type Fish = {
  id: string;
  name: string;
  rarity: FishRarity;
  quantity: number;
  image: string;
  description: string;
  points: number;
};

type CatalogFish = {
  fishId: string;
  name: string;
  imageUrl: string;
  rarity: FishRarity;
  description?: string;
  xp?: number;
};

type InventoryFish = {
  fishId: string;
  amount: number;
};

async function getApiUrl() {
  const response = await fetch("/config.json");
  if (!response.ok) throw new Error("โหลด config.json ไม่สำเร็จ");
  const config = await response.json();
  if (!config.ALB_URL) throw new Error("ไม่พบ ALB_URL ใน config.json");
  return config.ALB_URL as string;
}

const rarityConfig = {
  common: {
    label: "COMMON",
    color: "#6B7280",
    bg: "bg-gray-100",
    border: "border-gray-300",
    icon: "○",
  },

  rare: {
    label: "RARE",
    color: "#2563EB",
    bg: "bg-blue-50",
    border: "border-blue-300",
    icon: "◆",
  },

  ultimate: {
    label: "ULTIMATE",
    color: RED,
    bg: "bg-red-50",
    border: "border-red-300",
    icon: "★",
  },
};

/*
|--------------------------------------------------------------------------
| Fish Image
|--------------------------------------------------------------------------
*/

function FishImage({ fish }: { fish: Fish }) {
  const config = rarityConfig[fish.rarity];
  const discovered = fish.quantity > 0;

  return (
    <div
      className="relative flex h-44 items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(
          circle at center,
          ${config.color}12,
          transparent 70%
        )`,
      }}
    >
      <img
        src={fish.image}
        alt={discovered ? fish.name : "Unknown fish"}
        className={`h-36 w-44 object-contain transition-all duration-300 ${
          discovered
            ? "opacity-100 group-hover:scale-110"
            : "opacity-15 grayscale blur-[1px]"
        }`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      {!discovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border border-black/10 bg-white/90 px-4 py-2  text-xs tracking-widest">
            LOCKED
          </div>
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Rarity Badge
|--------------------------------------------------------------------------
*/

function RarityBadge({ rarity }: { rarity: FishRarity }) {
  const config = rarityConfig[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-1  text-[10px] font-bold tracking-wider ${config.bg} ${config.border}`}
      style={{ color: config.color }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| Fish Card
|--------------------------------------------------------------------------
*/

function FishCard({ fish }: { fish: Fish }) {
  const config = rarityConfig[fish.rarity];
  const discovered = fish.quantity > 0;

  return (
    <article
      className={`group relative overflow-hidden border bg-white transition-all duration-200 hover:-translate-y-1  ${
        fish.rarity === "ultimate" ? "border-[#B01414]/40" : "border-black/10"
      }`}
    >
      {/* rarity accent */}
      <div className="h-1" style={{ backgroundColor: config.color }} />

      {/* Fish image */}
      <FishImage fish={fish} />

      <div className="border-t border-black/10 p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3
              className={`  font-bold ${
                discovered ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {discovered ? fish.name : "??????"}
            </h3>
          </div>

          <RarityBadge rarity={fish.rarity} />
        </div>

        <p className="min-h-[48px]  leading-6 text-gray-500">
          {fish.description}
        </p>

        {/* Quantity */}
        <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
          <div>
            <div className=" text-[10px] uppercase tracking-wider text-gray-400">
              ค้นพบแล้ว
            </div>

            <div
              className="mt-1   font-bold"
              style={{
                color: discovered ? config.color : "#9CA3AF",
              }}
            >
              {fish.quantity}

              <span className="ml-1 text-xs font-normal text-gray-400">
                ตัว
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className=" text-[10px] uppercase tracking-wider text-gray-400">
              XP
            </div>

            <div
              className="mt-1  text-xs font-bold"
              style={{ color: config.color }}
            >
              +{fish.points}
            </div>
          </div>
        </div>
      </div>

      {/* hover accent */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: config.color }}
      />
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| Collection Page
|--------------------------------------------------------------------------
*/

export default function FishCollection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const baseUrl = await getApiUrl();
        const headers = await getAuthHeaders(false);
        const [catalogResponse, inventoryResponse] = await Promise.all([
          fetch(`${baseUrl}/?action=list_fishes&t=${Date.now()}`, { headers }),
          fetch(`${baseUrl}/?action=get_my_inventory&t=${Date.now()}`, {
            headers,
          }),
        ]);
        const catalogData = await catalogResponse.json();
        const inventoryData = await inventoryResponse.json();
        if (!catalogResponse.ok)
          throw new Error(catalogData.error || "โหลดรายการปลาไม่สำเร็จ");
        if (!inventoryResponse.ok)
          throw new Error(inventoryData.error || "โหลดคลังปลาไม่สำเร็จ");
        const inventory = new Map<string, number>(
          (inventoryData.inventory ?? []).map((item: InventoryFish) => [
            item.fishId,
            Number(item.amount ?? 0),
          ]),
        );
        const realFishes: Fish[] = (catalogData.fishes ?? []).map(
          (fish: CatalogFish) => ({
            id: fish.fishId,
            name: fish.name,
            rarity: fish.rarity,
            quantity: inventory.get(fish.fishId) ?? 0,
            image: fish.imageUrl,
            description: fish.description || "ยังไม่มีคำอธิบายปลา",
            points: Number(fish.xp ?? 0),
          }),
        );
        setFishes(realFishes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "โหลด Fish Collection ไม่สำเร็จ",
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  // จำนวนประเภทปลาที่ค้นพบแล้ว
  const discoveredTypes = fishes.filter((fish) => fish.quantity > 0).length;

  // จำนวนปลาทั้งหมดที่ผู้เล่นมี
  const totalFishCollected = fishes.reduce(
    (total, fish) => total + fish.quantity,
    0,
  );

  const totalSystemXp = fishes.reduce((total, fish) => total + fish.points, 0);
  const collectedXp = fishes.reduce(
    (total, fish) => total + (fish.quantity > 0 ? fish.points : 0),
    0,
  );
  const collectionPercent =
    totalSystemXp > 0
      ? Math.min(100, Math.round((collectedXp / totalSystemXp) * 100))
      : 0;

  const filteredFish = useMemo(() => {
    return fishes.filter((fish) => {
      const matchesRarity =
        activeFilter === "all" || fish.rarity === activeFilter;

      const matchesSearch = fish.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesRarity && matchesSearch;
    });
  }, [fishes, activeFilter, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Reveal>
        <section className="min-h-screen text-gray-900">
          {/* ================= HERO ================= */}

          <section className="relative overflow-hidden bg-transparent text-black">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
              {/* Hero content */}
              <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
                <div className="max-w-4xl">
                  {/* Main title */}
                  <h1 className="text-[clamp(3.5rem,9vw,7rem)] font-black leading-[0.88] tracking-[-0.06em] text-[#B01414]">
                    Fish
                    <br />
                    Collection
                  </h1>

                  {/* Description */}
                  <div className="mt-8 flex max-w-2xl gap-5">
                    <div className="mt-1 h-14 w-[2px] shrink-0 bg-[#B01414]" />

                    <p className="text-sm leading-7 text-gray-500 md:text-base">
                      รวมสิ่งมีชีวิตทั้งหมดที่ถูกค้นพบระหว่างการทำภารกิจ
                      <span className="font-semibold text-gray-800">
                        {" "}
                        Capture the Fish
                      </span>
                      <br />
                      สะสมปลาให้ครบเพื่อปลดล็อกคอลเลกชันระดับตำนาน
                    </p>
                  </div>
                </div>

                {/* Collection indicator */}
                <div className="hidden shrink-0 pb-2 lg:block">
                  <div className=" text-[10px] tracking-[0.2em] text-gray-400">
                    COLLECTION STATUS
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 w-24 bg-gray-200">
                      <div
                        className="h-full bg-[#B01414] transition-all duration-500"
                        style={{
                          width: `${collectionPercent}%`,
                        }}
                      />
                    </div>

                    <span className=" text-xs font-bold text-[#B01414]">
                      {collectionPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-16 border-y border-black/10">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  {/* Types discovered */}
                  <div className="group border-b border-black/10 p-6 sm:border-b-0 sm:border-r sm:p-7">
                    <div className="flex items-start justify-between">
                      <span className=" text-[10px] font-bold tracking-[0.2em] text-gray-400">
                        01 / DISCOVERY
                      </span>

                      <span className=" text-xs text-gray-300 transition-colors group-hover:text-[#B01414]">
                        ↗
                      </span>
                    </div>

                    <div className="mt-5 flex items-end gap-3">
                      <span className="text-4xl font-black tracking-tight md:text-5xl">
                        {discoveredTypes}
                      </span>

                      <span className="mb-1  text-[10px] tracking-wider text-gray-400">
                        TYPES
                      </span>
                    </div>

                    <div className="mt-2  text-[10px] tracking-[0.15em] text-gray-400">
                      TYPES DISCOVERED
                    </div>
                  </div>

                  {/* Total fish */}
                  <div className="group border-b border-black/10 p-6 sm:border-b-0 sm:border-r sm:p-7">
                    <div className="flex items-start justify-between">
                      <span className=" text-[10px] font-bold tracking-[0.2em] text-gray-400">
                        02 / COLLECTION
                      </span>

                      <span className=" text-xs text-gray-300 transition-colors group-hover:text-[#B01414]">
                        ↗
                      </span>
                    </div>

                    <div className="mt-5 flex items-end gap-3">
                      <span className="text-4xl font-black tracking-tight md:text-5xl">
                        {totalFishCollected}
                      </span>

                      <span className="mb-1  text-[10px] tracking-wider text-gray-400">
                        FISH
                      </span>
                    </div>

                    <div className="mt-2  text-[10px] tracking-[0.15em] text-gray-400">
                      FISH COLLECTED
                    </div>
                  </div>

                  {/* Completion */}
                  <div className="group p-6 sm:p-7">
                    <div className="flex items-start justify-between">
                      <span className=" text-[10px] font-bold tracking-[0.2em] text-gray-400">
                        03 / PROGRESS
                      </span>

                      <span className=" text-xs text-[#B01414]">%</span>
                    </div>

                    <div className="mt-5 flex items-end gap-1">
                      <span className="text-4xl font-black tracking-tight text-[#B01414] md:text-5xl">
                        {collectionPercent}
                      </span>

                      <span className="mb-1 text-2xl font-bold text-[#B01414]">
                        %
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="h-1 w-full bg-gray-200">
                        <div
                          className="h-full bg-[#B01414] transition-all duration-500"
                          style={{
                            width: `${collectionPercent}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2  text-[10px] tracking-[0.15em] text-gray-400">
                        COLLECTION COMPLETE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile collection status */}
              <div className="mt-8 flex items-center justify-between border border-black/10 px-4 py-3 lg:hidden">
                <span className=" text-[10px] font-bold tracking-[0.2em] text-gray-400">
                  COLLECTION STATUS
                </span>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-20 bg-gray-200">
                    <div
                      className="h-full bg-[#B01414]"
                      style={{
                        width: `${collectionPercent}%`,
                      }}
                    />
                  </div>

                  <span className=" text-xs font-bold text-[#B01414]">
                    {Math.round(collectionPercent)}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= COLLECTION ================= */}

          <main className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h2 className=" text-3xl font-bold md:text-4xl">
                  สิ่งมีชีวิตที่ค้นพบ
                </h2>

                <p className="mt-2  text-gray-500">
                  ตรวจสอบจำนวนปลาแต่ละประเภทที่คุณค้นพบ
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ค้นหาชื่อปลา..."
                  className="h-12 w-full border border-gray-300 bg-white px-4 pr-10   outline-none transition focus:border-[#B01414]"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2  text-gray-400">
                  /
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-5">
              {[
                { id: "all", label: "ทั้งหมด" },
                { id: "common", label: "Common" },
                { id: "rare", label: "Rare" },
                { id: "ultimate", label: "Ultimate" },
              ].map((filter) => {
                const active = activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`border px-5 py-2.5  text-xs font-bold transition ${
                      active
                        ? "border-[#B01414] bg-[#B01414] text-white"
                        : "border-gray-300 bg-white text-gray-500 hover:border-[#B01414] hover:text-[#B01414]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Collection Progress */}
            <div className="mb-10 border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className=" text-xs font-bold">COLLECTION PROGRESS</span>

                <span className=" text-xs text-gray-500">
                  {collectedXp} / {totalSystemXp} XP
                </span>
              </div>

              <div className="h-2 bg-gray-100">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${collectionPercent}%`,
                    backgroundColor: RED,
                  }}
                />
              </div>
            </div>

            {/* Fish Grid */}
            {filteredFish.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFish.map((fish) => (
                  <FishCard key={fish.id} fish={fish} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 bg-white py-20 text-center">
                <div className=" text-4xl text-gray-200">404</div>

                <p className="mt-3   text-gray-500">ไม่พบสิ่งมีชีวิตที่ค้นหา</p>
              </div>
            )}
          </main>
        </section>
      </Reveal>
      <Footer />
    </>
  );
}
