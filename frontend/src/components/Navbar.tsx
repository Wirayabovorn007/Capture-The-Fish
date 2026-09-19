import { useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
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
    const [user, setUser] = useState<{ username: string; email?: string; profileImage?: string } | null>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            setUser({
                username: attributes.preferred_username || currentUser.username,
                email: attributes.email,
                profileImage: attributes.picture,
            });
        } catch {
            setUser(null);
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

    return (
        <nav className="sticky top-0 my-4 z-50 w-full px-4 py-0">
            <div className="relative mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-full border border-white/20 bg-white/[0.10] px-12 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.12] via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/40" />

                {/* Logo */}
                <a href="/" className="group relative shrink-0 transition-all duration-300 ease-out hover:-translate-y-1">
                    <img
                        src={logo}
                        alt="Brand Logo"
                        className="h-14 w-auto transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-[-2deg] group-hover:drop-shadow-[0_0_10px_rgba(176,20,20,0.45)]"
                    />
                    <span className="pointer-events-none absolute bottom-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-[#B01414]/0 blur-md transition-all duration-500 group-hover:bg-[#B01414]/40 group-hover:w-14" />
                </a>

                {/* Nav Links */}
                <div className="flex">
                    <div className="hidden items-center gap-8 md:flex mx-10">
                        {navLinks.map(({ icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="group relative flex flex-col items-center gap-1 text-[#B01414] transition-all duration-300 ease-out hover:-translate-y-1"
                            >
                                <img
                                    src={icon}
                                    alt=""
                                    className="h-7 w-7 opacity-90 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_rgba(176,20,20,0.5)]"
                                />
                                <span className="relative text-xs font-medium transition-all duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#B01414] after:transition-all after:duration-300 group-hover:after:w-full">
                                    {label}
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-6">
                        <span className="hidden h-6 w-px bg-[#B01414]/40 md:block" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Logout Icon Button */}
                                <button
                                    onClick={handleLogout}
                                    title="ออกจากระบบ"
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B01414]/30 text-[#B01414] transition-all duration-300 hover:bg-[#B01414] hover:text-white active:scale-95"
                                >
                                    <i className="fa-solid fa-right-from-bracket text-sm"></i>
                                </button>

                                {/* คลิกที่ชื่อ/อีเมล หรือรูปเพื่อไปหน้าโปรไฟล์ */}
                                <a href="/profile" className="hidden lg:block text-right cursor-pointer group/nav">
                                    <p className="text-xs font-bold text-[#403a38] group-hover/nav:text-[#B01414] transition-colors">{user.username}</p>
                                    <p className="text-[10px] text-gray-500">{user.email}</p>
                                </a>

                                <a href="/profile" className="h-10 w-10 overflow-hidden rounded-full border border-[#B01414]/30 bg-gray-200 flex items-center justify-center font-bold text-[#B01414] transition-transform hover:scale-105">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        user.username ? user.username.charAt(0).toUpperCase() : "U"
                                    )}
                                </a>
                            </div>
                        ) : (
                            <a href="/login">
                                <button className="bg-[#B01414] px-6 py-2.5 text-sm text-white transition-all hover:bg-[#C51A1A]">
                                    เข้าสู่ระบบ
                                </button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}