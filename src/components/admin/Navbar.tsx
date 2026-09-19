import { useEffect, useState } from "react"
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth"

import logo from "../../assets/home/Logo.png"
import dashboard from "../../assets/home/Goal.png"
import management from "../../assets/home/Storytelling.png"

const adminNavLinks = [
  {
    icon: dashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: management,
    label: "จัดการโจทย์/ผู้ใช้",
    href: "/admin/management",
  },
]

export default function AdminNavbar() {
  const [user, setUser] = useState<{
    username: string
    email?: string
    profileImage?: string
  } | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()

      setUser({
        username: attributes.preferred_username || currentUser.username,
        email: attributes.email,
        profileImage: attributes.picture,
      })
    } catch {
      setUser(null)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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

        {/* =========================
            Logo
        ========================= */}

        <a
          href="/admin/dashboard"
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

        {/* =========================
            Admin Navigation
        ========================= */}

        <div className="relative z-10 flex items-center">
          {/* Desktop Menu */}

          <div className="mx-6 hidden items-center gap-7 md:flex lg:mx-10 lg:gap-8">
            {adminNavLinks.map(({ icon, label, href }) => (
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
            ))}
          </div>

          {/* Divider */}

          <span
            className="
              hidden h-6 w-px
              bg-[#B01414]/40
              md:block
            "
          />

          {/* =========================
              Admin Profile + Logout
          ========================= */}

          <div className="ml-4 flex items-center gap-3 lg:ml-6">
            {user && (
              <>
                {/* Logout Icon Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B01414]/30 text-[#B01414] transition-all duration-300 hover:bg-[#B01414] hover:text-white active:scale-95"
                >
                  <i className="fa-solid fa-right-from-bracket text-sm"></i>
                </button>

                {/* Username / Email */}
                <a
                  href="/profile"
                  className="hidden cursor-pointer text-right group/nav lg:block"
                >
                  <p className="text-xs font-bold text-[#403a38] transition-colors group-hover/nav:text-[#B01414]">
                    {user.username}
                  </p>
                  <p className="text-[10px] text-gray-500">{user.email}</p>
                </a>

                {/* Profile Image */}
                <a
                  href="/profile"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#B01414]/30 bg-gray-200 font-bold text-[#B01414] transition-transform hover:scale-105"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "A"
                  )}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Mobile Admin Navigation
      ========================= */}

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
        {adminNavLinks.map(({ icon, label, href }) => (
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
        ))}
      </div>
    </nav>
  )
}