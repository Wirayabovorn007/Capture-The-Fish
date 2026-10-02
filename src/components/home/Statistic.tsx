import { useEffect, useRef, useState } from "react"
import Timer from "../../assets/home/Timer.png"
import Fish from "../../assets/home/Fish.png"
import People from "../../assets/home/People.png"
import Wing from "../../assets/home/Laurel Wreath.png"
import { getPublicStatistics, type PublicStatistics } from "../../services/userApi"

/**
 * Animates a number from 0 -> end once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
function useCountUp(end: number, start: boolean, duration = 1500) {
	const [value, setValue] = useState(0)
	useEffect(() => {
		if (!start) return

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

function formatNumber(n: number) {
	return n.toLocaleString("en-US")
}

interface CountUpStatProps {
	end: number
	suffix?: string
	start: boolean
	duration?: number
}

function CountUpStat({ end, suffix = "+", start, duration }: CountUpStatProps) {
	const value = useCountUp(end, start, duration)
	return (
		<p className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
			{formatNumber(value)}
			{suffix}
		</p>
	)
}

export default function Statistic() {
	const [inView, setInView] = useState(false)
	const [stats, setStats] = useState<PublicStatistics>({
		totalChallenges: 0,
		totalPlayers: 0,
		totalFish: 0,
		totalPlayHours: 0,
		totalOnlineSeconds: 0,
	})
	const sectionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let disposed = false

		const loadStatistics = async () => {
			try {
				const data = await getPublicStatistics()
				if (!disposed) setStats(data)
			} catch (error) {
				console.error("Failed to load public statistics:", error)
			}
		}

		void loadStatistics()
		return () => {
			disposed = true
		}
	}, [])

	useEffect(() => {
		const el = sectionRef.current
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
			<div
				ref={sectionRef}
				className="bg-[#B01414] text-white flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-10 lg:gap-14 my-10 py-6 px-4 justify-center"
			>
				<div className="flex gap-3 sm:gap-4 items-center">
					<img src={Wing} alt="" className="h-8 sm:h-9 lg:h-10" />
					<div>
						<CountUpStat end={stats.totalChallenges} start={inView} />
						<span className="text-sm">โจทย์ท้าทาย</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white lg:block" />
				<div className="flex gap-3 sm:gap-4 items-center">
					<img src={People} alt="" className="h-8 sm:h-9 lg:h-10 " />
					<div>
						<CountUpStat end={stats.totalPlayers} start={inView} />
						<span className="text-sm">ผู้เล่นทั่วประเทศ</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white lg:block" />
				<div className="flex gap-3 sm:gap-4 items-center">
					<img src={Fish} alt="" className="h-8 sm:h-9 lg:h-10 " />
					<div>
						<CountUpStat end={stats.totalFish} start={inView} />
						<span className="text-sm">ปลาที่สะสมแล้ว</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white lg:block" />
				<div>
					<div className="flex gap-3 sm:gap-4 items-center">
						<img src={Timer} alt="" className="h-8 sm:h-9 lg:h-10" />
						<div>
							<CountUpStat end={stats.totalPlayHours} start={inView} duration={2000} />
							<span className="text-sm">ชั่วโมงการเล่นรวม</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}