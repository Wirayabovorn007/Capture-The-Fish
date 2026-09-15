import {
  Settings,
  Trophy,
  Flame,
  Star,
} from "lucide-react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Reveal from "../components/effects/Reveal"

export default function Profile() {
  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="group cursor-default">
                <p className="text-sm text-[#B01414] transition-transform duration-200 group-hover:translate-x-1">
                  ฉายา
                </p>

                <h1
                  className="
                    mt-1
                    text-4xl
                    font-bold
                    tracking-wide
                    text-[#B01414]
                    transition-all
                    duration-200
                    group-hover:tracking-wider
                    sm:text-5xl
                  "
                >
                  Deep Sea Scout
                </h1>
              </div>

              {/* Manage Profile */}
              <button
                type="button"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-700
                  transition-all
                  duration-200
                  hover:text-[#B01414]
                "
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-1">
                  จัดการโปรไฟล์
                </span>

                <Settings
                  className="
                    h-5
                    w-5
                    transition-transform
                    duration-500
                    group-hover:rotate-90
                  "
                />
              </button>
            </div>

            {/* Profile Summary */}
            <section className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1.6fr_1fr]">
              {/* User */}
              <div className="flex items-center gap-5">
                {/* Profile Image */}
                <div
                  className="
                    h-[125px]
                    w-[125px]
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border-[6px]
                    border-[#f5e4e4]
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:border-[#B01414]
                    hover:shadow-lg
                  "
                >
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
                    alt="Profile"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      hover:scale-110
                    "
                  />
                </div>

                {/* User Information */}
                <div className="group cursor-default">
                  <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-[#B01414]">
                    ชื่อผู้ใช้
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-black
                      transition-colors
                      duration-200
                      group-hover:text-[#B01414]
                      sm:text-3xl
                    "
                  >
                    Hack_the_cat
                  </h2>

                  <div className="mt-3 flex gap-10">
                    {/* Rank */}
                    <div className="group/stat cursor-default">
                      <p className="text-xs text-gray-500">
                        อันดับ
                      </p>

                      <p
                        className="
                          text-3xl
                          font-bold
                          text-black
                          transition-all
                          duration-200
                          group-hover/stat:translate-x-1
                          group-hover/stat:text-[#B01414]
                        "
                      >
                        123
                      </p>
                    </div>

                    {/* Fish Count */}
                    <div className="group/stat cursor-default">
                      <p className="text-xs text-gray-500">
                        จำนวนปลา
                      </p>

                      <p
                        className="
                          text-3xl
                          font-bold
                          text-black
                          transition-all
                          duration-200
                          group-hover/stat:translate-x-1
                          group-hover/stat:text-[#B01414]
                        "
                      >
                        1
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Stats */}
              <div className="flex items-center justify-between gap-8">
                <div className="space-y-2 text-sm">
                  <StatRow
                    dot="bg-green-500"
                    label="ง่าย"
                    count="1"
                  />

                  <StatRow
                    dot="bg-orange-500"
                    label="ปานกลาง"
                    count="1"
                  />

                  <StatRow
                    dot="bg-[#B01414]"
                    label="ยาก"
                    count="1"
                  />
                </div>

                {/* Cleared */}
                <div
                  className="
                    group
                    cursor-default
                    text-center
                    transition-transform
                    duration-200
                    hover:scale-105
                  "
                >
                  <p className="text-xs text-gray-600">
                    เคลียร์โจทย์
                  </p>

                  <p
                    className="
                      text-3xl
                      font-bold
                      text-black
                      transition-colors
                      duration-200
                      group-hover:text-[#B01414]
                    "
                  >
                    4
                    <span className="text-xl">
                      /10
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Progress */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 10 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className={`
                      h-[30px]
                      flex-1
                      rounded-sm
                      cursor-default
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:scale-y-110
                      hover:shadow-sm
                      ${
                        index < 4
                          ? "bg-[#B01414] hover:bg-[#d91414]"
                          : "bg-gray-500 hover:bg-gray-400"
                      }
                    `}
                  />
                )
              )}
            </div>

            {/* Rank / Streak */}
            <section className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoCard
                title="Rank"
                icon={
                  <Trophy className="h-12 w-12 text-yellow-400" />
                }
              >
                <span className="text-3xl italic text-black">
                  Top 70%
                </span>
              </InfoCard>

              <InfoCard
                title="Streak"
                icon={
                  <Flame className="h-12 w-12 text-red-500" />
                }
              >
                <span className="text-3xl italic text-black">
                  17 วัน!
                </span>
              </InfoCard>
            </section>

            {/* Collection */}
            <section className="mt-14">
              <p
                className="
                  text-sm
                  font-bold
                  text-[#B01414]
                  transition-transform
                  duration-200
                  hover:translate-x-1
                "
              >
                ปลาสะสม
              </p>

              <div className="mt-5 flex items-end justify-between">
                <div className="w-[345px]">
                  <h2
                    className="
                      text-3xl
                      font-bold
                      italic
                      text-[#B01414]
                      transition-all
                      duration-200
                      hover:translate-x-2
                      hover:tracking-wide
                    "
                  >
                    1 ตัว 1 ชนิด
                  </h2>

                  <div
                    className="
                      mt-5
                      h-[2px]
                      w-full
                      bg-[#f0cccc]
                      transition-all
                      duration-500
                      hover:bg-[#B01414]
                      hover:h-[3px]
                    "
                  />
                </div>

                {/* Rarity */}
                <div className="hidden space-y-1 text-sm sm:block">
                  <RarityRow
                    stars={1}
                    label="ธรรมดา"
                    count={0}
                  />

                  <RarityRow
                    stars={2}
                    label="หายาก"
                    count={1}
                  />

                  <RarityRow
                    stars={3}
                    label="ตำนาน"
                    count={0}
                  />
                </div>
              </div>

              {/* Fish Card */}
              <div className="mt-10 w-[225px]">
                <div
                  className="
                    group
                    flex
                    h-[180px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-2
                    hover:border-[#B01414]/20
                    hover:shadow-lg
                  "
                >
                  {/* Fish */}
                  <div
                    className="
                      text-6xl
                      transition-transform
                      duration-500
                      group-hover:scale-125
                      group-hover:-rotate-6
                    "
                  >
                    🦈
                  </div>

                  {/* Stars */}
                  <div className="mt-2 flex gap-1">
                    <Star
                      className="
                        h-4
                        w-4
                        fill-yellow-400
                        text-yellow-400
                        transition-transform
                        duration-200
                        group-hover:scale-125
                      "
                    />

                    <Star
                      className="
                        h-4
                        w-4
                        fill-yellow-400
                        text-yellow-400
                        transition-transform
                        delay-75
                        duration-200
                        group-hover:scale-125
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-bold
                      text-[#B01414]
                      transition-all
                      duration-200
                      group-hover:tracking-wide
                    "
                  >
                    White Shark
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-600
                      transition-colors
                      duration-200
                      group-hover:text-black
                    "
                  >
                    ครอบครอง 1
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </Reveal>

      <Footer />
    </>
  )
}

/* ----------------------------- */
/* Components */
/* ----------------------------- */

function StatRow({
  dot,
  label,
  count,
}: {
  dot: string
  label: string
  count: number | string
}) {
  return (
    <div
      className="
        group
        flex
        cursor-default
        items-center
        gap-2
        transition-transform
        duration-200
        hover:translate-x-2
      "
    >
      <span
        className={`
          h-3
          w-3
          rounded-full
          ${dot}
          transition-transform
          duration-200
          group-hover:scale-125
        `}
      />

      <span
        className="
          text-gray-700
          transition-colors
          duration-200
          group-hover:text-[#B01414]
        "
      >
        {label}
      </span>

      <span
        className="
          text-black
          transition-transform
          duration-200
          group-hover:scale-110
        "
      >
        {count}
      </span>
    </div>
  )
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      className="
        group
        h-[120px]
        cursor-default
        border
        border-gray-100
        bg-white
        px-5
        py-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-2
        hover:border-[#B01414]/20
        hover:shadow-lg
      "
    >
      <p
        className="
          text-xs
          font-bold
          text-[#B01414]
          transition-transform
          duration-200
          group-hover:translate-x-1
        "
      >
        {title}
      </p>

      <div className="mt-2 flex items-center gap-4">
        <div className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
          {icon}
        </div>

        <div className="transition-transform duration-200 group-hover:translate-x-1">
          {children}
        </div>
      </div>
    </div>
  )
}

function RarityRow({
  stars,
  label,
  count,
}: {
  stars: number
  label: string
  count: number
}) {
  return (
    <div
      className="
        group
        flex
        cursor-default
        items-center
        gap-2
        transition-transform
        duration-200
        hover:translate-x-2
      "
    >
      <div className="flex">
        {Array.from({ length: stars }).map(
          (_, index) => (
            <Star
              key={index}
              className="
                h-4
                w-4
                fill-yellow-400
                text-yellow-400
                transition-transform
                duration-200
                group-hover:scale-125
              "
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            />
          )
        )}
      </div>

      <span
        className="
          text-gray-700
          transition-colors
          duration-200
          group-hover:text-[#B01414]
        "
      >
        {label}
      </span>

      <span
        className="
          text-black
          transition-transform
          duration-200
          group-hover:scale-110
        "
      >
        {count}
      </span>
    </div>
  )
}