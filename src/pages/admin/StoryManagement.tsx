import { useEffect, useMemo, useState } from "react"
import { getChallenges } from "../../services/challengeApi"
import { getStory, saveStory } from "../../services/storyApi"
import type { Challenge } from "../../types/challenge"

const EMPTY_SLOTS = Array(10).fill("")

export default function StoryManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [actOneTitle, setActOneTitle] = useState("")
  const [actTwoTitle, setActTwoTitle] = useState("")
  const [challengeIds, setChallengeIds] = useState<string[]>([...EMPTY_SLOTS])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [challengeData, story] = await Promise.all([getChallenges(), getStory()])
        setChallenges(challengeData)
        if (story) {
          setTitle(story.title ?? "")
          setDescription(story.description ?? "")
          setActOneTitle(story.actOneTitle ?? "")
          setActTwoTitle(story.actTwoTitle ?? "")
          setChallengeIds([...story.challengeIds, ...EMPTY_SLOTS].slice(0, 10))
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "โหลด Story ไม่สำเร็จ")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const challengeMap = useMemo(
    () => new Map(challenges.map((challenge) => [challenge.challengeId, challenge])),
    [challenges],
  )

  const updateSlot = (index: number, challengeId: string) => {
    setChallengeIds((current) =>
      current.map((value, slotIndex) => slotIndex === index ? challengeId : value),
    )
  }

  const handleSave = async () => {
    setMessage("")
    if (!title.trim() || !description.trim() || !actOneTitle.trim() || !actTwoTitle.trim()) {
      setMessage("กรุณากรอกชื่อ Story, เนื้อเรื่อง และชื่อ Act ให้ครบ")
      return
    }
    if (challengeIds.some((id) => !id)) {
      setMessage("กรุณาเลือก Challenge ให้ครบทั้ง 10 ช่อง")
      return
    }
    if (new Set(challengeIds).size !== 10) {
      setMessage("Challenge ใน Story ห้ามซ้ำกัน")
      return
    }

    try {
      setSaving(true)
      await saveStory({
        title: title.trim(),
        description: description.trim(),
        actOneTitle: actOneTitle.trim(),
        actTwoTitle: actTwoTitle.trim(),
        challengeIds,
      })
      setMessage("บันทึก Story สำเร็จ")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "บันทึก Story ไม่สำเร็จ")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="rounded-2xl border border-[#e5e1df] bg-white p-8 text-center text-sm text-[#77716e]">กำลังโหลด Story...</div>

  return (
    <section className="rounded-2xl border border-[#e5e1df] bg-white p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">Story Management</p>
        <h2 className="mt-2 text-2xl font-bold text-[#403a38]">จัดการ Story Mode</h2>
        <p className="mt-1 text-sm text-[#77716e]">กำหนดเนื้อเรื่องและเรียง Challenge 10 ข้อสำหรับ Story Mode</p>
      </div>

      <div className="space-y-6">
        <Field label="ชื่อ Story Mode">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 w-full rounded-xl border border-[#d8d2cf] px-4 text-sm outline-none focus:border-[#b01414]" placeholder="เช่น The Deep Sea Incident" />
        </Field>
        <Field label="Story / Description">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="w-full resize-y rounded-xl border border-[#d8d2cf] px-4 py-3 text-sm outline-none focus:border-[#b01414]" placeholder="เนื้อเรื่องหลักของ Story Mode" />
        </Field>

        <ActEditor title="Act I" value={actOneTitle} onChange={setActOneTitle} start={0} end={6} challengeIds={challengeIds} challenges={challenges} challengeMap={challengeMap} updateSlot={updateSlot} />
        <ActEditor title="Act II" value={actTwoTitle} onChange={setActTwoTitle} start={6} end={10} challengeIds={challengeIds} challenges={challenges} challengeMap={challengeMap} updateSlot={updateSlot} />

        {message && <div className={`rounded-xl border px-4 py-3 text-sm ${message.includes("สำเร็จ") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message}</div>}

        <div className="flex justify-end border-t border-[#eeeae8] pt-6">
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="h-12 rounded-xl bg-[#b01414] px-7 text-sm font-semibold text-white hover:bg-[#961010] disabled:opacity-60">
            {saving ? "กำลังบันทึก..." : "บันทึก Story"}
          </button>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-sm font-semibold text-[#403a38]">{label}</label>{children}</div>
}

function ActEditor({
  title, value, onChange, start, end, challengeIds, challenges, challengeMap, updateSlot,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  start: number
  end: number
  challengeIds: string[]
  challenges: Challenge[]
  challengeMap: Map<string, Challenge>
  updateSlot: (index: number, challengeId: string) => void
}) {
  return (
    <div className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-[#403a38]">{title}</h3>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-3 h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]" placeholder={`ชื่อ ${title}`} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: end - start }, (_, offset) => start + offset).map((index) => {
          const selected = challengeMap.get(challengeIds[index])
          return (
            <div key={index} className="grid gap-3 rounded-xl border border-[#e7e3e1] bg-white p-4 md:grid-cols-[70px_1fr] md:items-center">
              <div className="text-sm font-bold text-[#b01414]">#{String(index + 1).padStart(2, "0")}</div>
              <div className="min-w-0 overflow-hidden">
                <select
                  value={challengeIds[index]}
                  onChange={(e) => updateSlot(index, e.target.value)}
                  className="h-12 w-full min-w-0 rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]"
                >
                  <option value="">เลือก Challenge</option>
                  {challenges.map((challenge) => {
                    const usedElsewhere = challengeIds.some(
                      (id, i) => i !== index && id === challenge.challengeId,
                    )

                    return (
                      <option
                        key={challenge.challengeId}
                        value={challenge.challengeId}
                        disabled={usedElsewhere}
                      >
                        {challenge.title} — {challenge.difficulty}
                      </option>
                    )
                  })}
                </select>

                {selected && (
                  <p className="mt-2 min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#77716e]">
                    {selected.category} · {selected.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
