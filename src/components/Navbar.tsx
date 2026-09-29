import { useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes, fetchAuthSession, signOut } from "aws-amplify/auth";
import logo from "../assets/home/Logo.png";
import comp from "../assets/home/Goal.png";
import story from "../assets/home/Storytelling.png";
import leaderboard from "../assets/home/Leaderboard.png";
import contact from "../assets/home/Envelope.png";

const navLinks = [
    { icon: comp, label: "แข่งขัน", href: "/competition" },
    { icon: story, label: "เนื้อเรื่อง", href: "/story" },
    { icon: leaderboard, label: "ตารางคะแนน", href: "/leaderboard" },
    { icon: contact, label: "ติดต่อเรา", href: "/contact" },
];

export default function Navbar() {
    const [user, setUser] = useState<{
        username: string;
        email?: string;
        profileImage?: string;
    } | null>(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            const session = await fetchAuthSession();

            const groups =
                session.tokens?.accessToken?.payload?.["cognito:groups"];

            const admin =
                Array.isArray(groups) && groups.includes("Admins");

            setIsAdmin(admin);

            setUser({
                username:
                    attributes.preferred_username || currentUser.username,
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

    const profileHref = isAdmin
        ? "/admin/dashboard"
        : "/profile";

    return (
        <nav className="sticky top-0 z-50 my-4 w-full px-3 sm:px-4">
            <div
                className="
        relative mx-auto w-full max-w-6xl
        overflow-visible rounded-3xl
        border border-white/20
        bg-white/[0.10]
        px-4 py-2.5
        shadow-[0_8px_32px_rgba(0,0,0,0.04)]
        backdrop-blur-xl backdrop-saturate-150
        sm:rounded-full sm:px-6 sm:py-3
        md:px-8
        lg:px-12
    "
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
                            className="
                                h-10 w-auto
                                transition-all duration-500 ease-out
                                group-hover:scale-105
                                group-hover:rotate-[-2deg]
                                group-hover:drop-shadow-[0_0_10px_rgba(176,20,20,0.45)]
                                sm:h-12
                                md:h-13
                                lg:h-14
                            "
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
                                    className="
                                        group relative flex flex-col items-center
                                        gap-0.5 text-[#B01414]
                                        transition-all duration-300 ease-out
                                        hover:-translate-y-1
                                    "
                                >
                                    <img
                                        src={icon}
                                        alt=""
                                        className="
                                            h-6 w-6
                                            opacity-90
                                            transition-all duration-300 ease-out
                                            group-hover:scale-110
                                            group-hover:-rotate-3
                                            group-hover:opacity-100
                                            group-hover:drop-shadow-[0_0_6px_rgba(176,20,20,0.5)]
                                            sm:h-7 sm:w-7
                                        "
                                    />

                                    <span
                                        className="
                                            relative whitespace-nowrap
                                            text-[10px] font-medium
                                            transition-all duration-300
                                            sm:text-xs
                                            after:absolute after:-bottom-1
                                            after:left-1/2 after:h-[2px]
                                            after:w-0 after:-translate-x-1/2
                                            after:bg-[#B01414]
                                            after:transition-all after:duration-300
                                            group-hover:after:w-full
                                        "
                                    >
                                        {label}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Auth Section */}
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                            <span className="h-6 w-px bg-[#B01414]/40" />

                            {user ? (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        title="ออกจากระบบ"
                                        className="
                                            flex h-8 w-8 items-center justify-center
                                            rounded-full
                                            border border-[#B01414]/30
                                            text-[#B01414]
                                            transition-all duration-300
                                            hover:bg-[#B01414]
                                            hover:text-white
                                            active:scale-95
                                            sm:h-9 sm:w-9
                                        "
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
                                        <p className="text-xs font-bold text-[#403a38] transition-colors group-hover/nav:text-[#B01414]">
                                            {user.username}
                                        </p>

                                        <p className="text-[10px] text-gray-500">
                                            {user.email}
                                        </p>
                                    </a>

                                    {/* Profile */}
                                    <a
                                        href={profileHref}
                                        className="
                                            flex h-9 w-9 items-center justify-center
                                            overflow-hidden rounded-full
                                            border border-[#B01414]/30
                                            bg-gray-200
                                            font-bold text-[#B01414]
                                            transition-transform hover:scale-105
                                            sm:h-10 sm:w-10
                                        "
                                    >
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            user.username
                                                ? user.username
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "U"
                                        )}
                                    </a>
                                </div>
                            ) : (
                                <a href="/login">
                                    <button
                                        className="
                                            whitespace-nowrap
                                            bg-[#B01414]
                                            px-4 py-2
                                            text-xs text-white
                                            transition-all
                                            hover:bg-[#C51A1A]
                                            sm:px-5 sm:py-2.5 sm:text-sm
                                        "
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
                        aria-label={
                            isMobileMenuOpen
                                ? "ปิดเมนู"
                                : "เปิดเมนู"
                        }
                        aria-expanded={isMobileMenuOpen}
                        onClick={() =>
                            setIsMobileMenuOpen(!isMobileMenuOpen)
                        }
                        className="
                            relative z-10
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            border border-[#B01414]/25
                            text-[#B01414]
                            transition-all duration-300
                            hover:bg-[#B01414]
                            hover:text-white
                            active:scale-95
                            md:hidden
                        "
                    >
                        <span className="relative flex h-4 w-5 flex-col justify-between">
                            <span
                                className={`
                                    h-[2px] w-full rounded-full bg-current
                                    transition-all duration-300
                                    ${isMobileMenuOpen
                                        ? "translate-y-[7px] rotate-45"
                                        : ""
                                    }
                                `}
                            />

                            <span
                                className={`
                                    h-[2px] w-full rounded-full bg-current
                                    transition-all duration-300
                                    ${isMobileMenuOpen
                                        ? "scale-x-0 opacity-0"
                                        : ""
                                    }
                                `}
                            />

                            <span
                                className={`
                                    h-[2px] w-full rounded-full bg-current
                                    transition-all duration-300
                                    ${isMobileMenuOpen
                                        ? "-translate-y-[7px] -rotate-45"
                                        : ""
                                    }
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
                        ${isMobileMenuOpen
                            ? "mt-3 max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                    `}
                >
                    <div
                        className="
                            border-t border-[#B01414]/10
                            px-1 pb-2 pt-3
                        "
                    >
                        {/* Mobile Nav Links */}
                        <div className="flex flex-col gap-1">
                            {navLinks.map(({ icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={handleMobileLinkClick}
                                    className="
                                        group flex items-center gap-3
                                        rounded-2xl px-3 py-2.5
                                        text-[#B01414]
                                        transition-all duration-200
                                        hover:bg-[#B01414]/10
                                        active:scale-[0.98]
                                    "
                                >
                                    <div
                                        className="
                                            flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            rounded-full
                                            bg-[#B01414]/5
                                            transition-all duration-200
                                            group-hover:bg-[#B01414]/10
                                        "
                                    >
                                        <img
                                            src={icon}
                                            alt=""
                                            className="
                                                h-6 w-6
                                                opacity-90
                                                transition-transform duration-200
                                                group-hover:scale-110
                                            "
                                        />
                                    </div>

                                    <span className="text-sm font-medium">
                                        {label}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Mobile Auth */}
                        <div className="mt-2 border-t border-[#B01414]/10 pt-2">
                            {user ? (
                                <div className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5">
                                    <a
                                        href={profileHref}
                                        onClick={handleMobileLinkClick}
                                        className="flex min-w-0 items-center gap-3"
                                    >
                                        <div
                                            className="
                                                flex h-10 w-10 shrink-0
                                                items-center justify-center
                                                overflow-hidden rounded-full
                                                border border-[#B01414]/30
                                                bg-gray-200
                                                font-bold text-[#B01414]
                                            "
                                        >
                                            {user.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                user.username
                                                    ? user.username
                                                        .charAt(0)
                                                        .toUpperCase()
                                                    : "U"
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-bold text-[#403a38]">
                                                {user.username}
                                            </p>

                                            <p className="truncate text-[10px] text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </a>

                                    <button
                                        onClick={handleLogout}
                                        title="ออกจากระบบ"
                                        className="
                                            flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            rounded-full
                                            border border-[#B01414]/30
                                            text-[#B01414]
                                            transition-all duration-300
                                            hover:bg-[#B01414]
                                            hover:text-white
                                            active:scale-95
                                        "
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
                                        className="
                                            w-full
                                            rounded-xl
                                            bg-[#B01414]
                                            px-5 py-2.5
                                            text-sm text-white
                                            transition-all
                                            hover:bg-[#C51A1A]
                                            active:scale-[0.98]
                                        "
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