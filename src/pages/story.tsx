import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getChallenges } from "../services/challengeApi"
import { getStory } from "../services/storyApi"
import type { Challenge } from "../types/challenge"
import type { StoryAct, StoryConfig } from "../types/story"

export default function Story() {
  const [story, setStory] = useState<StoryConfig | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([getStory(), getChallenges()])
      .then(([storyData, challengeData]) => { setStory(storyData); setChallenges(challengeData) })
      .finally(() => setLoading(false))
  }, [])

  const challengeMap = useMemo(() => new Map(challenges.map((challenge) => [challenge.challengeId, challenge])), [challenges])

  if (loading) return <><Navbar /><main className="min-h-screen pt-40 text-center">กำลังโหลด Story...</main><Footer /></>
  if (!story) return <><Navbar /><main className="min-h-screen pt-40 text-center">ยังไม่ได้ตั้งค่า Story Mode</main><Footer /></>

  return (
    <>
      <Navbar />
      <style>{storyStyles}</style>
      <main className="story-page w-full overflow-hidden">
        {story.acts.map((act, actIndex) => (
          <DynamicAct
            key={act.actId}
            act={act}
            actIndex={actIndex}
            story={story}
            challengeMap={challengeMap}
            startNumber={story.acts.slice(0, actIndex).reduce((sum, item) => sum + item.challengeIds.length, 0)}
          />
        ))}
        <section className="story-treasure-section px-5 pb-20 text-white"><div className="mx-auto max-w-[1100px]"><Treasure /></div></section>
      </main>
      <Footer />
    </>
  )
}

function DynamicAct({ act, actIndex, story, challengeMap, startNumber }: { act: StoryAct; actIndex: number; story: StoryConfig; challengeMap: Map<string, Challenge>; startNumber: number }) {
  const dark = actIndex % 2 === 1
  const cards = act.challengeIds.map((id) => challengeMap.get(id)).filter((item): item is Challenge => Boolean(item))

  return (
    <section className={`story-act relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-32 sm:pt-20 lg:px-16 ${dark ? "story-act-dark text-white" : "story-act-light"}`}>
      {actIndex > 0 && <div aria-hidden="true" className={`pointer-events-none absolute -top-[1px] left-0 h-[120px] w-[120%] origin-top-left -translate-x-[2%] -translate-y-[72px] -rotate-[4deg] ${dark ? "story-transition-light" : "story-transition-dark"}`} />}
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className={`relative ${actIndex === 0 ? "min-h-[330px] sm:min-h-[390px]" : "min-h-[250px] sm:min-h-[300px]"}`}>
          {actIndex === 0 && <div className="relative z-10 max-w-[760px]"><p className="mb-3 text-sm text-[#403a38] sm:mb-4 sm:text-base">ให้การ <span className="text-[#B01414]">Cybersecurity</span> สนุกยิ่งขึ้นด้วย โหมดเนื้อเรื่อง</p><h1 className="max-w-[760px] text-4xl font-bold leading-[1.1] tracking-tight text-[#3B3535] sm:text-5xl lg:text-7xl">{story.title}</h1><p className="mt-4 max-w-[700px] whitespace-pre-line text-sm leading-[1.7] text-[#403a38] sm:mt-5 sm:text-base">{story.description}</p></div>}

          <div className={`story-act-heading ${dark ? "story-act-heading-dark" : "story-act-heading-light"}`}>
            <div aria-hidden="true" className="story-act-number">{String(actIndex + 1).padStart(2, "0")}</div>
            <h2 className="story-act-title">Act {toRoman(actIndex + 1)} – {act.title}</h2>
          </div>
        </div>

        <div className="relative mt-2">
          <div aria-hidden="true" className={dark ? "story-rail-dark" : "story-rail"} />
          <div className="relative flex flex-col gap-8 sm:gap-12 lg:gap-0">
            {cards.map((challenge, index) => <StoryTimelineCard key={challenge.challengeId} challenge={challenge} side={index % 2 === 0 ? "left" : "right"} index={startNumber + index} dark={dark} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryTimelineCard({ challenge, side, index, dark = false }: { challenge: Challenge; side: "left" | "right"; index: number; dark?: boolean }) {
  const navigate = useNavigate()
  const isLeft = side === "left"
  return (
    <div className={`story-timeline-row relative flex w-full justify-center lg:min-h-[290px] ${isLeft ? "lg:justify-start" : "lg:justify-end"}`}>
      <div aria-hidden="true" className={`story-connector ${isLeft ? "story-connector-left" : "story-connector-right"} ${dark ? "story-connector-dark" : ""} hidden lg:block`} />
      <div aria-hidden="true" className={`${dark ? "story-node-dark" : "story-node"} hidden lg:flex`}>{String(index + 1).padStart(2, "0")}</div>
      <article className={`story-card ${dark ? "story-card-dark" : ""} group relative z-10 w-full max-w-[290px] cursor-pointer rounded-lg border bg-white p-3 text-[#3B3535] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${dark ? "border-[#444]" : "border-[#F0E3E3]"} ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}`}>
        <StoryImage challenge={challenge} />
        <div className="p-3 pb-1 pt-2">
          <div className="flex items-center gap-2 text-[11px]"><span className="font-medium text-green-600">{challenge.difficulty}</span><span className="text-gray-400">●</span><span className="text-gray-400">0/1 flag</span></div>
          <h3 className="mt-1 text-xl font-bold text-[#3B3535] transition-colors duration-200 group-hover:text-[#B01414]">{challenge.title}</h3>
          <p className="mt-1 line-clamp-2 leading-[1.5] text-gray-500">{challenge.description}</p>
          <button type="button" onClick={() => navigate(`/challenge?id=${encodeURIComponent(challenge.challengeId)}`)} className="mt-2 bg-[#B01414] px-4 py-1.5 text-white transition-all duration-200 hover:bg-[#8F1010] hover:shadow-md active:scale-95">เริ่มทำ</button>
        </div>
      </article>
    </div>
  )
}

function StoryImage({ challenge }: { challenge: Challenge }) {
  return <div className="relative h-[105px] overflow-hidden rounded-sm bg-gradient-to-b from-[#112d08] via-[#257a14] to-[#3e9b25] transition-transform duration-300 group-hover:scale-[1.02]">
    {challenge.thumbnailUrl && <img src={challenge.thumbnailUrl} alt={challenge.title} className="absolute inset-0 h-full w-full object-cover" />}
    {!challenge.thumbnailUrl && <><div className="absolute left-1/2 top-1/2 h-12 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime-300/70 shadow-[0_0_25px_rgba(150,255,40,0.5)]"/><div className="absolute left-1/2 top-1/2 h-8 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-lime-300/60"/><div className="absolute bottom-[28px] left-1/2 h-[35px] w-[2px] -translate-x-1/2 bg-lime-300/50"/></>}
  </div>
}

function Treasure() { return <div className="relative flex flex-col items-center pb-4 pt-16"><div aria-hidden="true" className="absolute bottom-16 h-28 w-44 rounded-full bg-[#B01414]/10 blur-3xl"/><div className="relative h-[145px] w-[190px]"><div className="absolute left-[28px] top-[20px] h-[60px] w-[134px] rotate-[-8deg] rounded-t-[55px] border-[8px] border-[#F59B2F] bg-[#8D2222] shadow-lg"><div className="absolute left-5 right-5 top-4 h-3 rounded-full bg-[#F8B13A]"/></div><div className="absolute bottom-3 left-[25px] h-[75px] w-[140px] rounded-b-xl border-8 border-[#F59B2F] bg-[#B83B32] shadow-xl"><div className="absolute left-0 right-0 top-4 h-5 bg-[#D95543]"/><div className="absolute left-1/2 top-1/2 h-7 w-5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#F6B933]"/></div></div><h3 className="mt-2 text-xl text-white">สมบัติใต้ทะเลลึก</h3><p className="mt-2 text-center text-xs text-gray-400">Complete the story and discover what lies beneath.</p></div> }

function toRoman(value: number) { const map: [number,string][]=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let n=value,out="";for(const[v,s]of map){while(n>=v){out+=s;n-=v}}return out }

const storyStyles = `

.story-act-heading{position:absolute;z-index:12;display:flex;width:min(460px,46vw);flex-direction:column;pointer-events:none}
.story-act-heading-light{right:0;top:40px;align-items:flex-end;text-align:right;color:#403a38}
.story-act-heading-dark{left:0;top:0;align-items:flex-start;text-align:left;color:#fff}
.story-act-number{display:block;font-size:clamp(110px,12vw,200px);font-weight:300;line-height:.78;letter-spacing:-.08em;white-space:nowrap}
.story-act-heading-light .story-act-number{color:#EFC7C7}.story-act-heading-dark .story-act-number{color:rgba(255,255,255,.28)}
.story-act-title{display:block;margin-top:10px;max-width:420px;font-size:clamp(16px,1.5vw,20px);line-height:1.45;letter-spacing:.01em;white-space:normal}.story-act-heading-light .story-act-title{padding-right:4px}.story-act-heading-dark .story-act-title{padding-left:4px}
.story-page{position:relative;background:transparent}
/* The global Grig_bg component owns the site-wide grid, shark and bubbles.
   Story must not draw another grid layer over it. */
.story-act-light{background:transparent}
.story-act-dark,.story-treasure-section{background:#1E1E1E}
.story-transition-light{background-color:#fff}
.story-transition-dark{background:#1E1E1E}

.story-rail,.story-rail-dark{position:absolute;left:50%;top:45px;bottom:70px;width:2px;transform:translateX(-50%);pointer-events:none}.story-rail{background:linear-gradient(to bottom,rgba(176,20,20,.05),rgba(176,20,20,.65) 10%,rgba(176,20,20,.65) 90%,rgba(176,20,20,.05));box-shadow:0 0 12px rgba(176,20,20,.08)}.story-rail-dark{background:linear-gradient(to bottom,rgba(255,255,255,.05),rgba(255,255,255,.65) 10%,rgba(255,255,255,.65) 90%,rgba(255,255,255,.05));box-shadow:0 0 12px rgba(255,255,255,.08)}
.story-node,.story-node-dark{position:absolute;top:66px;left:50%;z-index:30;width:28px;height:28px;transform:translate(-50%,-50%);align-items:center;justify-content:center;border-radius:9999px;font-family:monospace;font-size:10px;font-weight:700;transition:.3s}.story-node{border:2px solid #B01414;background:#fff;color:#B01414;box-shadow:0 0 0 5px rgba(176,20,20,.06),0 0 18px rgba(176,20,20,.15)}.story-node-dark{border:2px solid #fff;background:#1E1E1E;color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.05),0 0 18px rgba(255,255,255,.12)}
.story-connector{position:absolute;top:72px;height:2px;pointer-events:none}.story-connector-left{left:0;width:calc(50% - 14px);background:linear-gradient(to left,rgba(176,20,20,.7),rgba(176,20,20,.12))}.story-connector-right{left:50%;width:calc(50% - 14px);background:linear-gradient(to right,rgba(176,20,20,.7),rgba(176,20,20,.12))}.story-connector-dark.story-connector-left{background:linear-gradient(to left,rgba(255,255,255,.7),rgba(255,255,255,.08))}.story-connector-dark.story-connector-right{background:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.08))}.story-connector:after{content:"";position:absolute;top:50%;width:7px;height:7px;transform:translateY(-50%);border-radius:9999px;background:#B01414}.story-connector-left:after{left:0}.story-connector-right:after{right:0}.story-connector-dark:after{background:#fff}
.story-timeline-row:has(.story-card:hover) .story-node{transform:translate(-50%,-50%) scale(1.15);background:#B01414;color:#fff}.story-timeline-row:has(.story-card-dark:hover) .story-node-dark{transform:translate(-50%,-50%) scale(1.15);background:#fff;color:#1E1E1E}
@media(max-width:1023px){.story-node,.story-node-dark,.story-connector,.story-rail,.story-rail-dark{display:none}}
`
