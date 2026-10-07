import { getAuthHeaders } from "../utils/auth";
import type {
  StoryConfig,
  StoryProgress,
  TreasureSubmitResult,
} from "../types/story";
let apiUrl = "";
async function getApiUrl() {
  if (apiUrl) return apiUrl;
  const r = await fetch("/config.json");
  if (!r.ok) throw new Error("โหลด config.json ไม่สำเร็จ");
  const c = await r.json();
  if (!c.ALB_URL) throw new Error("ไม่พบ ALB_URL ใน config.json");
  apiUrl = c.ALB_URL;
  return apiUrl;
}
async function readJson(r: Response) {
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "เกิดข้อผิดพลาดจากระบบ");
  return d;
}
export async function getStory(): Promise<StoryConfig | null> {
  const b = await getApiUrl();
  return (
    (await readJson(await fetch(`${b}/?action=get_story&t=${Date.now()}`)))
      .story ?? null
  );
}
export async function getAdminStory(): Promise<StoryConfig | null> {
  const b = await getApiUrl();
  return (
    (
      await readJson(
        await fetch(`${b}/?action=get_admin_story&t=${Date.now()}`, {
          headers: await getAuthHeaders(false),
        }),
      )
    ).story ?? null
  );
}
export async function getStoryProgress(): Promise<StoryProgress> {
  const b = await getApiUrl();
  const d = await readJson(
    await fetch(`${b}/?action=get_story_progress&t=${Date.now()}`, {
      headers: await getAuthHeaders(false),
    }),
  );
  return {
    solvedChallengeIds: d.solvedChallengeIds ?? [],
    treasureUnlocked: Boolean(d.treasureUnlocked),
  };
}
export async function uploadStoryImage(file: File): Promise<string> {
  const b = await getApiUrl();
  const contentType = file.type || "image/png";
  if (!contentType.startsWith("image/"))
    throw new Error("รองรับเฉพาะไฟล์รูปภาพ");
  const d = await readJson(
    await fetch(`${b}/?action=upload_story_image`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ fileName: file.name, contentType }),
    }),
  );
  const u = await fetch(d.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!u.ok) throw new Error("อัปโหลดรูป Story ไม่สำเร็จ");
  return d.imageUrl;
}
export async function saveStory(
  story: Omit<StoryConfig, "storyId" | "updatedAt">,
): Promise<StoryConfig> {
  const b = await getApiUrl();
  return (
    await readJson(
      await fetch(`${b}/?action=save_story`, {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(story),
      }),
    )
  ).story;
}

export async function submitTreasureCode(
  code: string,
): Promise<TreasureSubmitResult> {
  const b = await getApiUrl();
  const d = await readJson(
    await fetch(`${b}/?action=submit_treasure_code`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ code }),
    }),
  );
  return {
    correct: Boolean(d.correct),
    alreadyUnlocked: Boolean(d.alreadyUnlocked),
    reward: d.reward ?? null,
    totalFish: d.totalFish ?? null,
  };
}
