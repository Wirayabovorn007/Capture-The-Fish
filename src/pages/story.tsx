import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAdminChallenges, getChallenges } from "../services/challengeApi";
import {
  getAdminStory,
  getStory,
  getStoryProgress,
} from "../services/storyApi";
import type { Challenge } from "../types/challenge";
import type { StoryAct, StoryConfig, StoryItem } from "../types/story";

export default function Story({ preview = false }: { preview?: boolean }) {
  const [story, setStory] = useState<StoryConfig | null>(null),
    [challenges, setChallenges] = useState<Challenge[]>([]),
    [solved, setSolved] = useState<Set<string>>(new Set()),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    void (async () => {
      try {
        const [s, c] = await Promise.all([
          preview ? getAdminStory() : getStory(),
          preview ? getAdminChallenges() : getChallenges(),
        ]);
        setStory(s);
        setChallenges(c);
        if (!preview) {
          try {
            const p = await getStoryProgress();
            setSolved(new Set(p.solvedChallengeIds));
          } catch {
            setSolved(new Set());
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [preview]);
  const map = useMemo(
    () => new Map(challenges.map((c) => [c.challengeId, c])),
    [challenges],
  );
  if (loading)
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-40 text-center">
          กำลังโหลด Story...
        </main>
        <Footer />
      </>
    );
  if (!story)
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-40 text-center">
          ยังไม่ได้ตั้งค่า Story Mode
        </main>
        <Footer />
      </>
    );
  const acts = story.acts.map(normalizeAct);
  const allChallenges = acts.flatMap((a) =>
    a.items.filter((i) => i.type === "challenge").map((i) => i.challengeId),
  );
  const completed = allChallenges.filter((id) => solved.has(id)).length;
  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <main className="story-page w-full overflow-hidden">
        {preview && (
          <div className="fixed right-4 top-24 z-[100] flex items-center gap-2">
            <div className="rounded-full bg-[#b01414] px-4 py-2 text-xs font-bold text-white shadow-lg">
              ADMIN PREVIEW
            </div>
            <button
              type="button"
              onClick={() => window.location.assign("/admin/management")}
              className="rounded-full border border-[#d8d2cf] bg-white px-4 py-2 text-xs font-bold text-[#403a38] shadow-lg hover:border-[#b01414] hover:text-[#b01414]"
            >
              ออกจาก Preview
            </button>
          </div>
        )}
        <div className="fixed bottom-5 right-5 z-40 w-[220px] rounded-xl border bg-white/95 p-3 shadow-xl backdrop-blur">
          <div className="flex justify-between text-xs font-semibold">
            <span>Story Progress</span>
            <span>
              {completed}/{allChallenges.length}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#b01414]"
              style={{
                width: `${allChallenges.length ? (completed / allChallenges.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        {acts.map((act, ai) => {
          const before = acts
            .slice(0, ai)
            .flatMap((a) =>
              a.items.filter((i) => i.type === "challenge"),
            ).length;
          return (
            <DynamicAct
              key={act.actId}
              act={act}
              actIndex={ai}
              story={story}
              challengeMap={map}
              solved={solved}
              startNumber={before}
              preview={preview}
              globalChallengeIds={allChallenges}
            />
          );
        })}
        <section className="story-treasure-section px-5 pb-20 text-white">
          <div className="mx-auto max-w-[1100px]">
            <Treasure
              complete={
                completed === allChallenges.length && allChallenges.length > 0
              }
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
function normalizeAct(a: StoryAct): StoryAct {
  return {
    ...a,
    items: a.items?.length
      ? a.items
      : (a.challengeIds ?? []).map((id) => ({
          type: "challenge" as const,
          challengeId: id,
        })),
  };
}
function DynamicAct({
  act,
  actIndex,
  story,
  challengeMap,
  solved,
  startNumber,
  preview,
  globalChallengeIds,
}: {
  act: StoryAct;
  actIndex: number;
  story: StoryConfig;
  challengeMap: Map<string, Challenge>;
  solved: Set<string>;
  startNumber: number;
  preview: boolean;
  globalChallengeIds: string[];
}) {
  const dark = actIndex % 2 === 1;
  const challengeIds = act.items
    .filter((i) => i.type === "challenge")
    .map((i) => i.challengeId);
  const done = challengeIds.filter((id) => solved.has(id)).length;
  const complete = challengeIds.length > 0 && done === challengeIds.length;
  let challengeOffset = 0;
  const rendered = act.items.map((item, index) => {
    const currentPosition = startNumber + challengeOffset;
    const unlocked =
      preview ||
      globalChallengeIds
        .slice(0, currentPosition)
        .every((id) => solved.has(id));
    if (item.type === "content") {
      return (
        <NarrativeBlock
          key={item.contentId}
          item={item}
          dark={dark}
          locked={!unlocked}
        />
      );
    }
    const ch = challengeMap.get(item.challengeId);
    const currentIndex = startNumber + challengeOffset++;
    const isSolved = solved.has(item.challengeId);
    return (
      <StoryTimelineCard
        key={`${item.challengeId}-${index}`}
        challenge={ch}
        side={currentIndex % 2 === 0 ? "left" : "right"}
        index={currentIndex}
        dark={dark}
        locked={!unlocked}
        solved={isSolved}
        preview={preview}
      />
    );
  });
  return (
    <section
      className={`story-act relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-32 sm:pt-20 lg:px-16 ${dark ? "story-act-dark text-white" : "story-act-light"}`}
    >
      {actIndex > 0 && (
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-[1px] left-0 h-[120px] w-[120%] origin-top-left -translate-x-[2%] -translate-y-[72px] -rotate-[4deg] ${dark ? "story-transition-light" : "story-transition-dark"}`}
        />
      )}
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div
          className={`relative ${actIndex === 0 ? "min-h-[330px] sm:min-h-[390px]" : "min-h-[250px] sm:min-h-[300px]"}`}
        >
          {actIndex === 0 && (
            <div className="relative z-10 max-w-[760px]">
              <p className="mb-3 text-sm text-[#403a38]">
                ให้การ <span className="text-[#B01414]">Cybersecurity</span>{" "}
                สนุกยิ่งขึ้นด้วย โหมดเนื้อเรื่อง
              </p>
              <h1 className="text-4xl font-bold text-[#3B3535] sm:text-5xl lg:text-7xl">
                {story.title}
              </h1>
              <p className="mt-4 max-w-[700px] whitespace-pre-line text-sm leading-[1.7] text-[#403a38] sm:text-base">
                {story.description}
              </p>
            </div>
          )}
          <div
            className={`story-act-heading ${dark ? "story-act-heading-dark" : "story-act-heading-light"}`}
          >
            <div className="story-act-number">
              {String(actIndex + 1).padStart(2, "0")}
            </div>
            <h2 className="story-act-title">
              Act {roman(actIndex + 1)} – {act.title}
            </h2>
            <div className="mt-3 w-56">
              <div className="flex justify-between text-xs">
                <span>
                  {done}/{challengeIds.length} Completed
                </span>
                <span>
                  {challengeIds.length
                    ? Math.round((done / challengeIds.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div
                className={`mt-2 h-1.5 rounded-full ${dark ? "bg-white/20" : "bg-red-100"}`}
              >
                <div
                  className={`h-full rounded-full ${dark ? "bg-white" : "bg-[#b01414]"}`}
                  style={{
                    width: `${challengeIds.length ? (done / challengeIds.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-2">
          <div
            aria-hidden
            className={dark ? "story-rail-dark" : "story-rail"}
          />
          <div className="relative flex flex-col gap-8 sm:gap-12 lg:gap-0">
            {rendered}
          </div>
        </div>
        {complete && (
          <div
            className={`mx-auto mt-10 max-w-2xl rounded-2xl border p-6 text-center ${dark ? "border-white/20 bg-white/5" : "border-red-100 bg-white/80"}`}
          >
            <div className="text-xs font-bold uppercase tracking-[.2em] text-[#b01414]">
              Act Complete
            </div>
            <h3 className="mt-2 text-2xl font-bold">
              Act {roman(actIndex + 1)} Complete
            </h3>
            <p
              className={`mt-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}
            >
              คุณผ่าน Challenge ทั้งหมดใน {act.title} แล้ว
              เส้นทางถัดไปถูกปลดล็อก
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
function NarrativeBlock({
  item,
  dark,
  locked,
}: {
  item: Extract<StoryItem, { type: "content" }>;
  dark: boolean;
  locked: boolean;
}) {
  return (
    <div
      className={`relative z-20 mx-auto my-8 max-w-3xl rounded-2xl border p-5 sm:p-7 ${dark ? "border-white/15 bg-[#282828]" : "border-[#eadede] bg-white/95"} ${locked ? "story-content-locked" : ""}`}
    >
      {locked ? (
        <div className="py-5 text-center text-sm">
          🔒 ผ่าน Challenge ก่อนหน้าเพื่อเปิดเนื้อเรื่องส่วนนี้
        </div>
      ) : (
        <>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="mb-5 max-h-[320px] w-full rounded-xl object-cover"
            />
          )}
          <div className="text-xs font-bold uppercase tracking-[.18em] text-[#b01414]">
            Story
          </div>
          <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
          <p
            className={`mt-3 whitespace-pre-line leading-7 ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {item.description}
          </p>
        </>
      )}
    </div>
  );
}
function StoryTimelineCard({
  challenge,
  side,
  index,
  dark,
  locked,
  solved,
  preview,
}: {
  challenge?: Challenge;
  side: "left" | "right";
  index: number;
  dark: boolean;
  locked: boolean;
  solved: boolean;
  preview: boolean;
}) {
  const nav = useNavigate(),
    left = side === "left";
  if (!challenge)
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Challenge ไม่พบในระบบ
      </div>
    );
  return (
    <div
      className={`story-timeline-row relative flex w-full justify-center lg:min-h-[290px] ${left ? "lg:justify-start" : "lg:justify-end"}`}
    >
      <div
        aria-hidden
        className={`story-connector ${left ? "story-connector-left" : "story-connector-right"} ${dark ? "story-connector-dark" : ""} hidden lg:block`}
      />
      <div
        aria-hidden
        className={`${dark ? "story-node-dark" : "story-node"} hidden lg:flex`}
      >
        {solved ? "✓" : String(index + 1).padStart(2, "0")}
      </div>
      <article
        className={`story-card ${dark ? "story-card-dark" : ""} ${locked && !preview ? "story-card-locked" : ""} group relative z-20 w-full max-w-[290px] rounded-lg border bg-white p-3 text-[#3B3535] shadow-sm ${locked && !preview ? "grayscale" : "cursor-pointer hover:-translate-y-2 hover:shadow-xl"} transition-all`}
      >
        <StoryImage challenge={challenge} />
        <div className="p-3 pb-1 pt-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-medium text-green-600">
              {challenge.difficulty}
            </span>
            <span className="text-gray-400">●</span>
            <span className={solved ? "text-green-600" : "text-gray-400"}>
              {solved ? "Completed" : "0/1 flag"}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold">{challenge.title}</h3>
          <p className="mt-1 line-clamp-2 text-gray-500">
            {challenge.description}
          </p>
          <button
            disabled={locked && !preview}
            onClick={() =>
              !(locked && !preview) &&
              nav(
                `${preview ? "/admin/challenge" : "/challenge"}?id=${encodeURIComponent(challenge.challengeId)}`,
                preview
                  ? {
                      state: {
                        previewChallenge: challenge,
                        fromStoryPreview: true,
                      },
                    }
                  : undefined,
              )
            }
            className={`mt-2 px-4 py-1.5 text-white ${locked && !preview ? "bg-gray-400" : "bg-[#B01414] hover:bg-[#8F1010]"}`}
          >
            {locked && !preview
              ? "🔒 Locked"
              : solved
                ? "ทำอีกครั้ง"
                : "เริ่มทำ"}
          </button>
        </div>
      </article>
    </div>
  );
}
function StoryImage({ challenge }: { challenge: Challenge }) {
  return (
    <div className="relative h-[105px] overflow-hidden rounded-sm bg-gradient-to-b from-[#112d08] via-[#257a14] to-[#3e9b25]">
      {challenge.thumbnailUrl && (
        <img
          src={challenge.thumbnailUrl}
          alt={challenge.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
function Treasure({ complete }: { complete: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center pb-4 pt-16 ${complete ? "" : "opacity-45 grayscale"}`}
    >
      <div className="relative h-[145px] w-[190px]">
        <div className="absolute left-[28px] top-[20px] h-[60px] w-[134px] rotate-[-8deg] rounded-t-[55px] border-[8px] border-[#F59B2F] bg-[#8D2222]" />
        <div className="absolute bottom-3 left-[25px] h-[75px] w-[140px] rounded-b-xl border-8 border-[#F59B2F] bg-[#B83B32]" />
      </div>
      <h3 className="mt-2 text-xl">
        {complete ? "สมบัติใต้ทะเลลึก" : "🔒 สมบัติยังถูกล็อก"}
      </h3>
      <p className="mt-2 text-xs text-gray-400">
        {complete ? "Story Complete!" : "ผ่าน Story ให้ครบเพื่อปลดล็อก"}
      </p>
    </div>
  );
}
function roman(v: number) {
  const m: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let o = "";
  for (const [n, s] of m)
    while (v >= n) {
      o += s;
      v -= n;
    }
  return o;
}
const styles = `
.story-page { position: relative; background: transparent; }
.story-act-light { background: transparent; }
.story-act-dark, .story-treasure-section { background: #1E1E1E; }
.story-transition-light { background: #fff; }
.story-transition-dark { background: #1E1E1E; }

.story-act-heading { position:absolute; z-index:12; display:flex; width:min(460px,46vw); flex-direction:column; pointer-events:none; }
.story-act-heading-light { right:0; top:40px; align-items:flex-end; text-align:right; color:#403a38; }
.story-act-heading-dark { left:0; top:0; align-items:flex-start; text-align:left; color:#fff; }
.story-act-number { font-size:clamp(110px,12vw,200px); font-weight:300; line-height:.78; letter-spacing:-.08em; }
.story-act-heading-light .story-act-number { color:#EFC7C7; }
.story-act-heading-dark .story-act-number { color:rgba(255,255,255,.28); }
.story-act-title { margin-top:10px; max-width:420px; font-size:clamp(16px,1.5vw,20px); line-height:1.45; }

/* Keep the timeline behind cards/content. */
.story-rail, .story-rail-dark { z-index:0; pointer-events:none; }
.story-rail {
  position:absolute; left:50%; top:55px; bottom:105px; width:2px; transform:translateX(-50%);
  background:linear-gradient(to bottom,rgba(176,20,20,.05),rgba(176,20,20,.65) 10%,rgba(176,20,20,.65) 90%,rgba(176,20,20,.05));
  box-shadow:0 0 12px rgba(176,20,20,.08);
}
.story-rail-dark {
  position:absolute; left:50%; top:45px; bottom:140px; width:2px; transform:translateX(-50%);
  background:linear-gradient(to bottom,rgba(255,255,255,.05),rgba(255,255,255,.65) 10%,rgba(255,255,255,.65) 90%,rgba(255,255,255,.05));
  box-shadow:0 0 12px rgba(255,255,255,.08);
}
.story-node, .story-node-dark {
  position:absolute; top:66px; left:50%; z-index:30; display:flex; width:28px; height:28px;
  transform:translate(-50%,-50%); align-items:center; justify-content:center; border-radius:9999px;
  font-family:monospace; font-size:10px; font-weight:700;
  transition:transform 300ms ease,box-shadow 300ms ease,background-color 300ms ease,color 300ms ease;
}
.story-node { border:2px solid #B01414; background:#fff; color:#B01414; box-shadow:0 0 0 5px rgba(176,20,20,.06),0 0 18px rgba(176,20,20,.15); }
.story-node-dark { border:2px solid #fff; background:#1E1E1E; color:#fff; box-shadow:0 0 0 5px rgba(255,255,255,.05),0 0 18px rgba(255,255,255,.12); }
.story-connector { position:absolute; top:72px; z-index:1; height:2px; pointer-events:none; transition:height 300ms ease,background 300ms ease,box-shadow 300ms ease; }
.story-connector-left { left:0; width:calc(50% - 14px); background:linear-gradient(to left,rgba(176,20,20,.7),rgba(176,20,20,.12)); }
.story-connector-right { left:50%; width:calc(50% - 14px); background:linear-gradient(to right,rgba(176,20,20,.7),rgba(176,20,20,.12)); }
.story-connector-dark.story-connector-left { background:linear-gradient(to left,rgba(255,255,255,.7),rgba(255,255,255,.08)); }
.story-connector-dark.story-connector-right { background:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.08)); }
.story-connector::after { content:""; position:absolute; top:50%; width:7px; height:7px; transform:translateY(-50%); border-radius:9999px; background:#B01414; box-shadow:0 0 8px rgba(176,20,20,.3); transition:width 300ms ease,height 300ms ease; }
.story-connector-left::after { left:0; }
.story-connector-right::after { right:0; }
.story-connector-dark::after { background:#fff; box-shadow:0 0 8px rgba(255,255,255,.25); }

/* Original timeline hover effect. Locked cards intentionally do not activate it. */
.story-timeline-row:has(.story-card:not(.story-card-locked):hover) .story-node { transform:translate(-50%,-50%) scale(1.15); background:#B01414; color:#fff; box-shadow:0 0 0 7px rgba(176,20,20,.08),0 0 25px rgba(176,20,20,.3); }
.story-timeline-row:has(.story-card:not(.story-card-locked):hover) .story-connector { height:3px; background:#B01414; box-shadow:0 0 10px rgba(176,20,20,.2); }
.story-timeline-row:has(.story-card:not(.story-card-locked):hover) .story-connector::after { width:9px; height:9px; }
.story-timeline-row:has(.story-card-dark:not(.story-card-locked):hover) .story-node-dark { transform:translate(-50%,-50%) scale(1.15); background:#fff; color:#1E1E1E; box-shadow:0 0 0 7px rgba(255,255,255,.06),0 0 25px rgba(255,255,255,.2); }
.story-timeline-row:has(.story-card-dark:not(.story-card-locked):hover) .story-connector-dark { height:3px; background:#fff; box-shadow:0 0 10px rgba(255,255,255,.18); }
.story-timeline-row:has(.story-card-dark:not(.story-card-locked):hover) .story-connector-dark::after { width:9px; height:9px; }

/* Locked blocks stay opaque so the timeline cannot show through them. */
.story-card-locked { opacity:1; background:#fff; color:#777; box-shadow:none; cursor:not-allowed; }
.story-card-locked > * { opacity:.48; }
.story-card-locked button { opacity:1; }
.story-content-locked { opacity:1; filter:grayscale(1); }
.story-content-locked > * { opacity:.55; }

@media(max-width:1023px) { .story-node,.story-node-dark,.story-connector,.story-rail,.story-rail-dark { display:none; } }
`;
