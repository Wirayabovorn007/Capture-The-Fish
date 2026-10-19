import { useEffect, useMemo, useState } from "react";
import ChallengeCard from "../challenges/ChallengeCard";
import { getChallenges } from "../../services/challengeApi";
import type { Challenge } from "../../types/challenge";

type Difficulty = "Easy" | "Medium" | "Hard";

type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  level: "beginner" | "intermediate" | "expert";
  description: string;
  thumbnailUrl?: string;
};

function toProblem(challenge: Challenge): Problem {
  const difficulty = challenge.difficulty as Difficulty;
  return {
    id: challenge.challengeId,
    title: challenge.title,
    difficulty,
    category: challenge.category,
    level:
      difficulty === "Easy"
        ? "beginner"
        : difficulty === "Medium"
          ? "intermediate"
          : "expert",
    description: challenge.description,
    thumbnailUrl: challenge.thumbnailUrl,
  };
}

const tabs = [
  {
    label: "ทั้งหมด",
    value: "all",
  },
  {
    label: "สำหรับผู้เริ่มต้น",
    value: "beginner",
  },
  {
    label: "มีพื้นฐานแล้ว",
    value: "intermediate",
  },
  {
    label: "ผู้เชี่ยวชาญ",
    value: "expert",
  },
];

export default function ProblemSlider() {
  const [activeTab, setActiveTab] = useState("all");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");
        const challenges = await getChallenges();
        setProblems(challenges.map(toProblem));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "ไม่สามารถโหลด Challenge ได้",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProblems();
  }, []);

  const activeTabIndex = tabs.findIndex((tab) => tab.value === activeTab);

  const filteredProblems = useMemo(() => {
    if (activeTab === "all") {
      return problems;
    }

    return problems.filter((problem) => problem.level === activeTab);
  }, [activeTab, problems]);

  /**
   * Number of cards visible at desktop size.
   */
  const itemsPerPage = 3;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / itemsPerPage),
  );

  /**
   * Problems currently displayed.
   */
  const visibleProblems = filteredProblems.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  /**
   * Change category tab.
   */
  const handleTabChange = (value: string) => {
    if (value === activeTab) {
      return;
    }

    const newIndex = tabs.findIndex((tab) => tab.value === value);

    /**
     * Determine animation direction based on tab position.
     */
    setSlideDirection(newIndex > activeTabIndex ? "right" : "left");

    setActiveTab(value);

    /**
     * Always start from the first page
     * when switching category.
     */
    setPage(0);

    /**
     * Restart animation.
     */
    setAnimationKey((key) => key + 1);
  };

  /**
   * Go to next page.
   */
  const nextPage = () => {
    if (page >= totalPages - 1) {
      return;
    }

    setSlideDirection("right");

    setPage((current) => current + 1);

    setAnimationKey((key) => key + 1);
  };

  /**
   * Go to previous page.
   */
  const previousPage = () => {
    if (page <= 0) {
      return;
    }

    setSlideDirection("left");

    setPage((current) => current - 1);

    setAnimationKey((key) => key + 1);
  };

  /**
   * Go directly to a page using pagination.
   */
  const goToPage = (newPage: number) => {
    if (newPage === page) {
      return;
    }

    setSlideDirection(newPage > page ? "right" : "left");

    setPage(newPage);

    setAnimationKey((key) => key + 1);
  };

  return (
    <>
      {/* =====================================================
          Animation Styles
      ====================================================== */}
      <style>
        {`
          @keyframes problem-slide-right {
            from {
              opacity: 0;
              transform: translateX(60px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes problem-slide-left {
            from {
              opacity: 0;
              transform: translateX(-60px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .problem-slide-right {
            animation:
              problem-slide-right
              400ms
              cubic-bezier(0.22, 1, 0.36, 1);
          }

          .problem-slide-left {
            animation:
              problem-slide-left
              400ms
              cubic-bezier(0.22, 1, 0.36, 1);
          }

          @media (prefers-reduced-motion: reduce) {
            .problem-slide-right,
            .problem-slide-left {
              animation: none;
            }
          }
        `}
      </style>

      <section className="w-full bg-white mt-10">
        {/* =====================================================
            Category Tabs
        ====================================================== */}
        <div className="mb-7 flex flex-wrap items-center gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`
                  min-w-[110px] sm:min-w-[140px] lg:min-w-[165px]
                  border
                  px-4 sm:px-6 lg:px-8
                  py-2 sm:py-2.5 lg:py-3
                  text-xs sm:text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? "border-[#B01414] bg-[#B01414] text-white"
                      : `
                        border-gray-400
                        bg-white
                        text-gray-700
                        hover:border-[#B01414]
                        hover:text-[#B01414]
                      `
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            Slider Container
        ====================================================== */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-4 sm:px-5 lg:px-7
            py-5 sm:py-6 lg:py-8
            shadow-sm
          "
        >
          <div className="relative">
            {/* =================================================
                Previous Navigation
            ================================================== */}
            <button
              type="button"
              onClick={previousPage}
              disabled={page === 0}
              aria-label="Previous"
              className="
                absolute
                -left-5
                top-1/2
                z-10
                hidden
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-gray-700
                shadow-sm
                transition-all
                duration-200
                hover:bg-gray-50
                hover:text-[#B01414]
                disabled:pointer-events-none
                disabled:opacity-0
                lg:flex
              "
            >
              <span className="text-xl leading-none">←</span>
            </button>

            {/* =================================================
                Cards
            ================================================== */}
            <div
              key={animationKey}
              className={
                slideDirection === "right"
                  ? "problem-slide-right"
                  : "problem-slide-left"
              }
            >
              {loading ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  กำลังโหลด Challenge...
                </div>
              ) : error ? (
                <div className="py-10 text-center text-sm text-red-600">
                  {error}
                </div>
              ) : visibleProblems.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  ไม่พบ Challenge
                </div>
              ) : (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {visibleProblems.map((problem) => (
                    <ChallengeCard
                      key={problem.id}
                      challenge={{ challengeId: problem.id, title: problem.title, difficulty: problem.difficulty, category: problem.category, description: problem.description, thumbnailUrl: problem.thumbnailUrl, objective: "", hint: "", hasContainer: false, containers: [] }}
                      variant="user"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                Next Navigation
            ================================================== */}
            <button
              type="button"
              onClick={nextPage}
              disabled={page >= totalPages - 1}
              aria-label="Next"
              className="
                absolute
                -right-5
                top-1/2
                z-10
                hidden
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-gray-700
                shadow-sm
                transition-all
                duration-200
                hover:bg-gray-50
                hover:text-[#B01414]
                disabled:pointer-events-none
                disabled:opacity-0
                lg:flex
              "
            >
              <span className="text-xl leading-none">→</span>
            </button>
          </div>

          {/* =====================================================
              Pagination
          ====================================================== */}
          {totalPages > 1 && (
            <div className="mt-7 flex justify-center gap-3">
              {Array.from({
                length: totalPages,
              }).map((_, index) => {
                const active = index === page;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToPage(index)}
                    aria-label={`Go to page ${index + 1}`}
                    className={`
                      h-[5px]
                      w-12
                      transition-all
                      duration-300
                      ${
                        active
                          ? "bg-[#B01414]"
                          : `
                            bg-gray-300
                            hover:bg-gray-400
                          `
                      }
                    `}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* =============================================================
   Problem Card
============================================================= */

