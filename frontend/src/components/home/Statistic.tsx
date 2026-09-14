import { useEffect, useRef, useState } from "react"
import Timer from "../../assets/home/Timer.png"
import Fish from "../../assets/home/Fish.png"
import People from "../../assets/home/People.png"
import Wing from "../../assets/home/Laurel Wreath.png"

/**
 * Animates a number from 0 -> end once `start` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
function useCountUp(end: number, start: boolean, duration = 1500) {
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
		<p className="text-white text-4xl font-bold">
			{formatNumber(value)}
			{suffix}
		</p>
	)
}

export default function Statistic() {
	const [inView, setInView] = useState(false)
	const sectionRef = useRef<HTMLDivElement>(null)

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
				className="bg-[#B01414] text-white flex gap-14 my-10 py-6 justify-center"
			>
				<div className="flex gap-4 items-center">
					<img src={Wing} alt="" className="h-10" />
					<div>
						<CountUpStat end={9} start={inView} />
						<span className="text-sm">โจทย์ท้าทาย</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white md:block" />
				<div className="flex gap-4 items-center">
					<img src={People} alt="" className="h-10 " />
					<div>
						<CountUpStat end={2450} start={inView} />
						<span className="text-sm">ผู้เล่นทั่วประเทศ</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white md:block" />
				<div className="flex gap-4 items-center">
					<img src={Fish} alt="" className="h-10 " />
					<div>
						<CountUpStat end={900} start={inView} />
						<span className="text-sm">ปลาที่สะสมแล้ว</span>
					</div>
				</div>
				<span className="hidden h-auto w-px bg-white md:block" />
				<div>
					<div className="flex gap-4 items-center">
						<img src={Timer} alt="" className="h-10" />
						<div>
							<CountUpStat end={15000} start={inView} duration={2000} />
							<span className="text-sm">ชั่วโมงการเล่นรวม</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
