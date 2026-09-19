import { useMemo, useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";

type Problem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: "beginner" | "intermediate" | "expert";
  image: string;
};

const problems: Problem[] = [
  {
    id: 1,
    title: "Cybersecurity 101",
    difficulty: "Easy",
    category: "beginner",
    image: "/images/cybersecurity-101.png",
  },
  {
    id: 2,
    title: "W1SEman",
    difficulty: "Medium",
    category: "intermediate",
    image: "/images/w1seman.png",
  },
  {
    id: 3,
    title: "Endpoint investigation",
    difficulty: "Hard",
    category: "expert",
    image: "/images/endpoint-investigation.png",
  },
  {
    id: 4,
    title: "Network Analysis",
    difficulty: "Medium",
    category: "intermediate",
    image: "/images/network-analysis.png",
  },
  {
    id: 5,
    title: "Web Security",
    difficulty: "Easy",
    category: "beginner",
    image: "/images/web-security.png",
  },
];

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

const difficultyColor: Record<Difficulty, string> = {
  Easy: "text-green-500",
  Medium: "text-orange-500",
  Hard: "text-red-600",
};

export default function ProblemSlider() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);

  const [slideDirection, setSlideDirection] = useState<
    "left" | "right"
  >("right");

 
  const [animationKey, setAnimationKey] = useState(0);

  const activeTabIndex = tabs.findIndex(
    (tab) => tab.value === activeTab
  );

 
  const filteredProblems = useMemo(() => {
    if (activeTab === "all") {
      return problems;
    }

    return problems.filter(
      (problem) => problem.category === activeTab
    );
  }, [activeTab]);

  /**
   * Number of cards visible at desktop size.
   */
  const itemsPerPage = 3;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / itemsPerPage)
  );

  /**
   * Problems currently displayed.
   */
  const visibleProblems = filteredProblems.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  /**
   * Change category tab.
   */
  const handleTabChange = (value: string) => {
    if (value === activeTab) {
      return;
    }

    const newIndex = tabs.findIndex(
      (tab) => tab.value === value
    );

    /**
     * Determine animation direction based on tab position.
     */
    setSlideDirection(
      newIndex > activeTabIndex ? "right" : "left"
    );

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

    setSlideDirection(
      newPage > page ? "right" : "left"
    );

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
        <div className="mb-7 flex flex-wrap items-center gap-3">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`
                  min-w-[165px]
                  border
                  px-8
                  py-3
                  text-sm
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
            px-7
            py-8
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
              <span className="text-xl leading-none">
                ←
              </span>
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
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                  />
                ))}
              </div>
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
              <span className="text-xl leading-none">
                →
              </span>
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

function ProblemCard({
  problem,
}: {
  problem: Problem;
}) {
  return (
    <article
      className="
        flex
        h-[350px]
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* =====================================================
          Image
      ====================================================== */}
      <div
        className="
          aspect-[2.15/1]
          shrink-0
          overflow-hidden
          rounded-lg
          bg-gray-100
        "
      >
        <img
          src={problem.image}
          alt={problem.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            hover:scale-[1.03]
          "
        />
      </div>

      {/* =====================================================
          Card Content
      ====================================================== */}
      <div
        className="
          flex
          flex-1
          flex-col
          px-1
          pb-2
          pt-5
        "
      >
        {/* Difficulty */}
        <div
          className={`
            mb-2
            text-sm
            font-medium
            ${difficultyColor[problem.difficulty]}
          `}
        >
          {problem.difficulty}
        </div>

        {/* Title */}
        <h3
          className="
            mb-2
            text-[24px]
            font-bold
            leading-tight
            text-gray-800
          "
        >
          {problem.title}
        </h3>

        {/* =================================================
            Button

            mt-auto pushes this to the bottom regardless
            of the title/content height.
        ================================================== */}
      <a href={`/challenge?id=${problem.id}`}>
        <button
          type="button"
          className="
            mt-auto
            w-fit
            rounded-md
            bg-[#B01414]
            px-10
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-[#8F1010]
            active:scale-95
          "
        >
          ออกล่า
        </button>
      </a>
      </div>
    </article>
  );
}