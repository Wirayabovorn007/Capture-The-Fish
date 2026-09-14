import { useRef, useEffect } from "react"
import Shark from "../../assets/global/shark.png"

export default function Styles(){
	  const sharkRef = useRef<HTMLDivElement>(null)

  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const current = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const currentAngle = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationFrame: number

    const animate = () => {
      // Smooth movement
      current.current.x +=
        (mouse.current.x - current.current.x) * 0.08

      current.current.y +=
        (mouse.current.y - current.current.y) * 0.08

      // Direction toward mouse
      const dx = mouse.current.x - current.current.x
      const dy = mouse.current.y - current.current.y

      const targetAngle =
        Math.atan2(dy, dx) * (180 / Math.PI)

      // Smooth rotation with wrap-around handling
      let delta = targetAngle - currentAngle.current

      delta = ((delta + 180) % 360) - 180

      currentAngle.current += delta * 0.08

      if (sharkRef.current) {
        sharkRef.current.style.transform = `
          translate3d(
            ${current.current.x - 48}px,
            ${current.current.y - 48}px,
            0
          )
          rotate(${currentAngle.current}deg)
        `
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [])
	return (
		<>
			  {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-5
            bg-[linear-gradient(to_right,#B01414_1px,transparent_1px),linear-gradient(to_bottom,#B01414_1px,transparent_1px)]
            bg-[size:100px_100px]
          "
        />

        {/* Shark */}
      
{/* Shark + water */}
<div
  ref={sharkRef}
  className="
    absolute
    left-0
    top-0
    h-24
    w-24
    origin-center
    will-change-transform
  "
>
  {/* Water wake */}
  <div className="absolute inset-0 pointer-events-none">
    <span className="wake wake-1" />
    <span className="wake wake-2" />
    <span className="wake wake-3" />
    <span className="wake wake-4" />
  </div>

  {/* Shark */}
  <div className="relative flex h-full w-full items-center justify-center">
    <span
      className="
        select-none
        text-5xl
        animate-shark-swim
      "
    >
      <img src={Shark} alt="Shark cursor" className="h-12 w-auto"/>
    </span>
  </div>
</div>

        {/* Bubbles */}
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />
        <div className="bubble bubble-6" />

      </div>
		</>
	)
}