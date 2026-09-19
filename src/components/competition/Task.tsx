import { useState } from "react"
import type { FormEvent } from "react"
import { ChevronUp } from "lucide-react"
import Reveal from "../effects/Reveal"
import { submitFlag } from "../../services/challengeApi"

type TaskProps = {
  challengeId: string
}

export default function Task({ challengeId }: TaskProps) {
  const [open, setOpen] = useState(true)
  const [flag, setFlag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<"correct" | "incorrect" | "">("")
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!flag.trim() || submitting) return

    try {
      setSubmitting(true)
      setError("")
      setResult("")
      const response = await submitFlag(challengeId, flag.trim())
      setResult(response.correct ? "correct" : "incorrect")
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถตรวจสอบ Flag ได้")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Reveal>
      <section className="mx-20 my-10 overflow-hidden bg-[#1d1d1d] text-white">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10"
        >
          <h2 className="font-mono text-lg font-bold">Task 2 - Capture the Fish!</h2>
          <ChevronUp
            className={`h-6 w-6 transition-transform duration-300 ease-in-out ${open ? "rotate-0" : "rotate-180"}`}
            strokeWidth={3}
          />
        </button>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden">
            <div className={`px-10 py-14 transition-opacity duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0"}`}>
              <p className="text-white">ค้นหา Flag จาก Challenge แล้วนำมาตอบในช่องด้านล่าง</p>

              <form onSubmit={handleSubmit} className="my-4 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={flag}
                  onChange={(event) => {
                    setFlag(event.target.value)
                    setResult("")
                    setError("")
                  }}
                  placeholder="รูปแบบคำตอบ: flag{*****}"
                  className="w-[500px] max-w-full rounded-md border border-white bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#59ff4b] placeholder:text-gray-400"
                />

                <button
                  type="submit"
                  disabled={submitting || !flag.trim()}
                  className="rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] transition-all duration-200 hover:bg-[#45e63a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "กำลังตรวจสอบ..." : "Submit Flag"}
                </button>
              </form>

              {result === "correct" && <p className="mt-3 font-bold text-[#59ff4b]">Correct Flag!</p>}
              {result === "incorrect" && <p className="mt-3 font-bold text-red-400">Incorrect Flag</p>}
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
