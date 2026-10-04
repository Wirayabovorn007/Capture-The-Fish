import {
  useEffect,
  useRef,
  useState,
} from "react"

import { useLocation, useSearchParams } from "react-router-dom"

import TaskSetup from "../components/competition/Setup_task"
import Task from "../components/competition/Task"

import Navbar from "../components/Navbar"
import AdminNavbar from "../components/admin/Navbar"
import Footer from "../components/Footer"
import FlagSuccessPopup from "../components/popup/FlagSuccessPopup"

import { getChallenge } from "../services/challengeApi"
import type { Challenge as BaseChallenge, FishReward, SubmitFlagResponse } from "../types/challenge"

type Challenge = BaseChallenge

/* =============================================================
   Challenge Detail
============================================================= */

export default function Challenge_detail() {
  const heroRef = useRef<HTMLDivElement>(null)

  const [searchParams] = useSearchParams()
  const location = useLocation()
  const isAdminView = location.pathname.startsWith("/admin/")
  const PageNavbar = isAdminView ? AdminNavbar : Navbar
  const challengeId = searchParams.get("id")

  const [challenge, setChallenge] =
    useState<Challenge | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [showSuccessPopup, setShowSuccessPopup] =
    useState(false)

  const [earnedReward, setEarnedReward] =
    useState<FishReward | undefined>(undefined)

  const [firstSolve, setFirstSolve] =
    useState(false)

  const [totalFish, setTotalFish] =
    useState(0)

  const handleFlagSuccess = (response: SubmitFlagResponse) => {
    setEarnedReward(response.reward ?? undefined)
    setFirstSolve(response.firstSolve)
    setTotalFish(response.totalFish)
    setShowSuccessPopup(true)
  }

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
        <PageNavbar />

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
        <PageNavbar />

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

        <PageNavbar />

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

          {/* Fish Reward */}
          {challenge.fishReward && (
            <div>
              <h1 className="font-bold text-xl">Fish Reward</h1>
              <div className="mt-4 flex max-w-xl items-center gap-5 rounded-2xl border border-[#e5e1df] bg-white p-5 shadow-sm">
                <img src={challenge.fishReward.imageUrl} alt={challenge.fishReward.name} className="h-28 w-28 rounded-xl object-contain" />
                <div>
                  <p className="text-xl font-bold text-[#403a38]">{challenge.fishReward.name}</p>
                  <p className="mt-2 text-sm text-[#77716e]">จำนวน ×{challenge.fishReward.amount}</p>
                  <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${challenge.fishReward.rarity === "ultimate" ? "bg-red-100 text-red-700" : challenge.fishReward.rarity === "rare" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                    {challenge.fishReward.rarity === "ultimate" ? "ULTIMATE" : challenge.fishReward.rarity === "rare" ? "RARE" : "COMMON"}
                  </span>
                </div>
              </div>
            </div>
          )}

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
          <TaskSetup challengeId={challenge.challengeId} />
          <Task
            challengeId={challenge.challengeId}
            onFlagSuccess={handleFlagSuccess}
          />
        </section>

        <Footer />

        <FlagSuccessPopup
          open={showSuccessPopup}
          fishReward={earnedReward}
          firstSolve={firstSolve}
          totalFish={totalFish}
          onClose={() => setShowSuccessPopup(false)}
        />

      </div>
    </>
  )
}