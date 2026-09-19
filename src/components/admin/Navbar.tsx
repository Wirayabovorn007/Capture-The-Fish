import logo from "../../assets/home/Logo.png"
import dashboard from "../../assets/home/Goal.png"
import management from "../../assets/home/Storytelling.png"
import challenge from "../../assets/home/Leaderboard.png"
import users from "../../assets/home/Envelope.png"

const adminNavLinks = [
  {
    icon: dashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: management,
    label: "จัดการโจทย์/ผู้ใช้",
    href: "/admin/management",
  }
]

export default function AdminNavbar() {
  return (
    <nav className="sticky top-0 z-50 my-4 w-full px-4 py-0">
      <div
        className="
          relative mx-auto flex max-w-6xl items-center justify-between
          overflow-hidden rounded-full
          border border-white/20
          bg-white/[0.10]
          px-6 py-3
          backdrop-blur-xl
          backdrop-saturate-150
          shadow-[0_8px_32px_rgba(0,0,0,0.04)]
          md:px-10
          lg:px-12
        "
      >
        {/* Glass gradient */}
        <div
          className="
            pointer-events-none absolute inset-0
            rounded-full
            bg-gradient-to-b
            from-white/[0.12]
            via-transparent
            to-transparent
          "
        />

        {/* Top highlight */}
        <div
          className="
            pointer-events-none absolute inset-x-6 top-0
            h-px
            bg-white/40
          "
        />

        {/* =========================================
            Logo
        ========================================= */}

        <a
          href="/admin"
          className="
            group relative z-10 shrink-0
            transition-all duration-300 ease-out
            hover:-translate-y-1
          "
        >
          <img
            src={logo}
            alt="Brand Logo"
            className="
              h-12 w-auto
              transition-all duration-500 ease-out
              group-hover:scale-105
              group-hover:rotate-[-2deg]
              group-hover:drop-shadow-[0_0_10px_rgba(176,20,20,0.45)]
              md:h-14
            "
          />

          <span
            className="
              pointer-events-none absolute
              bottom-1 left-1/2
              h-2 w-10
              -translate-x-1/2
              rounded-full
              bg-[#B01414]/0
              blur-md
              transition-all duration-500
              group-hover:bg-[#B01414]/40
              group-hover:w-14
            "
          />
        </a>

        {/* =========================================
            Admin Navigation
        ========================================= */}

        <div className="relative z-10 flex items-center">
          {/* Desktop Menu */}

          <div className="mx-6 hidden items-center gap-7 md:flex lg:mx-10 lg:gap-8">
            {adminNavLinks.map(
              ({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="
                    group relative flex flex-col
                    items-center gap-1
                    text-[#B01414]
                    transition-all duration-300
                    ease-out
                    hover:-translate-y-1
                  "
                >
                  <img
                    src={icon}
                    alt=""
                    className="
                      h-6 w-6
                      opacity-90
                      transition-all duration-300
                      ease-out
                      group-hover:scale-110
                      group-hover:-rotate-3
                      group-hover:opacity-100
                      group-hover:drop-shadow-[0_0_6px_rgba(176,20,20,0.5)]
                    "
                  />

                  <span
                    className="
                      relative whitespace-nowrap
                      text-xs font-medium
                      transition-all duration-300
                      after:absolute
                      after:-bottom-1
                      after:left-1/2
                      after:h-[2px]
                      after:w-0
                      after:-translate-x-1/2
                      after:bg-[#B01414]
                      after:transition-all
                      after:duration-300
                      group-hover:after:w-full
                    "
                  >
                    {label}
                  </span>
                </a>
              )
            )}
          </div>

          {/* Divider */}

          <span
            className="
              hidden h-6 w-px
              bg-[#B01414]/40
              md:block
            "
          />

          {/* =========================================
              Admin Badge + Logout
          ========================================= */}

          <div className="ml-4 flex items-center gap-3 lg:ml-6 lg:gap-5">
            <div
              className="
                hidden items-center gap-2
                rounded-full
                border border-[#B01414]/15
                bg-[#B01414]/5
                px-3 py-1.5
                md:flex
              "
            >
              <span
                className="
                  h-2 w-2
                  rounded-full
                  bg-[#B01414]
                  shadow-[0_0_8px_rgba(176,20,20,0.5)]
                "
              />

              <span
                className="
                  text-xs font-semibold
                  text-[#B01414]
                "
              >
                ADMIN
              </span>
            </div>

            <a
              href="/admin/login"
              className="
                group relative overflow-hidden
                rounded-lg
                bg-[#B01414]
                px-4 py-2.5
                text-sm text-white
                transition-all duration-300
                ease-out
                hover:-translate-y-0.5
                hover:bg-[#C51A1A]
                active:translate-y-0
                active:shadow-[0_0_10px_rgba(176,20,20,0.3)]
                md:px-5
              "
            >
              {/* Shine */}

              <span
                className="
                  pointer-events-none
                  absolute inset-y-0
                  -left-1/2
                  w-1/3
                  rotate-12
                  bg-white/20
                  transition-all duration-500
                  group-hover:left-[120%]
                "
              />

              <span className="relative">
                ออกจากระบบ
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================
          Mobile Admin Navigation
      ========================================= */}

      <div
        className="
          mx-auto mt-2
          flex max-w-6xl
          gap-2 overflow-x-auto
          rounded-2xl
          border border-white/20
          bg-white/[0.10]
          p-2
          backdrop-blur-xl
          md:hidden
        "
      >
        {adminNavLinks.map(
          ({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="
                flex shrink-0
                items-center gap-2
                rounded-xl
                px-3 py-2
                text-xs font-medium
                text-[#B01414]
                transition-all
                hover:bg-[#B01414]/10
              "
            >
              <img
                src={icon}
                alt=""
                className="h-5 w-5"
              />

              <span>{label}</span>
            </a>
          )
        )}
      </div>
    </nav>
  )
}