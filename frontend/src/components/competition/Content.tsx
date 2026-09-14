import { useEffect, useRef, useState } from "react"
import { Search, ChevronDown, Clock, Lock, Swords, Orbit } from "lucide-react"
import Reveal from "../effects/Reveal"

type Difficulty = "Easy" | "Medium" | "Hard"
type Variant = "matrix" | "lock" | "knife"

type Challenge = {
	id: number
	title: string
	difficulty: Difficulty
	time: string
	variant: Variant
}

const challenges: Challenge[] = Array.from({ length: 10 }).map((_, i) => {
	const set: Omit<Challenge, "id">[] = [
		{ title: "Cybersecurity 101", difficulty: "Easy", time: "45 min", variant: "matrix" },
		{ title: "W1SEman", difficulty: "Medium", time: "45 min", variant: "lock" },
		{ title: "Endpoint investigation", difficulty: "Hard", time: "45 min", variant: "knife" },
	]
	return { id: i + 1, ...set[i % set.length] }
})

const difficultyColor: Record<Difficulty, string> = {
	Easy: "text-green-500",
	Medium: "text-orange-500",
	Hard: "text-red-600",
}

const variantBg: Record<Variant, string> = {
	matrix: "bg-gradient-to-br from-emerald-900 via-emerald-700 to-black",
	lock: "bg-gradient-to-br from-violet-900 via-purple-600 to-purple-900",
	knife: "bg-gradient-to-br from-red-800 via-red-600 to-red-900",
}

const variantIcon: Record<Variant, React.ElementType> = {
	matrix: Orbit,
	lock: Lock,
	knife: Swords,
}

/* =============================================================
   Count-up hook (same easing pattern as Statistic.tsx)
============================================================= */

function useCountUp(end: number, start: boolean, duration = 1200) {
	const [value, setValue] = useState(0)
	const startedRef = useRef(false)

	useEffect(() => {
		if (!start || startedRef.current) return
		startedRef.current = true

		let rafId: number
		const startTime = performance.now()

		const tick = (now: number) => {
			const elapsed = now - startTime
			const progress = Math.min(elapsed / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			setValue(Math.round(eased * end))

			if (progress < 1) {
				rafId = requestAnimationFrame(tick)
			} else {
				setValue(end)
			}
		}

		rafId = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafId)
	}, [start, end, duration])

	return value
}

function CountUp({ end, start, duration }: { end: number; start: boolean; duration?: number }) {
	return <>{useCountUp(end, start, duration)}</>
}

/* =============================================================
   Competition Page
============================================================= */

export default function Content() {
	const heroRef = useRef<HTMLDivElement>(null)
	const [inView, setInView] = useState(false)

	const wonCount = 4
	const totalCount = 10
	const easyCount = 2
	const mediumCount = 4
	const hardCount = 4

	useEffect(() => {
		const el = heroRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.3 }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<>
			{/* =====================================================
			    Hero
			    - Sits at the very top of the page (no top margin/offset)
			    - z-0 so the absolutely-positioned Navbar (z-50) floats
			      on top of it
			    - pt-32/pt-40 gives clearance under the floating navbar
			      pill, since it's `absolute` (out of flow) and no longer
			      pushes this section down on its own
			====================================================== */}
			<section
				className="top-0 absolute w-full z-0 overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pt-40"
				style={{
					background: "linear-gradient(135deg, #3D3D3D 0%, #1e1e1e 100%)",
				}}
			>
				{/* decorative "</>" background motif */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[26rem] font-bold leading-none text-white/[0.04] sm:text-[32rem]"
				>
					{"</>"}
				</span>

				<div ref={heroRef} className="relative z-10 mx-auto max-w-6xl">
					<h1 className="text-7xl font-bold text-white sm:text-6xl">Challenges</h1>
					<p className="mt-2 text-3xl text-white/70">สำรวจความท้าทายผ่านโจทย์!</p>

					<div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
						{/* progress bar */}
						<div className="flex gap-2">
							{Array.from({ length: totalCount }).map((_, i) => (
								<span
									key={i}
									className={`h-10 w-6 rounded-sm transition-colors duration-500 ${
										i < wonCount ? "bg-[#B01414]" : "bg-white/15"
									}`}
									style={{ transitionDelay: `${i * 60}ms` }}
								/>
							))}
						</div>

						<div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-white">
							<div className="flex flex-col">
								<span className="text-sm text-white/60">ชนะแล้ว</span>
								<p className="text-4xl font-bold text-white">
									<CountUp end={wonCount} start={inView} />/
									<CountUp end={totalCount} start={inView} />
								</p>
							</div>

							<span className="hidden h-10 w-px bg-white/20 sm:block" />

							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">
									<CountUp end={easyCount} start={inView} />
								</span>
								<span className="text-xs leading-tight text-white/70">
									โจทย์
									<br />
									ง่าย
								</span>
							</div>

							<span className="hidden h-10 w-px bg-white/20 sm:block" />

							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">
									<CountUp end={mediumCount} start={inView} />
								</span>
								<span className="text-xs leading-tight text-white/70">
									โจทย์
									<br />
									ปานกลาง
								</span>
							</div>

							<span className="hidden h-10 w-px bg-white/20 sm:block" />

							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">
									<CountUp end={hardCount} start={inView} />
								</span>
								<span className="text-xs leading-tight text-white/70">
									โจทย์
									<br />
									ยาก
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================
			    Search & Filters
			====================================================== */}
			<Reveal>
			<section className="px-6 py-6 sm:px-10 mt-80">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center">
					<div className="flex flex-1 items-center gap-3 rounded-md border border-gray-300 px-4 py-3 transition-colors focus-within:border-[#B01414]">
						<Search className="h-5 w-5 shrink-0 text-gray-400" />
						<input
							type="text"
							placeholder="ค้นหาโจทย์ หมวดหมู่ อื่นๆ"
							className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
						/>
					</div>

					<div className="flex flex-wrap gap-3">
						<FilterButton label="ประเภท" />
						<FilterButton label="ความยาก" />
						<FilterButton label="สถานะ" />
					</div>
				</div>
			</section>
			</Reveal>

			{/* =====================================================
			    Challenge Grid
			====================================================== */}
			<Reveal>
			<section className=" px-6 py-10 sm:px-10">
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{challenges.map((challenge) => (
						<ChallengeCard key={challenge.id} challenge={challenge} />
					))}
				</div>
			</section>
			</Reveal>	
		</>
	)
}

/* =============================================================
   Filter Button
============================================================= */

function FilterButton({ label }: { label: string }) {
	return (
		<button
			type="button"
			className="flex items-center gap-2 rounded-md border border-gray-300 px-5 py-3 text-sm text-gray-700 transition-colors duration-200 hover:border-[#B01414] hover:text-[#B01414]"
		>
			{label}
			<ChevronDown className="h-4 w-4" />
		</button>
	)
}

/* =============================================================
   Challenge Card
============================================================= */

function ChallengeCard({ challenge }: { challenge: Challenge }) {
	const Icon = variantIcon[challenge.variant]

	return (
		<article className="group overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
			<div
				className={`flex aspect-[2.1/1] items-center justify-center overflow-hidden rounded-lg ${
					variantBg[challenge.variant]
				}`}
			>
				<Icon
					className="h-16 w-16 text-white/80 transition-transform duration-500 group-hover:scale-110"
					strokeWidth={1.5}
				/>
			</div>

			<div className="pt-5">
				<div className="mb-2 flex items-center gap-2 text-sm">
					<span className={`font-medium ${difficultyColor[challenge.difficulty]}`}>
						{challenge.difficulty}
					</span>
					<span className="text-gray-300">|</span>
					<span className="flex items-center gap-1 text-gray-400">
						<Clock className="h-3.5 w-3.5" />
						{challenge.time}
					</span>
				</div>

				<h3 className="mb-4 text-xl font-bold text-gray-800">{challenge.title}</h3>

				<button
					type="button"
					className="rounded-md bg-[#B01414] px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#8F1010] active:scale-95"
				>
					ออกล่า
				</button>
			</div>
		</article>
	)
}