import { useEffect, useRef } from "react"
import Home from "./pages/home"

export default function App() {
  const glowRef = useRef<HTMLDivElement>(null)

  const mouse = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const current = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationFrame: number

    const animate = () => {
      // Smooth interpolation
      current.current.x +=
        (mouse.current.x - current.current.x) * 0.08

      current.current.y +=
        (mouse.current.y - current.current.y) * 0.08

      if (glowRef.current) {
        glowRef.current.style.transform = `
          translate3d(
            ${current.current.x - 160}px,
            ${current.current.y - 160}px,
            0
          )
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

        {/* Mouse glow */}
        <div
          ref={glowRef}
          className="
            absolute left-0 top-0
            h-8 w-8
            rounded-full
            bg-[#B01414]/20
            will-change-transform
          "
        />

        {/* Bubbles */}
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
        <div className="bubble bubble-4" />
        <div className="bubble bubble-5" />
        <div className="bubble bubble-6" />
      </div>

      <div className="relative min-h-screen">
        <Home />
      </div>
    </>
  )
}