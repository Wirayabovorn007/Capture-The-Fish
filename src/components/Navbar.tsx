import { useEffect, useRef, useState } from "react";
import {
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signOut,
} from "aws-amplify/auth";
import logo from "../assets/home/Logo.png";

/* ------------------------------------------------------------------ */
/*  Nav links – Font Awesome icons instead of PNG images               */
/* ------------------------------------------------------------------ */
const navLinks = [
  { icon: "fa-solid fa-bullseye", label: "แข่งขัน", href: "/competition" },
  { icon: "fa-solid fa-book-open", label: "เนื้อเรื่อง", href: "/story" },
  { icon: "fa-solid fa-fish", label: "ตู้ปลา", href: "/collection" },
  {
    icon: "fa-solid fa-ranking-star",
    label: "ตารางคะแนน",
    href: "/leaderboard",
  },
  { icon: "fa-solid fa-envelope", label: "ติดต่อเรา", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/*  UI-only helper: detects whether the content behind the navbar is   */
/*  dark so the navbar can switch colour automatically.                */
/*                                                                     */
/*  Tip: for sections with a background IMAGE/VIDEO, add               */
/*  data-navbar-theme="dark" (or "light") to that section so the       */
/*  navbar knows what to do.                                           */
/* ------------------------------------------------------------------ */
function parseColor(value: string): [number, number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(parseFloat);
  if (parts.length < 3) return null;
  return [parts[0], parts[1], parts[2], parts[3] ?? 1];
}

function isDarkColor([r, g, b]: [number, number, number, number]) {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

function useBackdropIsDark(navRef: React.RefObject<HTMLElement | null>) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let frame = 0;

    const detect = () => {
      const nav = navRef.current;
      if (!nav) return;

      const rect = nav.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const stack = document.elementsFromPoint(x, y);

      for (const el of stack) {
        if (nav.contains(el)) continue;

        const forced = el
          .closest("[data-navbar-theme]")
          ?.getAttribute("data-navbar-theme");
        if (forced === "dark") return setIsDark(true);
        if (forced === "light") return setIsDark(false);

        const color = parseColor(getComputedStyle(el).backgroundColor);
        if (color && color[3] > 0.5) {
          return setIsDark(isDarkColor(color));
        }
      }

      setIsDark(false);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(detect);
    };

    schedule();
    const timer = window.setTimeout(schedule, 400);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, [navRef]);

  return isDark;
}

/* ------------------------------------------------------------------ */
/*  Colour tokens for each theme                                       */
/* ------------------------------------------------------------------ */
const themes = {
  light: {
    text: "text-[#B01414]",
    border: "border-[#B01414]/30",
    borderSoft: "border-[#B01414]/25",
    divider: "bg-[#B01414]/40",
    sectionBorder: "border-[#B01414]/10",
    hoverFill: "hover:bg-[#B01414] hover:text-white",
    underline: "after:bg-[#B01414]",
    iconGlow: "group-hover:drop-shadow-[0_0_6px_rgba(176,20,20,0.5)]",
    mobileHover: "hover:bg-[#B01414]/10",
    mobileIconBg: "bg-[#B01414]/5 group-hover:bg-[#B01414]/10",
    userName: "text-[#403a38] group-hover/nav:text-[#B01414]",
    userNameMobile: "text-[#403a38]",
    email: "text-gray-500",
    avatar: "bg-gray-200 text-[#B01414]",
    loginBtn: "bg-[#B01414] text-white hover:bg-[#C51A1A]",
    glass: "border-white/20 bg-white/[0.10]",
  },
  dark: {
    text: "text-white",
    border: "border-white/40",
    borderSoft: "border-white/35",
    divider: "bg-white/40",
    sectionBorder: "border-white/15",
    hoverFill: "hover:bg-white hover:text-[#B01414]",
    underline: "after:bg-white",
    iconGlow: "group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]",
    mobileHover: "hover:bg-white/10",
    mobileIconBg: "bg-white/10 group-hover:bg-white/20",
    userName: "text-white group-hover/nav:text-white/80",
    userNameMobile: "text-white",
    email: "text-white/70",
    avatar: "bg-white/20 text-white",
    loginBtn: "bg-white text-[#B01414] hover:bg-white/90",
    glass: "border-white/20 bg-black/[0.18]",
  },
} as const;

export default function Navbar() {
  const [user, setUser] = useState<{
    username: string;
    email?: string;
    profileImage?: string;
  } | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const isDark = useBackdropIsDark(navRef);
  const t = isDark ? themes.dark : themes.light;

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();

      const groups = session.tokens?.accessToken?.payload?.["cognito:groups"];

      const admin = Array.isArray(groups) && groups.includes("Admins");

      setIsAdmin(admin);

      setUser({
        username: attributes.preferred_username || currentUser.username,
        email: attributes.email,
        profileImage: attributes.picture,
      });
    } catch {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const profileHref = isAdmin ? "/admin/dashboard" : "/profile";

  return (
    <nav className="sticky top-0 z-50 my-4 w-full px-3 sm:px-4">
      <div
        ref={navRef}
        className={`
          relative mx-auto w-full max-w-6xl
          overflow-visible rounded-3xl
          border
          ${t.glass}
          px-4 py-2.5
          shadow-[0_8px_32px_rgba(0,0,0,0.04)]
          backdrop-blur-xl backdrop-saturate-150
          transition-colors duration-300
          sm:rounded-full sm:px-6 sm:py-3
          md:px-8
          lg:px-12
        `}
      >
        {/* Glass effects */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.12] via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/40" />

        {/* Main Navbar */}
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="group relative shrink-0 transition-all duration-300 ease-out hover:-translate-y-1"
          >
            <img
              src={logo}
              alt="Brand Logo"
              className={`
                h-10 w-auto
                transition-all duration-500 ease-out
                group-hover:scale-105
                group-hover:rotate-[-2deg]
                group-hover:drop-shadow-[0_0_10px_rgba(176,20,20,0.45)]
                sm:h-12
                md:h-13
                lg:h-14
                ${isDark ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]" : ""}
              `}
            />

            <span
              className="
                pointer-events-none absolute bottom-0.5 left-1/2
                h-2 w-8 -translate-x-1/2 rounded-full
                bg-[#B01414]/0 blur-md
                transition-all duration-500
                group-hover:w-12
                group-hover:bg-[#B01414]/40
              "
            />
          </a>

          {/* Desktop / Tablet Navigation */}
          <div className="hidden items-center md:flex">
            {/* Nav Links */}
            <div
              className="
                mx-4 flex items-center gap-5
                sm:mx-6 sm:gap-6
                lg:mx-10 lg:gap-8
              "
            >
              {navLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`
                    group relative flex flex-col items-center
                    gap-1 ${t.text}
                    transition-all duration-300 ease-out
                    hover:-translate-y-1
                  `}
                >
                  <i
                    aria-hidden="true"
                    className={`
                      ${icon}
                      flex h-6 w-6 items-center justify-center
                      text-base
                      opacity-90
                      transition-all duration-300 ease-out
                      group-hover:scale-110
                      group-hover:-rotate-3
                      group-hover:opacity-100
                      ${t.iconGlow}
                      sm:h-7 sm:w-7 sm:text-lg
                    `}
                  />

                  <span
                    className={`
                      relative whitespace-nowrap
                      text-[10px] font-medium
                      transition-all duration-300
                      sm:text-xs
                      after:absolute after:-bottom-1
                      after:left-1/2 after:h-[2px]
                      after:w-0 after:-translate-x-1/2
                      ${t.underline}
                      after:transition-all after:duration-300
                      group-hover:after:w-full
                    `}
                  >
                    {label}
                  </span>
                </a>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <span className={`h-6 w-px ${t.divider} transition-colors duration-300`} />

              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    title="ออกจากระบบ"
                    className={`
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      border ${t.border}
                      ${t.text}
                      transition-all duration-300
                      ${t.hoverFill}
                      active:scale-95
                      sm:h-9 sm:w-9
                    `}
                  >
                    <i className="fa-solid fa-right-from-bracket text-xs sm:text-sm" />
                  </button>

                  {/* User Info */}
                  <a
                    href={profileHref}
                    className="
                      hidden cursor-pointer text-right
                      group/nav
                      lg:block
                    "
                  >
                    <p
                      className={`text-xs font-bold transition-colors ${t.userName}`}
                    >
                      {user.username}
                    </p>

                    <p className={`text-[10px] transition-colors ${t.email}`}>
                      {user.email}
                    </p>
                  </a>

                  {/* Profile */}
                  <a
                    href={profileHref}
                    className={`
                      flex h-9 w-9 items-center justify-center
                      overflow-hidden rounded-full
                      border ${t.border}
                      ${t.avatar}
                      font-bold
                      transition-all hover:scale-105
                      sm:h-10 sm:w-10
                    `}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : user.username ? (
                      user.username.charAt(0).toUpperCase()
                    ) : (
                      "U"
                    )}
                  </a>
                </div>
              ) : (
                <a href="/login">
                  <button
                    className={`
                      whitespace-nowrap
                      ${t.loginBtn}
                      px-4 py-2
                      text-xs
                      transition-all
                      sm:px-5 sm:py-2.5 sm:text-sm
                    `}
                  >
                    เข้าสู่ระบบ
                  </button>
                </a>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              relative z-10
              flex h-10 w-10
              items-center justify-center
              rounded-full
              border ${t.borderSoft}
              ${t.text}
              transition-all duration-300
              ${t.hoverFill}
              active:scale-95
              md:hidden
            `}
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span
                className={`
                  h-[2px] w-full rounded-full bg-current
                  transition-all duration-300
                  ${isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}
                `}
              />

              <span
                className={`
                  h-[2px] w-full rounded-full bg-current
                  transition-all duration-300
                  ${isMobileMenuOpen ? "scale-x-0 opacity-0" : ""}
                `}
              />

              <span
                className={`
                  h-[2px] w-full rounded-full bg-current
                  transition-all duration-300
                  ${isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}
                `}
              />
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            relative overflow-hidden transition-all duration-300 ease-in-out
            md:hidden
            ${
              isMobileMenuOpen
                ? "mt-3 max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div
            className={`
              border-t ${t.sectionBorder}
              px-1 pb-2 pt-3
            `}
          >
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={handleMobileLinkClick}
                  className={`
                    group flex items-center gap-3
                    rounded-2xl px-3 py-2.5
                    ${t.text}
                    transition-all duration-200
                    ${t.mobileHover}
                    active:scale-[0.98]
                  `}
                >
                  <div
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-full
                      ${t.mobileIconBg}
                      transition-all duration-200
                    `}
                  >
                    <i
                      aria-hidden="true"
                      className={`
                        ${icon}
                        text-base
                        opacity-90
                        transition-transform duration-200
                        group-hover:scale-110
                      `}
                    />
                  </div>

                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className={`mt-2 border-t ${t.sectionBorder} pt-2`}>
              {user ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5">
                  <a
                    href={profileHref}
                    onClick={handleMobileLinkClick}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <div
                      className={`
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        overflow-hidden rounded-full
                        border ${t.border}
                        ${t.avatar}
                        font-bold
                      `}
                    >
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : user.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        "U"
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-xs font-bold ${t.userNameMobile}`}
                      >
                        {user.username}
                      </p>

                      <p className={`truncate text-[10px] ${t.email}`}>
                        {user.email}
                      </p>
                    </div>
                  </a>

                  <button
                    onClick={handleLogout}
                    title="ออกจากระบบ"
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-full
                      border ${t.border}
                      ${t.text}
                      transition-all duration-300
                      ${t.hoverFill}
                      active:scale-95
                    `}
                  >
                    <i className="fa-solid fa-right-from-bracket text-sm" />
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  onClick={handleMobileLinkClick}
                  className="block"
                >
                  <button
                    className={`
                      w-full
                      rounded-xl
                      ${t.loginBtn}
                      px-5 py-2.5
                      text-sm
                      transition-all
                      active:scale-[0.98]
                    `}
                  >
                    เข้าสู่ระบบ
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}