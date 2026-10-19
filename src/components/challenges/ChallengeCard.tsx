import { Link } from "react-router-dom";
import { Lock, Orbit, Swords } from "lucide-react";
import type { Challenge } from "../../types/challenge";

type CardVariant = "user" | "admin" | "story";
type VisualVariant = "matrix" | "lock" | "knife";

type ChallengeCardProps = {
  challenge: Challenge;
  variant?: CardVariant;
  solved?: boolean;
  locked?: boolean;
  preview?: boolean;
  dark?: boolean;
  index?: number;
  solvedCount?: number;
  fishAwarded?: number;
  onAction?: () => void;
  actionLabel?: string;
  href?: string;
};

const variantBg: Record<VisualVariant, string> = {
  matrix: "bg-gradient-to-br from-emerald-900 via-emerald-700 to-black",
  lock: "bg-gradient-to-br from-violet-900 via-purple-600 to-purple-900",
  knife: "bg-gradient-to-br from-red-800 via-red-600 to-red-900",
};
const variantIcon: Record<VisualVariant, typeof Orbit> = {
  matrix: Orbit,
  lock: Lock,
  knife: Swords,
};

function getVisualVariant(category: string): VisualVariant {
  const value = category.toLowerCase();
  if (value.includes("web") || value.includes("osint")) return "matrix";
  if (value.includes("crypto") || value.includes("forensic")) return "lock";
  return "knife";
}

function getDifficultyClass(difficulty: string) {
  if (difficulty === "Easy") return "text-green-500";
  if (difficulty === "Medium") return "text-orange-500";
  if (difficulty === "Hard") return "text-red-600";
  return "text-gray-500";
}

export default function ChallengeCard({
  challenge,
  variant = "user",
  solved = false,
  locked = false,
  preview = false,
  dark = false,
  index,
  solvedCount,
  fishAwarded = 0,
  onAction,
  actionLabel,
  href,
}: ChallengeCardProps) {
  const visualVariant = getVisualVariant(challenge.category ?? "");
  const Icon = variantIcon[visualVariant];
  const target = href ?? `/challenge?id=${encodeURIComponent(challenge.challengeId)}`;
  const label = actionLabel ?? (variant === "admin" ? "ดูโจทย์" : solved ? "ทำอีกครั้ง" : "ออกล่า");
  const isStory = variant === "story";
  const actionClass = `mt-auto inline-flex w-fit items-center justify-center rounded-md px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 active:scale-95 ${locked && !preview ? "cursor-not-allowed bg-gray-400" : "bg-[#B01414] hover:bg-[#8F1010]"}`;

  return (
    <article className={`story-card group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isStory ? "relative z-10 min-h-[290px] max-w-[290px] p-3" : ""} ${dark && isStory ? "story-card-dark" : ""} ${locked && !preview ? "story-card-locked grayscale" : ""}`}>
      {typeof index === "number" && isStory && (
        <div className="mb-2 text-xs font-bold tracking-widest text-[#B01414]">
          CHALLENGE {String(index + 1).padStart(2, "0")}
        </div>
      )}
      <div className={`flex ${isStory ? "aspect-[2.15/1]" : "aspect-[2.1/1]"} shrink-0 items-center justify-center overflow-hidden rounded-lg ${variantBg[visualVariant]}`}>
        {challenge.thumbnailUrl ? (
          <img src={challenge.thumbnailUrl} alt={`${challenge.title} thumbnail`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Icon className="h-16 w-16 text-white/80 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <span className={`font-medium ${getDifficultyClass(challenge.difficulty)}`}>{challenge.difficulty}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400">{challenge.category}</span>
          {isStory && (
            <span className={`ml-auto text-xs font-medium ${solved ? "text-green-600" : "text-gray-400"}`}>
              {solved ? "Completed" : "0/1 flag"}
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-800 transition-colors group-hover:text-[#B01414]">{challenge.title}</h3>
        <p className={`mb-5 text-sm leading-6 text-gray-500 ${variant === "admin" ? "line-clamp-3" : "line-clamp-2"}`}>{challenge.description}</p>

        {variant === "admin" && (
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#faf9f8] p-3">
              <p className="text-xs text-[#999390]">Fish / คะแนน</p>
              <p className="mt-1 font-bold text-[#403a38]">{fishAwarded.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-[#faf9f8] p-3">
              <p className="text-xs text-[#999390]">ทำสำเร็จแล้ว</p>
              <p className="mt-1 font-bold text-[#403a38]">{(solvedCount ?? 0).toLocaleString()} คน</p>
            </div>
          </div>
        )}

        {onAction ? (
          <button type="button" disabled={locked && !preview} onClick={onAction} className={actionClass}>
            {locked && !preview ? "🔒 Locked" : label}
          </button>
        ) : (
          <Link to={target} aria-disabled={locked && !preview} onClick={(event) => { if (locked && !preview) event.preventDefault(); }} className={actionClass}>
            {locked && !preview ? "🔒 Locked" : label}
          </Link>
        )}
      </div>
    </article>
  );
}
