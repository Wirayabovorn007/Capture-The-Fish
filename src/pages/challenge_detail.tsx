import {
  useEffect,
  useRef,
  useState,
} from "react"

import { useSearchParams } from "react-router-dom"

import TaskSetup from "../components/competition/Setup_task"
import Task from "../components/competition/Task"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import { getChallenge } from "../services/challengeApi"
import type { Challenge } from "../types/challenge"

/* =============================================================
   Challenge Detail
============================================================= */

export default function Challenge_detail() {
  const heroRef = useRef<HTMLDivElement>(null)

  const [searchParams] = useSearchParams()
  const challengeId = searchParams.get("id")

  const [challenge, setChallenge] =
    useState<Challenge | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  /* =============================================================
     Load Challenge
  ============================================================= */

  useEffect(() => {
    const loadChallenge = async () => {
      if (!challengeId) {
        setError("ไม่พบ Challenge ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const data =
          await getChallenge(challengeId)

        setChallenge(data)
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : "ไม่สามารถโหลด Challenge ได้"
        )
      } finally {
        setLoading(false)
      }
    }

    void loadChallenge()
  }, [challengeId])

  /* =============================================================
     Loading
  ============================================================= */

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p>กำลังโหลด Challenge...</p>
        </div>
      </>
    )
  }

  /* =============================================================
     Error
  ============================================================= */

  if (error || !challenge) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-600">
            {error || "ไม่พบ Challenge"}
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="absolute w-full">

        <Navbar />

        {/* =====================================================
            Hero
        ====================================================== */}

        <section
          className="top-0 absolute w-full z-0 overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pt-40"
          style={{
            background:
              "linear-gradient(135deg, #3D3D3D 0%, #1e1e1e 100%)",
          }}
        >
          {/* decorative "</>" background motif */}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[26rem] font-bold leading-none text-white/[0.04] sm:text-[32rem]"
          >
            {"</>"}
          </span>

          <div
            ref={heroRef}
            className="relative z-10 mx-auto max-w-6xl"
          >
            <h1 className="text-7xl font-bold text-white sm:text-6xl">
              {challenge.title}
            </h1>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">

              <div className="text-white">

                <p className="text-lg text-white">
                  Difficulty:{" "}
                  {challenge.difficulty}
                  <br />

                  Category:{" "}
                  {challenge.category}
                </p>

                <p className="mt-10 text-white">
                  {challenge.description}
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            Challenge Information
        ====================================================== */}

        <section className="text-[#3C3232] mx-36 mt-[500px] flex flex-col gap-y-10 mb-64">

          {/* Description */}

          <div>
            <h1 className="font-bold text-xl">
              Description
            </h1>

            <p>
              {challenge.description}
            </p>
          </div>

          {/* Objective */}

          <div>
            <h1 className="font-bold text-xl">
              Objective
            </h1>

            <p>
              {challenge.objective ||
                "ยังไม่มี Objective"}
            </p>
          </div>

          {/* Hints */}

          <div>
			<h1 className="font-bold text-xl">
				Hints
			</h1>

			{challenge.hint?.trim() ? (
				<ul className="list-disc pl-6 space-y-2">
				{challenge.hint
					.split(",")
					.map((hint) => hint.trim())
					.filter(Boolean)
					.map((hint, index) => (
					<li key={index}>
						{hint}
					</li>
					))}
				</ul>
			) : (
				<p>ยังไม่มี Hint</p>
			)}
			</div>

          {/* Flag Format - Static */}

          <div>
            <h1 className="font-bold text-xl">
              Flag format
            </h1>

            <p>
              flag&#123;*****&#125;
            </p>
          </div>

        </section>

        {/* =====================================================
            Task
        ====================================================== */}

        <section>
          <TaskSetup />
          <Task />
        </section>

        <Footer />

      </div>
    </>
  )
}