import logo from "../assets/home/Logo.png"
import comp from "../assets/home/Goal.png"
import story from "../assets/home/Storytelling.png"
import leaderboard from "../assets/home/Leaderboard.png"
import contact from "../assets/home/Envelope.png"

const navLinks = [
	{ icon: comp, label: "แข่งขัน", href: "/competition" },
	{ icon: story, label: "เนื้อเรื่อง", href: "/story" },
	{ icon: leaderboard, label: "ตารางคะแนน", href: "/leaderboard" },
	{ icon: contact, label: "ติดต่อเรา", href: "/contact" },
]

export default function Navbar() {
	return (
		<nav className="sticky top-0 my-4 z-50 w-full px-4 py-0">
			<div
			
        className="  relative mx-auto flex max-w-6xl items-center justify-between
      overflow-hidden rounded-full
      border border-white/20
      bg-white/[0.10]
      px-12 py-3

      backdrop-blur-xl
      backdrop-saturate-150

      shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
			>
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


    <div
      className="
        pointer-events-none absolute inset-x-6 top-0
        h-px
        bg-white/40
      "
    />
		

				<a
    href="/"
    className="
        group relative shrink-0
        transition-all duration-300 ease-out
        hover:-translate-y-1
    "
>
    <img
        src={logo}
        alt="Brand Logo"
        className="
            h-14 w-auto
            transition-all duration-500 ease-out

            group-hover:scale-105
            group-hover:rotate-[-2deg]
            group-hover:drop-shadow-[0_0_10px_rgba(176,20,20,0.45)]
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

				
				<div className="flex">
					<div className="hidden items-center gap-8 md:flex mx-10">
					{navLinks.map(({ icon, label, href }) => (
						<a
							key={label}
							href={href}
							className="
							group relative flex flex-col items-center gap-1
							text-[#B01414]

							transition-all duration-300 ease-out
							hover:-translate-y-1
						"
						>
							<img
								src={icon}
								alt=""
								className="
    h-7 w-7 opacity-90
    transition-all duration-300 ease-out

    group-hover:scale-110
    group-hover:-rotate-3
    group-hover:opacity-100
    group-hover:drop-shadow-[0_0_6px_rgba(176,20,20,0.5)]
"
							/>
							<span
    className="
        relative text-xs font-medium
        transition-all duration-300
        after:absolute after:-bottom-1 after:left-1/2
        after:h-[2px] after:w-0
        after:-translate-x-1/2
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

				<div className="flex items-center gap-10">
					<span className="hidden h-6 w-px bg-[#B01414]/40 md:block" />
				<a href="/login"><button
    className="
        group relative overflow-hidden
        bg-[#B01414] px-6 py-2.5 text-sm text-white

        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        hover:bg-[#C51A1A]
        active:translate-y-0
        active:shadow-[0_0_10px_rgba(176,20,20,0.3)]
    "
>

    <span
        className="
            pointer-events-none absolute inset-y-0 -left-1/2 w-1/3
            rotate-12 bg-white/20
            transition-all duration-500
            group-hover:left-[120%]
        "
    />


    <span className="relative">
        เข้าสู่ระบบ
    </span>
</button></a>
				</div>
				</div>


			</div>
		</nav>
	)
}