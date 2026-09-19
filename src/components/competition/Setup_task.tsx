import { useEffect, useRef, useState } from "react"
import { ChevronUp } from "lucide-react"
import Reveal from "../effects/Reveal"
import {
  getChallengeStatus,
  spawnChallenge,
  terminateChallenge,
} from "../../services/challengeApi"
import type { RuntimeContainer } from "../../types/challenge"

type TaskSetupProps = {
  challengeId: string
}

export default function TaskSetup({ challengeId }: TaskSetupProps) {
  const [open, setOpen] = useState(true)
  const [taskArn, setTaskArn] = useState<string | null>(null)
  const [status, setStatus] = useState("OFF")
  const [containers, setContainers] = useState<RuntimeContainer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const pollRef = useRef<number | null>(null)

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const checkStatus = async (arn: string) => {
    try {
      const result = await getChallengeStatus(challengeId, arn)
      setStatus(result.status)
      setContainers(result.containers ?? [])

      if (["RUNNING", "STOPPED", "NOT_FOUND"].includes(result.status)) {
        stopPolling()
      }

      if (result.status === "STOPPED" && result.reason) {
        setError(result.reason)
      }
    } catch (err) {
      stopPolling()
      setError(err instanceof Error ? err.message : "ไม่สามารถตรวจสอบสถานะ Lab ได้")
    }
  }

  const startPolling = (arn: string) => {
    stopPolling()
    void checkStatus(arn)
    pollRef.current = window.setInterval(() => {
      void checkStatus(arn)
    }, 3000)
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  const handleStart = async () => {
    if (loading || taskArn) return

    try {
      setLoading(true)
      setError("")
      setContainers([])
      setStatus("STARTING")

      const result = await spawnChallenge(challengeId)
      setTaskArn(result.taskArn)
      setStatus("PENDING")
      startPolling(result.taskArn)
    } catch (err) {
      setStatus("OFF")
      setError(err instanceof Error ? err.message : "ไม่สามารถเปิด Lab machine ได้")
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    if (!taskArn || loading) return

    try {
      setLoading(true)
      setError("")
      stopPolling()
      await terminateChallenge(taskArn)
      setTaskArn(null)
      setContainers([])
      setStatus("OFF")
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถหยุด Lab machine ได้")
    } finally {
      setLoading(false)
    }
  }

  const statusText = status === "OFF" ? "off" : status.toLowerCase()
  const statusClass = status === "RUNNING" ? "text-[#59ff4b]" : status === "STOPPED" ? "text-red-500" : "text-yellow-300"

  return (
    <Reveal>
      <section className="mx-20 mb-10 overflow-hidden bg-[#1d1d1d] text-white">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10"
        >
          <h2 className="text-lg font-bold">Task 1 - Setup your Virtual Environment</h2>
          <ChevronUp
            className={`h-6 w-6 transition-transform duration-300 ease-in-out ${open ? "rotate-0" : "rotate-180"}`}
            strokeWidth={3}
          />
        </button>

        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden">
            <div className={`px-10 py-14 transition-opacity duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0"}`}>
              <p className="max-w-[760px] text-[16px] leading-relaxed text-white">
                เพื่อให้ผ่านด่านนี้ไปได้สำเร็จ คุณจะต้องเปิด Virtual Environment ก่อน
                เมื่อระบบพร้อมแล้ว คุณสามารถกดเข้าใช้งาน Container ของโจทย์แต่ละตัวได้จากด้านล่าง
              </p>

              <div className="mt-12 flex items-center">
                <div className="relative z-10 flex w-[95px] flex-col gap-2">
                  <ServerUnit />
                  <ServerUnit />
                  <ServerUnit />
                </div>

                <div className="-ml-8 flex min-h-[122px] w-[503px] items-center justify-between bg-[#3a3a3a] px-6 py-5 pl-[87px]">
                  <div>
                    <h3 className="text-base font-bold text-white">Lab machine</h3>
                    <div className="mt-5 inline-flex rounded-full bg-[#292929] px-3 py-1">
                      <span className={`text-xs font-medium ${statusClass}`}>Status: {statusText}</span>
                    </div>
                  </div>

                  {!taskArn ? (
                    <button
                      type="button"
                      onClick={handleStart}
                      disabled={loading}
                      className="rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] transition-all duration-200 hover:bg-[#45e63a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "กำลังเปิด..." : "เปิด Lab machine"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStop}
                      disabled={loading}
                      className="rounded-md bg-red-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-60"
                    >
                      {loading ? "กำลังหยุด..." : "ปิด Lab machine"}
                    </button>
                  )}
                </div>
              </div>

              {status === "RUNNING" && containers.length > 0 && (
                <div className="mt-8 grid max-w-[760px] gap-3 sm:grid-cols-2">
                  {containers.map((container, index) => (
                    <div key={`${container.name}-${index}`} className="flex items-center justify-between bg-[#303030] px-5 py-4">
                      <span className="font-medium">{container.name}</span>
                      <a
                        href={container.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-[#59ff4b] px-4 py-2 text-sm font-bold text-[#111] transition-colors hover:bg-[#45e63a]"
                      >
                        เปิด Container
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

function ServerUnit() {
  return (
    <div className="relative h-[27px] w-[95px] bg-[#075776]">
      <div className="absolute left-0 top-0 h-full w-[48px] bg-[#08688b]" />
      <div className="absolute left-2 top-[9px] flex gap-2">
        <span className="h-[6px] w-[6px] bg-[#00ffb7]" />
        <span className="h-[6px] w-[6px] bg-[#ffe900]" />
      </div>
      <div className="absolute right-2 top-[9px] h-[6px] w-[25px] bg-[#a8d6df]" />
    </div>
  )
}
