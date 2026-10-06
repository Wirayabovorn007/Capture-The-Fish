import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminChallenges } from "../../services/challengeApi";
import {
  getAdminStory,
  saveStory,
  uploadStoryImage,
} from "../../services/storyApi";
import type { Challenge } from "../../types/challenge";
import type {
  StoryAct,
  StoryContentItem,
  StoryItem,
  StoryStatus,
} from "../../types/story";

const newAct = (i: number): StoryAct => ({
  actId: `act-${Date.now()}-${i}`,
  title: "",
  items: [],
});
const challengeItem = (challengeId = ""): StoryItem => ({
  type: "challenge",
  challengeId,
});
const contentItem = (): StoryContentItem => ({
  type: "content",
  contentId: `content-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  description: "",
  imageUrl: "",
});
const normalizeAct = (a: StoryAct): StoryAct => ({
  ...a,
  items: a.items?.length
    ? a.items
    : (a.challengeIds ?? []).map((id) => challengeItem(id)),
});

export default function StoryManagement() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<StoryStatus>("draft");
  const [acts, setActs] = useState<StoryAct[]>([newAct(1)]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        const [c, s] = await Promise.all([
          getAdminChallenges(),
          getAdminStory(),
        ]);
        setChallenges(c);
        if (s) {
          setTitle(s.title ?? "");
          setDescription(s.description ?? "");
          setStatus(s.status ?? "draft");
          setActs(s.acts?.length ? s.acts.map(normalizeAct) : [newAct(1)]);
        }
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "โหลด Story ไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const challengeMap = useMemo(
    () => new Map(challenges.map((c) => [c.challengeId, c])),
    [challenges],
  );
  const usedIds = useMemo(
    () =>
      acts.flatMap((a) =>
        a.items.filter((i) => i.type === "challenge").map((i) => i.challengeId),
      ),
    [acts],
  );
  const updateAct = (ai: number, p: Partial<StoryAct>) =>
    setActs((a) => a.map((x, i) => (i === ai ? { ...x, ...p } : x)));
  const updateItem = (ai: number, ii: number, item: StoryItem) =>
    setActs((a) =>
      a.map((x, i) =>
        i === ai
          ? { ...x, items: x.items.map((v, j) => (j === ii ? item : v)) }
          : x,
      ),
    );
  const removeItem = (ai: number, ii: number) =>
    setActs((a) =>
      a.map((x, i) =>
        i === ai ? { ...x, items: x.items.filter((_, j) => j !== ii) } : x,
      ),
    );
  const moveItem = (ai: number, ii: number, d: -1 | 1) =>
    setActs((a) =>
      a.map((x, i) => {
        if (i !== ai) return x;
        const n = ii + d;
        if (n < 0 || n >= x.items.length) return x;
        const items = [...x.items];
        [items[ii], items[n]] = [items[n], items[ii]];
        return { ...x, items };
      }),
    );
  const moveAct = (i: number, d: -1 | 1) =>
    setActs((a) => {
      const n = i + d;
      if (n < 0 || n >= a.length) return a;
      const c = [...a];
      [c[i], c[n]] = [c[n], c[i]];
      return c;
    });
  const validate = () => {
    if (!title.trim() || !description.trim())
      return "กรุณากรอกชื่อ Story และเนื้อเรื่อง";
    if (!acts.length) return "Story ต้องมีอย่างน้อย 1 Act";
    for (const a of acts) {
      if (!a.title.trim()) return "กรุณากรอกชื่อ Act ให้ครบ";
      if (!a.items.some((i) => i.type === "challenge"))
        return "แต่ละ Act ต้องมี Challenge อย่างน้อย 1 ข้อ";
      for (const i of a.items) {
        if (i.type === "challenge" && !i.challengeId)
          return "กรุณาเลือก Challenge ให้ครบ";
        if (i.type === "content" && (!i.title.trim() || !i.description.trim()))
          return "Story Content ต้องมี Title และ Description";
      }
    }
    const ids = acts.flatMap((a) =>
      a.items.filter((i) => i.type === "challenge").map((i) => i.challengeId),
    );
    if (new Set(ids).size !== ids.length)
      return "Challenge ใน Story ห้ามซ้ำกัน";
    return "";
  };
  const persist = async (targetStatus?: StoryStatus) => {
    const err = validate();
    if (err) {
      setMessage(err);
      return false;
    }
    setSaving(true);
    try {
      const finalStatus = targetStatus ?? status;
      if (targetStatus) setStatus(targetStatus);
      await saveStory({
        title: title.trim(),
        description: description.trim(),
        status: finalStatus,
        acts: acts.map((a, i) => ({
          actId: a.actId || `act-${i + 1}`,
          title: a.title.trim(),
          items: a.items.map((item) =>
            item.type === "content"
              ? {
                  ...item,
                  title: item.title.trim(),
                  description: item.description.trim(),
                }
              : item,
          ),
        })),
      });
      setMessage("บันทึก Story สำเร็จ");
      return true;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "บันทึก Story ไม่สำเร็จ");
      return false;
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        กำลังโหลด Story...
      </div>
    );
  return (
    <section className="rounded-2xl border border-[#e5e1df] bg-white p-6 sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#b01414]">
          Story Management
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
          จัดการ Story Mode
        </h2>
        <p className="mt-1 text-sm text-[#77716e]">
          จัด Act, Challenge และ Narrative Content ได้ในเส้นเรื่องเดียวกัน
        </p>
      </div>
      <div className="space-y-6">
        <Field label="ชื่อ Story Mode">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full rounded-xl border px-4"
          />
        </Field>
        <Field label="Story / Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-xl border px-4 py-3"
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StoryStatus)}
            className="h-12 w-full rounded-xl border bg-white px-4"
          >
            <option value="draft">Draft - ผู้เล่นยังไม่เห็น</option>
            <option value="published">Published - แสดง Story ให้ผู้เล่น</option>
          </select>
        </Field>
        {acts.map((act, ai) => (
          <div
            key={act.actId}
            className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-5 sm:p-6"
          >
            <div className="mb-5 flex gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold">Act {roman(ai + 1)}</h3>
                <input
                  value={act.title}
                  onChange={(e) => updateAct(ai, { title: e.target.value })}
                  className="mt-3 h-12 w-full rounded-xl border bg-white px-4"
                  placeholder="ชื่อ Act"
                />
              </div>
              <div className="flex gap-2">
                <Btn disabled={ai === 0} onClick={() => moveAct(ai, -1)}>
                  ↑
                </Btn>
                <Btn
                  disabled={ai === acts.length - 1}
                  onClick={() => moveAct(ai, 1)}
                >
                  ↓
                </Btn>
                <button
                  disabled={acts.length === 1}
                  onClick={() => setActs((a) => a.filter((_, i) => i !== ai))}
                  className="h-10 rounded-lg border border-red-200 bg-white px-3 text-xs text-red-600"
                >
                  ลบ Act
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {act.items.map((item, ii) =>
                item.type === "challenge" ? (
                  <div
                    key={`${act.actId}-${ii}`}
                    className="grid w-full min-w-0 max-w-full gap-3 overflow-hidden rounded-xl border bg-white p-4 md:grid-cols-[70px_minmax(0,1fr)_auto] md:items-center"
                  >
                    <b className="text-[#b01414]">
                      #{String(ii + 1).padStart(2, "0")}
                    </b>
                    <div className="w-full min-w-0 max-w-full overflow-hidden">
                      <div className="mb-1 text-[11px] font-bold uppercase text-[#b01414]">
                        Challenge
                      </div>
                      <select
                        value={item.challengeId}
                        onChange={(e) =>
                          updateItem(ai, ii, challengeItem(e.target.value))
                        }
                        className="block h-12 w-full min-w-0 max-w-full rounded-xl border bg-white px-4"
                      >
                        <option value="">เลือก Challenge</option>
                        {challenges.map((c) => (
                          <option
                            key={c.challengeId}
                            value={c.challengeId}
                            disabled={
                              c.challengeId !== item.challengeId &&
                              usedIds.includes(c.challengeId)
                            }
                          >
                            {c.title} — {c.difficulty}
                          </option>
                        ))}
                      </select>
                      {challengeMap.get(item.challengeId) && (
                        <p className="mt-2 truncate text-xs text-[#77716e]">
                          {challengeMap.get(item.challengeId)?.description}
                        </p>
                      )}
                    </div>
                    <Actions
                      up={ii > 0}
                      down={ii < act.items.length - 1}
                      onUp={() => moveItem(ai, ii, -1)}
                      onDown={() => moveItem(ai, ii, 1)}
                      onDelete={() => removeItem(ai, ii)}
                    />
                  </div>
                ) : (
                  <ContentEditor
                    key={item.contentId}
                    item={item}
                    onChange={(v) => updateItem(ai, ii, v)}
                    onUpload={async (file) => {
                      try {
                        const url = await uploadStoryImage(file);
                        updateItem(ai, ii, { ...item, imageUrl: url });
                      } catch (e) {
                        setMessage(
                          e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ",
                        );
                      }
                    }}
                    actions={
                      <Actions
                        up={ii > 0}
                        down={ii < act.items.length - 1}
                        onUp={() => moveItem(ai, ii, -1)}
                        onDown={() => moveItem(ai, ii, 1)}
                        onDelete={() => removeItem(ai, ii)}
                      />
                    }
                  />
                ),
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  updateAct(ai, { items: [...act.items, challengeItem()] })
                }
                className="h-11 rounded-xl border border-[#b01414] bg-white px-4 text-sm font-semibold text-[#b01414]"
              >
                + เพิ่ม Challenge
              </button>
              <button
                onClick={() =>
                  updateAct(ai, { items: [...act.items, contentItem()] })
                }
                className="h-11 rounded-xl bg-[#403a38] px-4 text-sm font-semibold text-white"
              >
                + เพิ่มเนื้อเรื่อง
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => setActs((a) => [...a, newAct(a.length + 1)])}
          className="h-12 w-full rounded-xl border-2 border-dashed"
        >
          + เพิ่ม Act
        </button>
        {message && (
          <div className="rounded-xl border px-4 py-3 text-sm">{message}</div>
        )}
        <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
          <button
            onClick={() => void persist()}
            disabled={saving}
            className="h-12 rounded-xl border border-[#b01414] px-6 font-semibold text-[#b01414]"
          >
            บันทึก
          </button>
          <button
            onClick={() =>
              void (async () => {
                if (await persist()) navigate("/story/preview");
              })()
            }
            disabled={saving}
            className="h-12 rounded-xl bg-[#403a38] px-6 font-semibold text-white"
          >
            Preview
          </button>
          <button
            onClick={() => void persist("published")}
            disabled={saving}
            className="h-12 rounded-xl bg-[#b01414] px-6 font-semibold text-white"
          >
            Publish
          </button>
        </div>
      </div>
    </section>
  );
}
function ContentEditor({
  item,
  onChange,
  onUpload,
  actions,
}: {
  item: StoryContentItem;
  onChange: (v: StoryContentItem) => void;
  onUpload: (f: File) => void;
  actions: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#d9d2ce] bg-[#fffaf8] p-4">
      <div className="flex justify-between gap-3">
        <div className="text-xs font-bold uppercase text-[#b01414]">
          Story Content
        </div>
        {actions}
      </div>
      <input
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        className="mt-3 h-11 w-full rounded-lg border bg-white px-3"
        placeholder="หัวข้อเนื้อเรื่อง"
      />
      <textarea
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        rows={4}
        className="mt-3 w-full rounded-lg border bg-white px-3 py-2"
        placeholder="เนื้อเรื่อง / Narrative"
      />
      <div className="mt-3 flex items-center gap-3">
        <label className="cursor-pointer rounded-lg border bg-white px-3 py-2 text-xs font-semibold">
          เลือกรูป
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
        </label>
        {item.imageUrl && (
          <>
            <img
              src={item.imageUrl}
              className="h-14 w-24 rounded object-cover"
            />
            <button
              onClick={() => onChange({ ...item, imageUrl: "" })}
              className="text-xs text-red-600"
            >
              ลบรูป
            </button>
          </>
        )}
      </div>
    </div>
  );
}
function Actions({
  up,
  down,
  onUp,
  onDown,
  onDelete,
}: {
  up: boolean;
  down: boolean;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Btn disabled={!up} onClick={onUp}>
        ↑
      </Btn>
      <Btn disabled={!down} onClick={onDown}>
        ↓
      </Btn>
      <button
        onClick={onDelete}
        className="h-10 rounded-lg border border-red-200 px-3 text-xs text-red-600"
      >
        ลบ
      </button>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}
function Btn({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="h-10 w-10 rounded-lg border bg-white disabled:opacity-30"
    >
      {children}
    </button>
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
