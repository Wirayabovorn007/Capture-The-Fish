import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/effects/Reveal";


import React, { useMemo, useState } from "react";

const RED = "#B01414";

const fishes = [
  {
    id: 1,
    name: "Kraken",
    rarity: "ultimate",
    quantity: 1,
    image: "/images/fish/kraken.png",
    description:
      "สิ่งมีชีวิตใต้ทะเลลึกที่ปรากฏตัวในพื้นที่ที่ไม่มีใครกล้าเข้าใกล้",
    points: 1000,
  },
  {
    id: 2,
    name: "Blow fish",
    rarity: "common",
    quantity: 4,
    image: "/images/fish/blow-fish.png",
    description:
      "ปลาตัวเล็กที่สามารถพองตัวเพื่อป้องกันตัวเองจากอันตราย",
    points: 100,
  },
  {
    id: 3,
    name: "Shell",
    rarity: "common",
    quantity: 8,
    image: "/images/fish/shell.png",
    description:
      "สิ่งมีชีวิตแห่งชายฝั่งที่ซ่อนตัวอยู่ตามโขดหินและพื้นทราย",
    points: 100,
  },
  {
    id: 4,
    name: "Salmon",
    rarity: "common",
    quantity: 7,
    image: "/images/fish/salmon.png",
    description:
      "ปลาที่เดินทางกลับสู่ต้นกำเนิดผ่านสายน้ำที่ไหลเชี่ยว",
    points: 100,
  },
  {
    id: 5,
    name: "Whale",
    rarity: "rare",
    quantity: 0,
    image: "/images/fish/whale.png",
    description:
      "ยักษ์ใหญ่แห่งมหาสมุทรที่เคลื่อนตัวอย่างสง่างามในทะเลเปิด",
    points: 300,
  },
  {
    id: 6,
    name: "squid",
    rarity: "rare",
    quantity: 2,
    image: "/images/fish/squid.png",
    description:
      "นักล่าแห่งความมืดที่ซ่อนตัวอยู่ในมหาสมุทรลึก",
    points: 300,
  },
  {
    id: 7,
    name: "Snakehead fish",
    rarity: "common",
    quantity: 3,
    image: "/images/fish/snakehead-fish.png",
    description:
      "ปลาน้ำจืดที่สามารถเอาชีวิตรอดในสภาพแวดล้อมที่หลากหลาย",
    points: 100,
  },
  {
    id: 8,
    name: "Black-chinned tilapia",
    rarity: "common",
    quantity: 5,
    image: "/images/fish/black-chinned-tilapia.png",
    description:
      "ปลาน้ำจืดที่พบได้ในแหล่งน้ำเขตร้อนและสามารถปรับตัวได้ดี",
    points: 100,
  },
  {
    id: 9,
    name: "pufferfish",
    rarity: "rare",
    quantity: 0,
    image: "/images/fish/pufferfish.png",
    description:
      "ปลาที่มีวิธีป้องกันตัวอันเป็นเอกลักษณ์และเต็มไปด้วยพิษ",
    points: 300,
  },
  {
    id: 10,
    name: "great shark",
    rarity: "rare",
    quantity: 1,
    image: "/images/fish/great-shark.png",
    description:
      "นักล่าที่อยู่บนสุดของห่วงโซ่อาหารแห่งท้องทะเล",
    points: 300,
  },
  {
    id: 11,
    name: "Megalodon",
    rarity: "ultimate",
    quantity: 0,
    image: "/images/fish/megalodon.png",
    description:
      "นักล่าโบราณขนาดมหึมาที่ครั้งหนึ่งเคยครองมหาสมุทร",
    points: 1000,
  },
  {
    id: 12,
    name: "Mermaids",
    rarity: "ultimate",
    quantity: 0,
    image: "/images/fish/mermaids.png",
    description:
      "สิ่งมีชีวิตในตำนานที่ถูกพบเห็นเพียงไม่กี่ครั้งในประวัติศาสตร์",
    points: 1000,
  },
  {
    id: 13,
    name: "killer whale",
    rarity: "ultimate",
    quantity: 0,
    image: "/images/fish/killer-whale.png",
    description:
      "นักล่าที่ฉลาดและทรงพลัง สามารถล่าร่วมกันเป็นฝูงได้",
    points: 1000,
  },
  {
    id: 14,
    name: "orca",
    rarity: "rare",
    quantity: 3,
    image: "/images/fish/orca.png",
    description:
      "นักล่าแห่งท้องทะเลที่มีพลังและความฉลาดเหนือกว่าปลาทั่วไป",
    points: 300,
  },
  {
    id: 15,
    name: "King of Nagas",
    rarity: "ultimate",
    quantity: 0,
    image: "/images/fish/king-of-nagas.png",
    description:
      "ราชาแห่งสายน้ำ สิ่งมีชีวิตลึกลับที่ถูกกล่าวขานในตำนาน",
    points: 1000,
  },
];

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

function FishImage({ fish }) {
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

function RarityBadge({ rarity }) {
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

function FishCard({ fish }) {
  const config = rarityConfig[fish.rarity];
  const discovered = fish.quantity > 0;

  return (
    <article
      className={`group relative overflow-hidden border bg-white transition-all duration-200 hover:-translate-y-1  ${
        fish.rarity === "ultimate"
          ? "border-[#B01414]/40"
          : "border-black/10"
      }`}
    >
      {/* rarity accent */}
      <div
        className="h-1"
        style={{ backgroundColor: config.color }}
      />

      {/* Fish image */}
      <FishImage fish={fish} />

      <div className="border-t border-black/10 p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>

            <h3
              className={`  font-bold ${
                discovered
                  ? "text-gray-900"
                  : "text-gray-400"
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
                color: discovered
                  ? config.color
                  : "#9CA3AF",
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

  // จำนวนประเภทปลาที่ค้นพบแล้ว
  const discoveredTypes = fishes.filter(
    (fish) => fish.quantity > 0
  ).length;

  // จำนวนปลาทั้งหมดที่ผู้เล่นมี
  const totalFishCollected = fishes.reduce(
    (total, fish) => total + fish.quantity,
    0
  );

  const filteredFish = useMemo(() => {
    return fishes.filter((fish) => {
      const matchesRarity =
        activeFilter === "all" ||
        fish.rarity === activeFilter;

      const matchesSearch = fish.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesRarity && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
   <>
   <Navbar/>
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
                width: `${
                  (discoveredTypes / fishes.length) * 100
                }%`,
              }}
            />
          </div>

          <span className=" text-xs font-bold text-[#B01414]">
            {Math.round(
              (discoveredTypes / fishes.length) * 100
            )}
            %
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

            <span className=" text-xs text-[#B01414]">
              %
            </span>
          </div>

          <div className="mt-5 flex items-end gap-1">
            <span className="text-4xl font-black tracking-tight text-[#B01414] md:text-5xl">
              {Math.round(
                (discoveredTypes / fishes.length) * 100
              )}
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
                  width: `${
                    (discoveredTypes / fishes.length) * 100
                  }%`,
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
              width: `${
                (discoveredTypes / fishes.length) * 100
              }%`,
            }}
          />
        </div>

        <span className=" text-xs font-bold text-[#B01414]">
          {Math.round(
            (discoveredTypes / fishes.length) * 100
          )}
          %
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
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
                onClick={() =>
                  setActiveFilter(filter.id)
                }
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
            <span className=" text-xs font-bold">
              COLLECTION PROGRESS
            </span>

            <span className=" text-xs text-gray-500">
              {discoveredTypes} / {fishes.length} TYPES
            </span>
          </div>

          <div className="h-2 bg-gray-100">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${
                  (discoveredTypes / fishes.length) * 100
                }%`,
                backgroundColor: RED,
              }}
            />
          </div>
        </div>

        {/* Fish Grid */}
        {filteredFish.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFish.map((fish) => (
              <FishCard
                key={fish.id}
                fish={fish}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-white py-20 text-center">
            <div className=" text-4xl text-gray-200">
              404
            </div>

            <p className="mt-3   text-gray-500">
              ไม่พบสิ่งมีชีวิตที่ค้นหา
            </p>
          </div>
        )}
      </main>
    </section>
   </Reveal>
   <Footer/>
   </>
  );
}
