import Navbar from "../../components/Navbar"
import Reveal from "../../components/effects/Reveal"

const leaderboard = [
  {
    rank: 1,
    username: "hacker_one",
    challenges: 24,
    points: 4820,
  },
  {
    rank: 2,
    username: "cyberfox",
    challenges: 21,
    points: 4210,
  },
  {
    rank: 3,
    username: "root_user",
    challenges: 19,
    points: 3980,
  },
  {
    rank: 4,
    username: "bytehunter",
    challenges: 17,
    points: 3640,
  },
  {
    rank: 5,
    username: "shadow",
    challenges: 15,
    points: 3210,
  },
]

const submissionData = [
  320,
  410,
  380,
  520,
  470,
  610,
  580,
  720,
  680,
  760,
  830,
  790,
  920,
  870,
]

/*
 * =========================================
 * Challenges
 * =========================================
 *
 * ตัวอย่างข้อมูล Challenge
 *
 * ภายหลังสามารถเปลี่ยนเป็นข้อมูลจาก API ได้
 */

const challenges = [
  {
    id: 1,
    challengeId: "phishing-in-the-dark",
    title: "Phishing in the Dark",
    category: "Web Security",
    difficulty: "Easy",
    points: 100,
    solved: 428,
    description:
      "ค้นหาและวิเคราะห์ช่องโหว่จากเว็บไซต์ที่ถูกสร้างขึ้นเพื่อจำลองสถานการณ์ Phishing",
  },
  {
    id: 2,
    challengeId: "hidden-message",
    title: "Hidden Message",
    category: "Cryptography",
    difficulty: "Medium",
    points: 250,
    solved: 216,
    description:
      "ค้นหาข้อความที่ถูกซ่อนอยู่และถอดรหัสเพื่อค้นหา Flag ที่ถูกต้อง",
  },
  {
    id: 3,
    challengeId: "digital-evidence",
    title: "Digital Evidence",
    category: "Forensics",
    difficulty: "Medium",
    points: 300,
    solved: 184,
    description:
      "วิเคราะห์ข้อมูล Digital Evidence เพื่อค้นหาเบาะแสที่นำไปสู่ Flag",
  },
  {
    id: 4,
    challengeId: "broken-auth",
    title: "Broken Authentication",
    category: "Web Security",
    difficulty: "Hard",
    points: 500,
    solved: 96,
    description:
      "ค้นหาจุดอ่อนของระบบ Authentication และเข้าถึงพื้นที่ที่ถูกป้องกัน",
  },
  {
    id: 5,
    challengeId: "memory-hunter",
    title: "Memory Hunter",
    category: "Forensics",
    difficulty: "Hard",
    points: 450,
    solved: 72,
    description:
      "วิเคราะห์ Memory Dump เพื่อค้นหาหลักฐานและข้อมูลสำคัญที่ถูกซ่อนอยู่",
  },
  {
    id: 6,
    challengeId: "reverse-me",
    title: "Reverse Me",
    category: "Reverse Engineering",
    difficulty: "Hard",
    points: 600,
    solved: 58,
    description:
      "Reverse Engineering โปรแกรมเพื่อค้นหา Logic และ Flag ที่ซ่อนอยู่",
  },
]

function StatCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-[#e8e5e3] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#b01414]/30 hover:shadow-lg">
      <p className="text-sm font-medium text-[#77716e]">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-[#403a38]">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-[#999390]">
          {description}
        </p>
      )}
    </div>
  )
}

function SubmissionChart() {
  const width = 900
  const height = 280
  const paddingX = 30
  const paddingY = 30

  const max = Math.max(...submissionData)
  const min = Math.min(...submissionData)

  const points = submissionData
    .map((value, index) => {
      const x =
        paddingX +
        (index /
          (submissionData.length - 1)) *
          (width - paddingX * 2)

      const y =
        height -
        paddingY -
        ((value - min) /
          (max - min)) *
          (height - paddingY * 2)

      return `${x},${y}`
    })
    .join(" ")

  const areaPoints = `${paddingX},${
    height - paddingY
  } ${points} ${
    width - paddingX
  },${height - paddingY}`

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-xl border border-[#eeeae8] bg-white p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[280px] w-full"
          preserveAspectRatio="none"
        >
          {/* Grid */}
          {[0, 1, 2, 3, 4].map(
            (line) => {
              const y =
                paddingY +
                (line / 4) *
                  (height - paddingY * 2)

              return (
                <line
                  key={line}
                  x1={paddingX}
                  x2={
                    width - paddingX
                  }
                  y1={y}
                  y2={y}
                  stroke="#e5e1df"
                  strokeWidth="1"
                />
              )
            }
          )}

          {/* Area */}
          <polygon
            points={areaPoints}
            fill="#b01414"
            fillOpacity="0.07"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#b01414"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {submissionData.map(
            (value, index) => {
              const x =
                paddingX +
                (index /
                  (submissionData.length -
                    1)) *
                  (width -
                    paddingX * 2)

              const y =
                height -
                paddingY -
                ((value - min) /
                  (max - min)) *
                  (height -
                    paddingY * 2)

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#b01414"
                />
              )
            }
          )}
        </svg>
      </div>

      <div className="mt-3 flex justify-between px-2 text-xs text-[#999390]">
        <span>Sep 1</span>
        <span>Sep 2</span>
        <span>Sep 3</span>
        <span>Sep 4</span>
        <span>Sep 5</span>
        <span>Sep 6</span>
        <span>Sep 7</span>
      </div>
    </div>
  )
}

function ChallengeCard({
  challenge,
}: {
  challenge: (typeof challenges)[number]
}) {
  const difficultyClass =
    challenge.difficulty === "Easy"
      ? "bg-green-50 text-green-700"
      : challenge.difficulty ===
          "Medium"
        ? "bg-yellow-50 text-yellow-700"
        : "bg-red-50 text-red-700"

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#e8e5e3] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#b01414]/30 hover:shadow-lg">

      {/* Top */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#b01414]/10 text-lg font-bold text-[#b01414]">
          #
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClass}`}
        >
          {challenge.difficulty}
        </span>

      </div>

      {/* Content */}

      <div className="mt-5">

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b01414]">
          {challenge.category}
        </p>

        <h3 className="mt-2 text-xl font-bold text-[#403a38] transition-colors group-hover:text-[#b01414]">
          {challenge.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#77716e]">
          {challenge.description}
        </p>

      </div>

      {/* Stats */}

      <div className="mt-6 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-[#faf9f8] p-3">
          <p className="text-xs text-[#999390]">
            Fish / คะแนน
          </p>

          <p className="mt-1 font-bold text-[#403a38]">
            {challenge.points.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-[#faf9f8] p-3">
          <p className="text-xs text-[#999390]">
            ทำสำเร็จแล้ว
          </p>

          <p className="mt-1 font-bold text-[#403a38]">
            {challenge.solved.toLocaleString()} คน
          </p>
        </div>

      </div>

      {/* Button */}

      <a
        href={`/challenge?id=${challenge.id}`}
        className="mt-6 flex h-11 items-center justify-center rounded-xl bg-[#b01414] px-4 text-sm font-semibold text-white transition-all hover:bg-[#961010] group-hover:shadow-md"
      >
        ดูโจทย์
        <svg
          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>

    </article>
  )
}

export default function AdminDashboard() {
  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-12 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">

            {/* =========================================
                Header
            ========================================= */}

            <div className="mb-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b01414]">
                ระบบผู้ดูแล
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#403a38] sm:text-5xl">
                แดชบอร์ด
              </h1>

              <p className="mt-3 text-sm text-[#77716e] sm:text-base">
                ภาพรวมการใช้งานและกิจกรรมของผู้เล่นในแพลตฟอร์ม CTF
              </p>
            </div>

            {/* =========================================
                Stats
            ========================================= */}

            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <StatCard
                title="ผู้ใช้งานทั้งหมด"
                value="1,284"
                description="จำนวนผู้ใช้งานในระบบทั้งหมด"
              />

              <StatCard
                title="Challenge ที่ทำสำเร็จ"
                value="8,492"
                description="จำนวน Challenge ที่ผู้เล่นทำสำเร็จทั้งหมด"
              />

              <StatCard
                title="ส่ง Flag ทั้งหมด"
                value="24,381"
                description="จำนวนการส่ง Flag จากผู้เล่นทั้งหมด"
              />

              <StatCard
                title="Fish / คะแนนที่ได้รับ"
                value="48,920"
                description="คะแนนรวมที่ผู้เล่นได้รับจากการทำ Challenge"
              />

              <StatCard
                title="การส่ง Flag ไม่สำเร็จ"
                value="12,743"
                description="จำนวน Flag ที่ส่งไม่ถูกต้อง"
              />

            </section>

            {/* =========================================
                Submissions Over Time
            ========================================= */}

            <section className="mt-6 rounded-2xl border border-[#e8e5e3] bg-white p-6 sm:p-8">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                  สถิติการใช้งาน
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                  จำนวนการส่ง Flag ตามช่วงเวลา
                </h2>

                <p className="mt-1 text-sm text-[#999390]">
                  แสดงจำนวนการส่ง Flag ของผู้เล่นในช่วง 7 วันที่ผ่านมา
                </p>
              </div>

              <SubmissionChart />

            </section>

            {/* =========================================
                Leaderboard
            ========================================= */}

            <section className="mt-6 overflow-hidden rounded-2xl border border-[#e8e5e3] bg-white">

              <div className="border-b border-[#eeeae8] p-6 sm:p-8">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                  อันดับผู้เล่น
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                  Leaderboard ปัจจุบัน
                </h2>

                <p className="mt-1 text-sm text-[#999390]">
                  อันดับผู้เล่นจากจำนวน Challenge ที่ทำสำเร็จและคะแนนรวม
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[600px]">

                  <thead>
                    <tr className="border-b border-[#eeeae8] text-left text-xs uppercase tracking-wider text-[#999390]">

                      <th className="px-6 py-4 font-semibold">
                        อันดับ
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        ผู้เล่น
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Challenge ที่สำเร็จ
                      </th>

                      <th className="px-6 py-4 text-right font-semibold">
                        Fish / คะแนน
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {leaderboard.map(
                      (user) => (
                        <tr
                          key={
                            user.rank
                          }
                          className="border-b border-[#f0edeb] last:border-0 transition-colors hover:bg-[#faf8f7]"
                        >

                          <td className="px-6 py-5">

                            <span
                              className={`font-bold ${
                                user.rank ===
                                1
                                  ? "text-[#b01414]"
                                  : "text-[#77716e]"
                              }`}
                            >
                              {user.rank}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1efed] text-sm font-bold text-[#403a38]">
                                {user.username
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <span className="font-medium text-[#403a38]">
                                {
                                  user.username
                                }
                              </span>

                            </div>

                          </td>

                          <td className="px-6 py-5 text-sm text-[#77716e]">
                            {
                              user.challenges
                            }
                          </td>

                          <td className="px-6 py-5 text-right font-semibold text-[#403a38]">
                            {user.points.toLocaleString()}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </section>

            {/* =========================================
                Challenges
            ========================================= */}

            <section className="mt-6">

              {/* Header */}

              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                    Challenge
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#403a38] sm:text-3xl">
                    โจทย์ทั้งหมด
                  </h2>

                  <p className="mt-1 text-sm text-[#999390]">
                    เลือก Challenge เพื่อเข้าสู่หน้าโจทย์และเริ่มทำภารกิจ
                  </p>

                </div>

                <a
                  href="/competition"
                  className="inline-flex items-center text-sm font-semibold text-[#b01414] transition-colors hover:text-[#961010]"
                >
                  ดูโจทย์ทั้งหมด
                  <svg
                    className="ml-1.5 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>

              </div>

              {/* Challenge Grid */}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {challenges.map(
                  (challenge) => (
                    <ChallengeCard
                      key={
                        challenge.id
                      }
                      challenge={
                        challenge
                      }
                    />
                  )
                )}

              </div>

            </section>

          </div>
        </main>
      </Reveal>
    </>
  )
}