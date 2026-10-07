import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminChallenges, getFishes } from "../../services/challengeApi";
import { getAuthHeaders } from "../../utils/auth";
import FishRewardSelector from "../../components/admin/FishRewardSelector";
import {
  getAdminStory,
  saveStory,
  uploadStoryImage,
} from "../../services/storyApi";
import type { Challenge, Fish } from "../../types/challenge";
import type {
  StoryAct,
  StoryContentItem,
  StoryItem,
  StoryStatus,
  StoryTreasure,
  FishRarity,
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
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info",
  );
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [treasureCode, setTreasureCode] = useState("00000");
  const [treasureHint, setTreasureHint] = useState("");
  const [treasureFishMode, setTreasureFishMode] = useState<"new" | "existing">(
    "new",
  );
  const [treasureFishId, setTreasureFishId] = useState("");
  const [treasureFishName, setTreasureFishName] = useState("");
  const [treasureFishImageUrl, setTreasureFishImageUrl] = useState("");
  const [treasureFishAmount, setTreasureFishAmount] = useState<number | "">(1);
  const [treasureFishRarity, setTreasureFishRarity] =
    useState<FishRarity>("ultimate");
  const [treasureFishDescription, setTreasureFishDescription] = useState("");
  const [treasureFishXp, setTreasureFishXp] = useState<number | "">("");
  const [uploadingTreasureFish, setUploadingTreasureFish] = useState(false);
  const handleTreasureFishImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    try {
      setUploadingTreasureFish(true);
      setMessage("");
      const configResponse = await fetch("/config.json");
      if (!configResponse.ok) throw new Error("โหลด config.json ไม่สำเร็จ");
      const config = await configResponse.json();
      if (!config.ALB_URL) throw new Error("ไม่พบ ALB_URL ใน config.json");
      const presignResponse = await fetch(
        `${config.ALB_URL}/?action=upload_fish_image`,
        {
          method: "POST",
          headers: await getAuthHeaders(),
          body: JSON.stringify({ fileName: file.name, contentType: file.type }),
        },
      );
      const presignData = await presignResponse.json();
      if (!presignResponse.ok || presignData.status !== "SUCCESS") {
        throw new Error(
          presignData.error || "ไม่สามารถเตรียมการอัปโหลดรูปปลาได้",
        );
      }
      const uploadResponse = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResponse.ok)
        throw new Error("ไม่สามารถอัปโหลดรูปปลาไปยัง S3 ได้");
      setTreasureFishImageUrl(presignData.imageUrl);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "อัปโหลดรูปปลาไม่สำเร็จ",
      );
    } finally {
      setUploadingTreasureFish(false);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const [c, s, fishList] = await Promise.all([
          getAdminChallenges(),
          getAdminStory(),
          getFishes(),
        ]);
        setChallenges(c);
        setFishes(fishList);
        if (s) {
          setTitle(s.title ?? "");
          setDescription(s.description ?? "");
          setStatus(s.status ?? "draft");
          setActs(s.acts?.length ? s.acts.map(normalizeAct) : [newAct(1)]);
          if (s.treasure) {
            setTreasureCode(s.treasure.combinationCode ?? "00000");
            setTreasureHint(s.treasure.hint ?? "");
            const r = s.treasure.fishReward;
            if (r?.fishId) {
              setTreasureFishMode("existing");
              setTreasureFishId(r.fishId);
            } else {
              setTreasureFishMode("new");
              setTreasureFishName(r?.name ?? "");
              setTreasureFishImageUrl(r?.imageUrl ?? "");
              setTreasureFishRarity(r?.rarity ?? "ultimate");
              setTreasureFishDescription(r?.description ?? "");
              setTreasureFishXp(r?.xp ?? "");
            }
            setTreasureFishAmount(r?.amount ?? 1);
          }
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
    if (!/^\d{5}$/.test(treasureCode))
      return "Treasure Combination ต้องเป็นตัวเลข 5 หลัก";
    if (!treasureHint.trim()) return "กรุณากรอก Treasure Hint";
    if (!treasureFishAmount || Number(treasureFishAmount) < 1)
      return "จำนวนปลา Treasure ต้องอย่างน้อย 1";
    if (treasureFishMode === "existing" && !treasureFishId)
      return "กรุณาเลือกปลา Treasure";
    if (treasureFishMode === "new") {
      if (!treasureFishName.trim() || !treasureFishImageUrl)
        return "กรุณากรอกชื่อและรูปปลา Treasure";
      if (!treasureFishDescription.trim())
        return "กรุณากรอกคำอธิบายปลา Treasure";
      if (!treasureFishXp || Number(treasureFishXp) < 1)
        return "Treasure Fish XP ต้องอย่างน้อย 1";
    }
    return "";
  };
  const persist = async (targetStatus?: StoryStatus) => {
    const err = validate();
    if (err) {
      setMessageType("error");
      setMessage(err);
      return false;
    }
    setSaving(true);
    try {
      const finalStatus = targetStatus ?? status;
      if (targetStatus) setStatus(targetStatus);
      const treasure: StoryTreasure = {
        combinationCode: treasureCode,
        hint: treasureHint.trim(),
        fishReward:
          treasureFishMode === "existing"
            ? {
                fishId: treasureFishId,
                name: "",
                imageUrl: "",
                amount: Number(treasureFishAmount),
                rarity: "common",
              }
            : {
                name: treasureFishName.trim(),
                imageUrl: treasureFishImageUrl,
                amount: Number(treasureFishAmount),
                rarity: treasureFishRarity,
                description: treasureFishDescription.trim(),
                xp: Number(treasureFishXp),
              },
      };
      const savedStory = await saveStory({
        title: title.trim(),
        description: description.trim(),
        status: finalStatus,
        treasure,
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

      // A newly-created Treasure fish is now a catalog fish. Keep the fishId
      // returned by the backend so Save / Preview / Publish reuses it instead
      // of creating another catalog entry.
      const savedReward = savedStory.treasure?.fishReward;
      if (savedReward?.fishId) {
        setTreasureFishId(savedReward.fishId);
        setTreasureFishMode("existing");
        setTreasureFishAmount(savedReward.amount ?? 1);
        setFishes(await getFishes());
      }

      setMessageType("success");
      setMessage(
        targetStatus === "published"
          ? "เผยแพร่ Story สำเร็จ — ผู้เล่นสามารถเข้า Story Mode เวอร์ชันล่าสุดได้แล้ว"
          : "บันทึก Story สำเร็จ",
      );
      return true;
    } catch (e) {
      setMessageType("error");
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
      <div className="mb-8 border-b border-[#eeeae8] pb-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#b01414]">
              Story Management
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
              จัดการ Story Mode
            </h2>
            <p className="mt-1 text-sm text-[#77716e]">
              สร้างและจัดการ Story Mode, Acts, Treasure และสถานะการเผยแพร่
            </p>
          </div>
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${status === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
          >
            {status === "published" ? "● Published" : "● Draft"}
          </span>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b01414] text-sm font-bold text-white">
              1
            </div>
            <div>
              <h3 className="font-bold text-[#403a38]">ข้อมูลหลักของ Story</h3>
              <p className="mt-1 text-xs text-[#8b8582]">
                ข้อมูลส่วนนี้เป็นสิ่งแรกที่ผู้เล่นใช้ทำความเข้าใจ Story Mode
              </p>
            </div>
          </div>
          <div className="space-y-5">
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
                <option value="published">
                  Published - แสดง Story ให้ผู้เล่น
                </option>
              </select>
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b01414] text-sm font-bold text-white">
            2
          </div>
          <div>
            <h3 className="font-bold text-[#403a38]">
              ลำดับเนื้อเรื่องและ Challenge
            </h3>
            <p className="text-xs text-[#8b8582]">
              เรียง Act และเนื้อหาตามลำดับที่ผู้เล่นควรพบ
            </p>
          </div>
        </div>
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
        <div className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-5 sm:p-6">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b01414] text-sm font-bold text-white">
                3
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[.16em] text-[#b01414]">
                  Treasure
                </div>
                <h3 className="mt-0.5 text-xl font-bold text-[#403a38]">
                  Treasure Configuration
                </h3>
              </div>
            </div>
            <p className="mt-1 text-xs text-[#77716e]">
              ตั้งรหัสกุญแจ 5 หลัก คำใบ้ และปลาที่จะได้รับเมื่อเปิดหีบสำเร็จ
            </p>
          </div>
          <Field label="Combination Code (5 หลัก)">
            <input
              value={treasureCode}
              inputMode="numeric"
              maxLength={5}
              onChange={(e) =>
                setTreasureCode(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              className="h-12 w-full rounded-xl border bg-white px-4 font-mono text-xl tracking-[.5em]"
              placeholder="00000"
            />
          </Field>
          <div className="mt-4">
            <Field label="Treasure Hint">
              <textarea
                value={treasureHint}
                onChange={(e) => setTreasureHint(e.target.value)}
                rows={4}
                className="w-full rounded-xl border bg-white px-4 py-3"
                placeholder="คำใบ้สำหรับผู้เล่น โดยคนสร้าง Story จะเป็นคนกำหนดวิธีซ่อน Secret เอง"
              />
            </Field>
          </div>
          <div className="mt-6 border-t pt-5">
            <h4 className="text-lg font-bold text-[#403a38]">
              Treasure Fish Reward
            </h4>
            <p className="mt-1 text-xs text-[#999390]">
              เลือกใช้ปลาที่มีอยู่แล้ว หรือสร้างปลาชนิดใหม่สำหรับ Treasure นี้
            </p>
            <div className="mt-5">
              <FishRewardSelector
                mode={treasureFishMode}
                onModeChange={setTreasureFishMode}
                fishes={fishes}
                selectedFishId={treasureFishId}
                onSelectedFishIdChange={setTreasureFishId}
                fishName={treasureFishName}
                onFishNameChange={setTreasureFishName}
                fishImageUrl={treasureFishImageUrl}
                fishAmount={treasureFishAmount}
                onFishAmountChange={setTreasureFishAmount}
                fishRarity={treasureFishRarity}
                onFishRarityChange={setTreasureFishRarity}
                fishDescription={treasureFishDescription}
                onFishDescriptionChange={setTreasureFishDescription}
                fishXp={treasureFishXp}
                onFishXpChange={setTreasureFishXp}
                uploadingFish={uploadingTreasureFish}
                onFishImageUpload={handleTreasureFishImageUpload}
              />
            </div>
          </div>
        </div>
        {message && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            <span className="mt-0.5 text-base">
              {messageType === "success"
                ? "✓"
                : messageType === "error"
                  ? "!"
                  : "i"}
            </span>
            <span>{message}</span>
          </div>
        )}

        <div className="rounded-2xl border border-[#e7e3e1] bg-[#faf9f8] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-[#403a38]">Story Actions</p>
              <p className="mt-1 text-xs text-[#8b8582]">
                บันทึกร่างก่อนตรวจ Preview และใช้ Publish
                เมื่อพร้อมให้ผู้เล่นเห็นเวอร์ชันล่าสุด
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void persist()}
                disabled={saving}
                className="h-11 rounded-xl border border-[#d8d2cf] bg-white px-5 text-sm font-semibold text-[#5d5754] shadow-sm transition hover:border-[#a9a19d] hover:bg-[#f7f5f4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกร่าง"}
              </button>
              <button
                type="button"
                onClick={() =>
                  void (async () => {
                    if (await persist()) navigate("/story/preview");
                  })()
                }
                disabled={saving}
                className="h-11 rounded-xl border border-[#403a38] bg-white px-5 text-sm font-semibold text-[#403a38] shadow-sm transition hover:bg-[#403a38] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => void persist("published")}
                disabled={saving}
                className="h-12 rounded-xl bg-[#b01414] px-7 text-sm font-bold text-white shadow-[0_8px_20px_rgba(176,20,20,0.22)] transition hover:-translate-y-0.5 hover:bg-[#991111] hover:shadow-[0_10px_24px_rgba(176,20,20,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {saving ? "กำลังเผยแพร่..." : "Publish Story"}
              </button>
            </div>
          </div>
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
