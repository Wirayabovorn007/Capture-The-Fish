import { useRef } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Leaderboard() {
  const heroRef = useRef<HTMLDivElement>(null);

  const leaderboard = [
    {
      rank: 1,
      name: "BBonInwza",
      fish: 3904,
    },
    {
      rank: 2,
      name: "zakjkj",
      fish: 3204,
    },
    {
      rank: 3,
      name: "Wiraya",
      fish: 1904,
    },
  ];

  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  // Reusable placeholder avatar
  const Avatar = ({
    size = "h-28 w-28",
  }: {
    size?: string;
  }) => (
    <div
      className={`
        ${size}
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border-8
        border-[#f5e5e5]
        bg-[#444]
        text-white
        transition-all
        duration-300
        hover:scale-105
        hover:border-[#b01414]
        hover:shadow-lg
      `}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[65%] w-[65%] opacity-80"
      >
        <circle
          cx="12"
          cy="8"
          r="4"
          fill="currentColor"
        />

        <path
          d="M4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21"
          fill="currentColor"
        />
      </svg>
    </div>
  );

  return (
    <div className="absolute w-full">
      <Navbar />

      {/* ================= HERO ================= */}
      {/* Existing hero CSS kept unchanged */}
      <section
        className="top-0 absolute w-full z-0 overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pt-40"
        style={{
          background:
            "linear-gradient(135deg, #3D3D3D 0%, #1e1e1e 100%)",
        }}
      >
        {/* Decorative "123" background motif */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-16
            top-1/2
            -translate-y-1/2
            select-none
            whitespace-nowrap
            
            text-[26rem]
            font-bold
            leading-none
            text-white/[0.04]
            sm:text-[32rem]
          "
        >
          123
        </span>

        <div
          ref={heroRef}
          className="relative z-10 mx-auto max-w-6xl"
        >
          {/* ================= HERO HEADER ================= */}
          <h1
            className="
              cursor-default
              text-4xl
              font-bold
              text-white
              transition-all
              duration-300
              hover:translate-x-1
              hover:text-gray-200
              sm:text-5xl
            "
          >
            Leaderboard
          </h1>

          {/* ================= USER PROFILE ================= */}
          <div
            className="
              mt-6
              flex
              flex-col
              gap-6
              transition-all
              duration-300
              sm:flex-row
              sm:items-center
              sm:gap-5
            "
          >
            {/* Avatar */}
            <Avatar size="h-28 w-28 sm:h-32 sm:w-32" />

            {/* User information */}
            <div
              className="
                group
                cursor-default
                transition-transform
                duration-300
                hover:translate-x-1
              "
            >
              <h2
                className="
                  
                  text-3xl
                  font-bold
                  text-white
                  transition-colors
                  duration-300
                  group-hover:text-[#b01414]
                  sm:text-4xl
                "
              >
                Hack_the_cat
              </h2>

              <div className="mt-2 flex gap-8">
                {/* Rank */}
                <div>
                  <p className="text-xs text-gray-400">
                    อันดับ
                  </p>

                  <p
                    className="
                      
                      text-3xl
                      font-bold
                      leading-none
                      text-white
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  >
                    123
                  </p>
                </div>

                {/* Fish */}
                <div>
                  <p className="text-xs text-gray-400">
                    จำนวนปลา
                  </p>

                  <p
                    className="
                      
                      text-3xl
                      font-bold
                      leading-none
                      text-white
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  >
                    3
                  </p>
                </div>
              </div>
            </div>

            {/* ================= DIFFICULTY ================= */}
            <div
              className="
                group
                mt-2
                sm:ml-auto
                sm:mt-0
              "
            >
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  เคลียร์โจทย์
                </p>

                <p
                  className="
                    
                    text-3xl
                    font-bold
                    leading-none
                    text-white
                    transition-colors
                    duration-300
                    group-hover:text-[#b01414]
                  "
                >
                  4/10
                </p>
              </div>

              {/* Difficulty bars */}
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={`
                      h-7
                      w-4
                      rounded-sm
                      transition-all
                      duration-300
                      group-hover:-translate-y-1
                      sm:w-5
                      ${
                        index < 4
                          ? "bg-[#b01414] group-hover:bg-[#d11a1a]"
                          : "bg-gray-500 group-hover:bg-gray-400"
                      }
                    `}
                    style={{
                      transitionDelay: `${index * 20}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD ================= */}
      <main
        className="
          relative
          z-10
          mt-[400px]
          min-h-screen
          px-4
          pb-24
          pt-12
          sm:px-8
        "
      >
		 {/* ================= TOP 3 SUMMARY ================= */}
          <div
            className="
              mx-auto
              mt-10
              max-w-5xl
              text-right
              
              text-sm
              text-[#b01414]
            "
          >
            <p className="transition-transform duration-200 hover:-translate-x-1">
              No1: BBOnInwza 3904
            </p>

            <p className="transition-transform duration-200 hover:-translate-x-1">
              No2: zakjkj 3204
            </p>

            <p className="transition-transform duration-200 hover:-translate-x-1">
              No3: Wiraya 1904
            </p>
          </div>



        <section className="mx-auto max-w-6xl">
          {/* ================= TOP 3 ================= */}
          <div
            className="
              relative
              mx-auto
              mb-0
              flex
              max-w-5xl
              items-end
              justify-center
              gap-3
              sm:gap-10
            "
          >
            {/* ================= SECOND ================= */}
            <div
              className="
                group
                flex
                w-[30%]
                max-w-[220px]
                cursor-pointer
                flex-col
                items-center
              "
            >
              <div className="-mb-12 z-10">
                <Avatar size="h-28 w-28 sm:h-32 sm:w-32" />
              </div>

              <div
                className="
                  flex
                  h-[280px]
                  w-full
                  flex-col
                  items-center
                  justify-end
                  bg-[#444]
                  pb-12
                  text-white
                  transition-all
                  duration-300
                  group-hover:-translate-y-2
                  group-hover:bg-[#333]
                  group-hover:shadow-xl
                "
              >
                <span
                  className="
                    
                    text-7xl
                    font-bold
                    leading-none
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  2
                </span>

                <span className="mt-3 text-sm">
                  {second.fish.toLocaleString()}
                </span>

                <span className="mt-1 text-xs text-gray-200">
                  จำนวนปลา
                </span>

                <span className="mt-1  text-lg font-bold">
                  {second.name}
                </span>
              </div>
            </div>

            {/* ================= FIRST ================= */}
            <div
              className="
                group
                flex
                w-[30%]
                max-w-[220px]
                cursor-pointer
                flex-col
                items-center
              "
            >
              <div className="-mb-12 z-10">
                <Avatar size="h-28 w-28 sm:h-32 sm:w-32" />
              </div>

              <div
                className="
                  flex
                  h-[340px]
                  w-full
                  flex-col
                  items-center
                  justify-end
                  bg-[#b01414]
                  pb-12
                  text-white
                  transition-all
                  duration-300
                  group-hover:-translate-y-3
                  group-hover:bg-[#980f0f]
                  group-hover:shadow-2xl
                "
              >
                <span
                  className="
                    
                    text-8xl
                    font-bold
                    leading-none
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  1
                </span>

                <span className="mt-3 text-sm">
                  {first.fish.toLocaleString()}
                </span>

                <span className="mt-1 text-xs">
                  จำนวนปลา
                </span>

                <span className="mt-1  text-lg font-bold">
                  {first.name}
                </span>
              </div>
            </div>

            {/* ================= THIRD ================= */}
            <div
              className="
                group
                flex
                w-[30%]
                max-w-[220px]
                cursor-pointer
                flex-col
                items-center
              "
            >
              <div className="-mb-12 z-10">
                <Avatar size="h-28 w-28 sm:h-32 sm:w-32" />
              </div>

              <div
                className="
                  flex
                  h-[280px]
                  w-full
                  flex-col
                  items-center
                  justify-end
                  bg-[#444]
                  pb-12
                  text-white
                  transition-all
                  duration-300
                  group-hover:-translate-y-2
                  group-hover:bg-[#333]
                  group-hover:shadow-xl
                "
              >
                <span
                  className="
                    
                    text-7xl
                    font-bold
                    leading-none
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  3
                </span>

                <span className="mt-3 text-sm">
                  {third.fish.toLocaleString()}
                </span>

                <span className="mt-1 text-xs text-gray-200">
                  จำนวนปลา
                </span>

                <span className="mt-1  text-lg font-bold">
                  {third.name}
                </span>
              </div>
            </div>
          </div>

         

          {/* ================= TABLE ================= */}
          <div
            className="
              min-h-[420px]
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-sm
              transition-shadow
              duration-300
              hover:shadow-md
            "
          >
            {/* Header */}
            <div
              className="
                grid
                grid-cols-[45px_1fr_140px]
                border-b
                border-gray-200
                px-5
                py-4
                
                text-sm
                text-[#b01414]
                sm:grid-cols-[60px_1fr_160px]
                sm:px-6
              "
            >
              <span>No.</span>

              <span>Username</span>

              <span className="text-right">
                Fish amount
              </span>
            </div>

            {/* Rows */}
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className="
                  group
                  grid
                  cursor-pointer
                  grid-cols-[45px_1fr_140px]
                  items-center
                  px-5
                  py-4
                  
                  text-sm
                  text-[#b01414]
                  transition-all
                  duration-200
                  hover:bg-[#fff5f5]
                  sm:grid-cols-[60px_1fr_160px]
                  sm:px-6
                "
              >
                {/* Rank */}
                <span
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  {player.rank}
                </span>

                {/* Username */}
                <div className="flex items-center gap-3">
                  <Avatar size="h-10 w-10" />

                  <span
                    className="
                      transition-all
                      duration-200
                      group-hover:translate-x-1
                      group-hover:font-bold
                    "
                  >
                    {player.name}
                  </span>
                </div>

                {/* Fish */}
                <span
                  className="
                    text-right
                    transition-all
                    duration-200
                    group-hover:-translate-x-1
                    group-hover:font-bold
                  "
                >
                  {player.fish.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}