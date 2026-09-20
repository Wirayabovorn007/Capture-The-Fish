import { useEffect, useRef, useState } from "react"
import { ChevronUp } from "lucide-react"
import Reveal from "../effects/Reveal"
import { getActiveChallenge, getChallengeStatus, spawnChallenge, terminateChallenge } from "../../services/challengeApi"
import type { RuntimeContainer } from "../../types/challenge"

type TaskSetupProps = { challengeId: string }

export default function TaskSetup({ challengeId }: TaskSetupProps) {
  const [open, setOpen] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
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

  const checkStatus = async (id: string) => {
    try {
      const result = await getChallengeStatus(challengeId, id)
      setStatus(result.status)
      setContainers(result.containers ?? [])
      if (["RUNNING", "STOPPED", "NOT_FOUND"].includes(result.status)) stopPolling()
      if (result.status === "STOPPED" && result.reason) setError(result.reason)
    } catch (err) {
      stopPolling()
      setError(err instanceof Error ? err.message : "ไม่สามารถตรวจสอบสถานะ Lab ได้")
    }
  }

  const startPolling = (id: string) => {
    stopPolling()
    void checkStatus(id)
    pollRef.current = window.setInterval(() => void checkStatus(id), 3000)
  }

  useEffect(() => {
    let cancelled = false

    const restoreSession = async () => {
      try {
        const result = await getActiveChallenge(challengeId)

        if (cancelled) return

        if (result.hasActive && result.sessionId) {
          setSessionId(result.sessionId)
          setStatus("PENDING")
          startPolling(result.sessionId)
        } else {
          setSessionId(null)
          setContainers([])
          setStatus("OFF")
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "ไม่สามารถตรวจสอบ Lab session เดิมได้"
          )
        }
      }
    }

    void restoreSession()

    return () => {
      cancelled = true
      stopPolling()
    }
  }, [challengeId])

  const handleStart = async () => {
    if (loading || sessionId) return
    try {
      setLoading(true); setError(""); setContainers([]); setStatus("STARTING")
      const result = await spawnChallenge(challengeId)
      setSessionId(result.sessionId)
      setStatus("PENDING")
      startPolling(result.sessionId)
    } catch (err) {
      setStatus("OFF")
      setError(err instanceof Error ? err.message : "ไม่สามารถเปิด Lab machine ได้")
    } finally { setLoading(false) }
  }

  const handleStop = async () => {
    if (!sessionId || loading) return
    try {
      setLoading(true); setError(""); stopPolling()
      await terminateChallenge(sessionId)
      setSessionId(null); setContainers([]); setStatus("OFF")
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถหยุด Lab machine ได้")
    } finally { setLoading(false) }
  }

  const statusText = status === "OFF" ? "off" : status.toLowerCase()
  const statusClass = status === "RUNNING" ? "text-[#59ff4b]" : status === "STOPPED" ? "text-red-500" : "text-yellow-300"

  return (
    <Reveal>
      <section className="mx-20 mb-10 overflow-hidden bg-[#1d1d1d] text-white">
        <button type="button" onClick={() => setOpen((prev) => !prev)} className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10">
          <h2 className="text-lg font-bold">Task 1 - Setup your Virtual Environment</h2>
          <ChevronUp className={`h-6 w-6 transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`} strokeWidth={3} />
        </button>
        <div className={`grid transition-[grid-template-rows] duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="min-h-0 overflow-hidden">
            <div className={`px-10 py-14 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}>
              <p className="max-w-[900px] text-[16px] leading-relaxed text-white opacity-100">เปิด Lab เพื่อเริ่มต้น Environment เมื่อระบบพร้อมแล้ว จะแสดงเฉพาะ Container ที่สามารถเข้าถึงผ่าน Browser ได้ ส่วน Container ภายในจะต้องค้นหาและเข้าถึงผ่าน Lab Network</p>
              <div className="mt-12 flex items-center">
                <div className="relative z-10 flex w-[95px] flex-col gap-2"><ServerUnit/><ServerUnit/><ServerUnit/></div>
                <div className="-ml-8 flex min-h-[122px] w-[503px] items-center justify-between bg-[#3a3a3a] px-6 py-5 pl-[87px]">
                  <div><h3 className="text-base font-bold">Lab environment</h3><div className="mt-5 inline-flex rounded-full bg-[#292929] px-3 py-1"><span className={`text-xs font-medium ${statusClass}`}>Status: {statusText}</span></div></div>
                  {!sessionId ? <button type="button" onClick={handleStart} disabled={loading} className="rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] disabled:opacity-60">{loading ? "กำลังเปิด..." : "เปิด Lab"}</button> : <button type="button" onClick={handleStop} disabled={loading} className="rounded-md bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "กำลังหยุด..." : "ปิด Lab"}</button>}
                </div>
              </div>
              {status === "RUNNING" && containers.length > 0 && (
                <div className="mt-8 grid max-w-[900px] gap-3 sm:grid-cols-2">
                  {containers
                    .filter((container) => container.accessType !== "none")
                    .map((container, index) => (
                      <div key={`${container.name}-${index}`} className="bg-[#303030] px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-medium">{container.name}</div>
                          {container.url ? (
                            <a href={container.url} target="_blank" rel="noreferrer" className="rounded-md bg-[#59ff4b] px-4 py-2 text-sm font-bold text-[#111]">
                              {container.buttonLabel || (container.accessType === "terminal" ? "Open Terminal" : "Open Website")}
                            </a>
                          ) : (
                            <span className="rounded bg-[#252525] px-3 py-2 text-xs text-yellow-300">Preparing...</span>
                          )}
                        </div>
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
  return <div className="relative h-[27px] w-[95px] bg-[#075776]"><div className="absolute left-0 top-0 h-full w-[48px] bg-[#08688b]"/><div className="absolute left-2 top-[9px] flex gap-2"><span className="h-[6px] w-[6px] bg-[#00ffb7]"/><span className="h-[6px] w-[6px] bg-[#ffe900]"/></div><div className="absolute right-2 top-[9px] h-[6px] w-[25px] bg-[#a8d6df]"/></div>
}
