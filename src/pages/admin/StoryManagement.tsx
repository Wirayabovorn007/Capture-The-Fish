import { useEffect, useMemo, useState } from "react"
import { getChallenges } from "../../services/challengeApi"
import { getAdminStory, saveStory } from "../../services/storyApi"
import type { Challenge } from "../../types/challenge"
import type { StoryAct, StoryStatus } from "../../types/story"

const newAct = (index: number): StoryAct => ({
  actId: `act-${Date.now()}-${index}`,
  title: "",
  challengeIds: [],
})

export default function StoryManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<StoryStatus>("draft")
  const [acts, setActs] = useState<StoryAct[]>([newAct(1)])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [challengeData, story] = await Promise.all([getChallenges(), getAdminStory()])
        setChallenges(challengeData)
        if (story) {
          setTitle(story.title ?? "")
          setDescription(story.description ?? "")
          setStatus(story.status ?? "published")
          setActs(story.acts?.length ? story.acts : [newAct(1)])
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

  const usedIds = useMemo(() => acts.flatMap((act) => act.challengeIds), [acts])

  const updateAct = (actIndex: number, patch: Partial<StoryAct>) => {
    setActs((current) => current.map((act, index) => index === actIndex ? { ...act, ...patch } : act))
  }

  const addChallenge = (actIndex: number) => {
    setActs((current) => current.map((act, index) => index === actIndex ? { ...act, challengeIds: [...act.challengeIds, ""] } : act))
  }

  const updateChallenge = (actIndex: number, itemIndex: number, challengeId: string) => {
    setActs((current) => current.map((act, index) => index === actIndex ? {
      ...act,
      challengeIds: act.challengeIds.map((id, i) => i === itemIndex ? challengeId : id),
    } : act))
  }

  const removeChallenge = (actIndex: number, itemIndex: number) => {
    setActs((current) => current.map((act, index) => index === actIndex ? {
      ...act,
      challengeIds: act.challengeIds.filter((_, i) => i !== itemIndex),
    } : act))
  }

  const moveChallenge = (actIndex: number, itemIndex: number, direction: -1 | 1) => {
    setActs((current) => current.map((act, index) => {
      if (index !== actIndex) return act
      const next = itemIndex + direction
      if (next < 0 || next >= act.challengeIds.length) return act
      const ids = [...act.challengeIds]
      ;[ids[itemIndex], ids[next]] = [ids[next], ids[itemIndex]]
      return { ...act, challengeIds: ids }
    }))
  }

  const moveAct = (index: number, direction: -1 | 1) => {
    setActs((current) => {
      const next = index + direction
      if (next < 0 || next >= current.length) return current
      const copy = [...current]
      ;[copy[index], copy[next]] = [copy[next], copy[index]]
      return copy
    })
  }

  const handleSave = async () => {
    setMessage("")
    if (!title.trim() || !description.trim()) return setMessage("กรุณากรอกชื่อ Story และเนื้อเรื่อง")
    if (!acts.length) return setMessage("Story ต้องมีอย่างน้อย 1 Act")
    if (acts.some((act) => !act.title.trim())) return setMessage("กรุณากรอกชื่อ Act ให้ครบ")
    if (acts.some((act) => act.challengeIds.length === 0 || act.challengeIds.some((id) => !id))) return setMessage("แต่ละ Act ต้องมี Challenge อย่างน้อย 1 ข้อและเลือก Challenge ให้ครบ")
    const ids = acts.flatMap((act) => act.challengeIds)
    if (new Set(ids).size !== ids.length) return setMessage("Challenge ใน Story ห้ามซ้ำกัน")

    try {
      setSaving(true)
      await saveStory({
        title: title.trim(),
        description: description.trim(),
        status,
        acts: acts.map((act, index) => ({
          actId: act.actId || `act-${index + 1}`,
          title: act.title.trim(),
          challengeIds: act.challengeIds,
        })),
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
        <p className="mt-1 text-sm text-[#77716e]">สร้าง Act และจัดลำดับ Challenge ได้อย่างอิสระ โดยใช้รูปแบบเดิมของ Story Mode</p>
      </div>

      <div className="space-y-6">
        <Field label="ชื่อ Story Mode"><input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 w-full rounded-xl border border-[#d8d2cf] px-4 text-sm outline-none focus:border-[#b01414]" placeholder="เช่น The Deep Sea Incident" /></Field>
        <Field label="Story / Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="w-full resize-y rounded-xl border border-[#d8d2cf] px-4 py-3 text-sm outline-none focus:border-[#b01414]" placeholder="เนื้อเรื่องหลักของ Story Mode" /></Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as StoryStatus)} className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]">
            <option value="draft">Draft - ผู้เล่นยังไม่เห็น</option>
            <option value="published">Published - แสดง Story ให้ผู้เล่น</option>
          </select>
        </Field>

        {acts.map((act, actIndex) => (
          <div key={act.actId} className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-[#403a38]">Act {toRoman(actIndex + 1)}</h3>
                <input value={act.title} onChange={(e) => updateAct(actIndex, { title: e.target.value })} className="mt-3 h-12 w-full rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]" placeholder={`ชื่อ Act ${toRoman(actIndex + 1)}`} />
              </div>
              <div className="flex gap-2">
                <SmallButton disabled={actIndex === 0} onClick={() => moveAct(actIndex, -1)}>↑</SmallButton>
                <SmallButton disabled={actIndex === acts.length - 1} onClick={() => moveAct(actIndex, 1)}>↓</SmallButton>
                <button type="button" disabled={acts.length === 1} onClick={() => setActs((current) => current.filter((_, i) => i !== actIndex))} className="h-10 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 disabled:opacity-40">ลบ Act</button>
              </div>
            </div>

            <div className="space-y-3">
              {act.challengeIds.map((challengeId, itemIndex) => {
                const selected = challengeMap.get(challengeId)
                return (
                  <div key={`${act.actId}-${itemIndex}`} className="grid gap-3 rounded-xl border border-[#e7e3e1] bg-white p-4 md:grid-cols-[70px_minmax(0,1fr)_auto] md:items-center">
                    <div className="text-sm font-bold text-[#b01414]">#{String(itemIndex + 1).padStart(2, "0")}</div>
                    <div className="min-w-0 overflow-hidden">
                      <select value={challengeId} onChange={(e) => updateChallenge(actIndex, itemIndex, e.target.value)} className="h-12 w-full min-w-0 rounded-xl border border-[#d8d2cf] bg-white px-4 text-sm outline-none focus:border-[#b01414]">
                        <option value="">เลือก Challenge</option>
                        {challenges.map((challenge) => <option key={challenge.challengeId} value={challenge.challengeId} disabled={challenge.challengeId !== challengeId && usedIds.includes(challenge.challengeId)}>{challenge.title} — {challenge.difficulty}</option>)}
                      </select>
                      {selected && <p className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#77716e]">{selected.category} · {selected.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <SmallButton disabled={itemIndex === 0} onClick={() => moveChallenge(actIndex, itemIndex, -1)}>↑</SmallButton>
                      <SmallButton disabled={itemIndex === act.challengeIds.length - 1} onClick={() => moveChallenge(actIndex, itemIndex, 1)}>↓</SmallButton>
                      <button type="button" onClick={() => removeChallenge(actIndex, itemIndex)} className="h-10 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600">ลบ</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <button type="button" onClick={() => addChallenge(actIndex)} className="mt-4 h-11 rounded-xl border border-[#b01414] bg-white px-4 text-sm font-semibold text-[#b01414] hover:bg-red-50">+ เพิ่ม Challenge</button>
          </div>
        ))}

        <button type="button" onClick={() => setActs((current) => [...current, newAct(current.length + 1)])} className="h-12 w-full rounded-xl border-2 border-dashed border-[#d8d2cf] text-sm font-semibold text-[#403a38] hover:border-[#b01414] hover:text-[#b01414]">+ เพิ่ม Act</button>

        {message && <div className={`rounded-xl border px-4 py-3 text-sm ${message.includes("สำเร็จ") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message}</div>}
        <div className="flex justify-end border-t border-[#eeeae8] pt-6"><button type="button" onClick={() => void handleSave()} disabled={saving} className="h-12 rounded-xl bg-[#b01414] px-7 text-sm font-semibold text-white hover:bg-[#961010] disabled:opacity-60">{saving ? "กำลังบันทึก..." : "บันทึก Story"}</button></div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="mb-2 block text-sm font-semibold text-[#403a38]">{label}</label>{children}</div> }
function SmallButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) { return <button type="button" disabled={disabled} onClick={onClick} className="h-10 w-10 rounded-lg border border-[#d8d2cf] bg-white text-sm font-bold text-[#403a38] hover:border-[#b01414] hover:text-[#b01414] disabled:opacity-30">{children}</button> }
function toRoman(value: number) { const map: [number,string][] = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]]; let n=value,out=""; for(const [v,s] of map){while(n>=v){out+=s;n-=v}} return out }
