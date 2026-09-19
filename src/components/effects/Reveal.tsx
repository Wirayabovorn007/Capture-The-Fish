import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealProps {
	children: ReactNode
	/** Extra delay in ms, useful for staggering a few sections */
	delay?: number
	className?: string
}

/**
 * Fades and slides a section up into place the first time it
 * scrolls into view. Fires once (via IntersectionObserver) and
 * then leaves the DOM untouched, so it never fights with any
 * animation already happening inside the children (e.g. the
 * count-up in Statistic, button hover states in First_arc).
 *
 * Respects prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.15 }
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<div
			ref={ref}
			style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
			className={`
				transition-all duration-700 ease-out
				motion-reduce:transition-none motion-reduce:transform-none
				${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
				${className}
			`}
		>
			{children}
		</div>
	)
}
