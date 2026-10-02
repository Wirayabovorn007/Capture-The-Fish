import { useEffect, useMemo, useRef, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getLeaderboard, getMyProfileStats, type LeaderboardPlayer, type MyProfileStats } from "../services/userApi"

export default function Leaderboard() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [profile, setProfile] = useState<MyProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const [leaderboardData, profileData] = await Promise.all([
          getLeaderboard(),
          getMyProfileStats(),
        ])
        setPlayers(leaderboardData)
        setProfile(profileData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลด Leaderboard ได้")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const currentPlayer = useMemo(
    () => players.find((player) => player.isCurrentUser),
    [players],
  )
  const topThree = players.slice(0, 3)
  const first = topThree[0]
  const second = topThree[1]
  const third = topThree[2]
  const completed = profile?.completedChallenges ?? currentPlayer?.completedChallenges ?? 0
  const totalChallenges = profile?.totalChallenges ?? 0
  const progressPercent = totalChallenges > 0 ? Math.min(100, (completed / totalChallenges) * 100) : 0

  const Avatar = ({ size = "h-28 w-28", name = "U" }: { size?: string; name?: string }) => (
    <div className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-8 border-[#f5e5e5] bg-[#444] text-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:border-[#b01414] hover:shadow-lg`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )

  const Podium = ({ player, place, primary = false }: { player?: LeaderboardPlayer; place: number; primary?: boolean }) => {
    if (!player) return <div className="w-[30%] max-w-[220px]" />
    return (
      <div className="group flex w-[30%] max-w-[220px] cursor-pointer flex-col items-center">
        <div className="-mb-8 z-10 sm:-mb-12">
          <Avatar name={player.username} size="h-14 w-14 sm:h-28 sm:w-28 lg:h-32 lg:w-32" />
        </div>
        <div className={`flex w-full flex-col items-center justify-end pb-8 text-white transition-all duration-300 sm:pb-12 ${primary ? "h-[240px] bg-[#b01414] group-hover:-translate-y-3 group-hover:bg-[#980f0f] group-hover:shadow-2xl sm:h-[300px] lg:h-[340px]" : "h-[200px] bg-[#444] group-hover:-translate-y-2 group-hover:bg-[#333] group-hover:shadow-xl sm:h-[260px] lg:h-[280px]"}`}>
          <span className={`${primary ? "text-5xl sm:text-7xl lg:text-8xl" : "text-4xl sm:text-6xl lg:text-7xl"} font-bold leading-none transition-transform duration-300 group-hover:scale-110`}>
            {place}
          </span>
          <span className="mt-3 text-xs sm:text-sm">{player.fish.toLocaleString()}</span>
          <span className="mt-1 text-[10px] text-gray-200 sm:text-xs">จำนวนปลา</span>
          <span className="mt-1 max-w-full truncate px-1 text-sm font-bold sm:text-lg">{player.username}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute w-full">
      <Navbar />

      <section className="absolute top-0 z-0 w-full overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pt-40" style={{ background: "linear-gradient(135deg, #3D3D3D 0%, #1e1e1e 100%)" }}>
        <span aria-hidden="true" className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[14rem] font-bold leading-none text-white/[0.04] sm:text-[26rem] lg:text-[32rem]">123</span>
        <div ref={heroRef} className="relative z-10 mx-auto max-w-6xl">
          <h1 className="cursor-default text-4xl font-bold text-white transition-all duration-300 hover:translate-x-1 hover:text-gray-200 sm:text-5xl">Leaderboard</h1>

          <div className="mt-6 flex flex-col gap-6 transition-all duration-300 sm:flex-row sm:items-center sm:gap-5">
            <Avatar name={currentPlayer?.username ?? "U"} size="h-28 w-28 sm:h-32 sm:w-32" />
            <div className="group cursor-default transition-transform duration-300 hover:translate-x-1">
              <h2 className="text-3xl font-bold text-white transition-colors duration-300 group-hover:text-[#b01414] sm:text-4xl">
                {loading ? "กำลังโหลด..." : currentPlayer?.username ?? "User"}
              </h2>
              <div className="mt-2 flex gap-8">
                <div>
                  <p className="text-xs text-gray-400">อันดับ</p>
                  <p className="text-3xl font-bold leading-none text-white">{currentPlayer?.rank ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">จำนวนปลา</p>
                  <p className="text-3xl font-bold leading-none text-white">{(currentPlayer?.fish ?? profile?.fish ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="group mt-2 sm:ml-auto sm:mt-0">
              <div className="text-right">
                <p className="text-xs text-gray-400">เคลียร์โจทย์</p>
                <p className="text-3xl font-bold leading-none text-white transition-colors duration-300 group-hover:text-[#b01414]">{completed}/{totalChallenges}</p>
              </div>
              <div className="mt-3 h-3 w-48 overflow-hidden rounded-full bg-gray-500 sm:w-56">
                <div className="h-full bg-[#b01414] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mt-[600px] min-h-screen px-4 pb-24 pt-12 sm:mt-[460px] sm:px-8 lg:mt-[400px]">
        {error && <div className="mx-auto mb-6 max-w-6xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mx-auto mt-10 max-w-5xl text-right text-sm text-[#b01414]">
          {topThree.map((player) => (
            <p key={player.userId} className="transition-transform duration-200 hover:-translate-x-1">
              No{player.rank}: {player.username} {player.fish.toLocaleString()}
            </p>
          ))}
        </div>

        <section className="mx-auto max-w-6xl">
          {loading ? (
            <div className="py-24 text-center text-[#77716e]">กำลังโหลด Leaderboard...</div>
          ) : (
            <>
              <div className="relative mx-auto mb-0 flex max-w-5xl items-end justify-center gap-3 sm:gap-10">
                <Podium player={second} place={2} />
                <Podium player={first} place={1} primary />
                <Podium player={third} place={3} />
              </div>

              <div className="mt-6 min-h-[420px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="grid grid-cols-[35px_1fr_100px] border-b border-gray-200 px-4 py-3 text-xs text-[#b01414] sm:grid-cols-[60px_1fr_160px] sm:px-6 sm:py-4 sm:text-sm">
                  <span>No.</span><span>Username</span><span className="text-right">Fish amount</span>
                </div>
                {players.map((player) => (
                  <div key={player.userId} className={`group grid cursor-pointer grid-cols-[35px_1fr_100px] items-center px-4 py-3 text-xs text-[#b01414] transition-all duration-200 hover:bg-[#fff5f5] sm:grid-cols-[60px_1fr_160px] sm:px-6 sm:py-4 sm:text-sm ${player.isCurrentUser ? "bg-[#fff8f8]" : ""}`}>
                    <span>{player.rank}</span>
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                      <Avatar name={player.username} size="h-8 w-8 border-2 sm:h-10 sm:w-10" />
                      <span className="truncate transition-all duration-200 group-hover:translate-x-1 group-hover:font-bold">{player.username}</span>
                    </div>
                    <span className="text-right transition-all duration-200 group-hover:-translate-x-1 group-hover:font-bold">{player.fish.toLocaleString()}</span>
                  </div>
                ))}
                {!players.length && <div className="py-16 text-center text-sm text-gray-500">ยังไม่มีข้อมูลผู้เล่น</div>}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
