import { useEffect, useMemo, useState } from "react"
import { RefreshCw, Search, ShieldBan, ShieldCheck, Users } from "lucide-react"
import Navbar from "../../components/admin/Navbar"
import { getUsers, suspendUser, unsuspendUser, type ManagedUser, type AccountStatus } from "../../services/userApi"

function formatDate(value: string | null) {
  if (!value) return "ยังไม่เคยใช้งาน"
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value))
}

export default function UserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | AccountStatus>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<ManagedUser | null>(null)
  const [changingId, setChangingId] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getUsers()
      setUsers(data)
      if (selected) setSelected(data.find((u) => u.id === selected.id) ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลผู้ใช้ไม่สำเร็จ")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadUsers() }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch = !q || user.username.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [users, search, statusFilter])

  const onlineCount = users.filter((u) => u.isOnline).length
  const suspendedCount = users.filter((u) => u.accountStatus === "suspended").length
  const totalFish = users.reduce((sum, u) => sum + u.fish, 0)

  const toggleStatus = async (user: ManagedUser) => {
    try {
      setChangingId(user.id)
      setError("")
      if (user.accountStatus === "active") await suspendUser(user)
      else await unsuspendUser(user)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "เปลี่ยนสถานะบัญชีไม่สำเร็จ")
    } finally {
      setChangingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#26211f]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#B01414]">ADMIN</p>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="mt-1 text-sm text-gray-500">จัดการบัญชีและดูสถิติผู้เล่นจาก Cognito และ DynamoDB</p>
          </div>
          <button onClick={() => void loadUsers()} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:border-[#B01414] disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> รีเฟรช
          </button>
        </div>

        {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Summary title="ผู้ใช้ทั้งหมด" value={users.length} />
          <Summary title="ออนไลน์" value={onlineCount} />
          <Summary title="ถูกระงับ" value={suspendedCount} />
          <Summary title="Fish ทั้งหมด" value={totalFish} />
        </section>

        <section className="mt-7 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหา Username หรือ Email" className="w-full rounded-lg border py-2.5 pl-10 pr-3 outline-none focus:border-[#B01414]" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | AccountStatus)} className="rounded-lg border bg-white px-3 py-2.5 outline-none focus:border-[#B01414]">
              <option value="all">ทุกสถานะบัญชี</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading && users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">กำลังโหลดผู้ใช้...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">ไม่พบผู้ใช้</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr><th className="px-5 py-4">ผู้ใช้</th><th className="px-4 py-4">Fish</th><th className="px-4 py-4">คะแนน</th><th className="px-4 py-4">สำเร็จ</th><th className="px-4 py-4">Flags</th><th className="px-4 py-4">ออนไลน์</th><th className="px-4 py-4">บัญชี</th><th className="px-4 py-4">จัดการ</th></tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4"><button onClick={() => setSelected(user)} className="text-left"><div className="font-bold">{user.username}</div><div className="text-xs text-gray-500">{user.email}</div></button></td>
                      <td className="px-4 py-4">{user.fish}</td><td className="px-4 py-4">{user.points}</td><td className="px-4 py-4">{user.completedChallenges}</td><td className="px-4 py-4">{user.flagsSubmitted}</td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-2 ${user.isOnline ? "text-green-700" : "text-gray-500"}`}><span className={`h-2.5 w-2.5 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-300"}`} />{user.isOnline ? "Online" : "Offline"}</span></td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.accountStatus === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{user.accountStatus}</span></td>
                      <td className="px-4 py-4"><button onClick={() => void toggleStatus(user)} disabled={changingId === user.id} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${user.accountStatus === "active" ? "bg-[#B01414]" : "bg-green-700"}`}>{user.accountStatus === "active" ? <ShieldBan className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}{changingId === user.id ? "กำลังบันทึก..." : user.accountStatus === "active" ? "ระงับ" : "ปลดระงับ"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between"><div><p className="text-sm text-[#B01414]">รายละเอียดผู้ใช้</p><h2 className="text-2xl font-bold">{selected.username}</h2><p className="text-sm text-gray-500">{selected.email}</p></div><button onClick={() => setSelected(null)} className="text-xl text-gray-400">×</button></div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm"><Detail label="User ID" value={selected.id} /><Detail label="สร้างบัญชี" value={formatDate(selected.createdAt)} /><Detail label="Active ล่าสุด" value={formatDate(selected.lastActiveAt)} /><Detail label="สถานะออนไลน์" value={selected.isOnline ? "Online" : "Offline"} /><Detail label="Fish" value={String(selected.fish)} /><Detail label="คะแนน" value={String(selected.points)} /><Detail label="Challenge ที่สำเร็จ" value={String(selected.completedChallenges)} /><Detail label="Flags ที่ส่งถูก" value={String(selected.flagsSubmitted)} /></div>
            <button onClick={() => void toggleStatus(selected)} disabled={changingId === selected.id} className={`mt-6 w-full rounded-lg py-3 font-semibold text-white disabled:opacity-50 ${selected.accountStatus === "active" ? "bg-[#B01414]" : "bg-green-700"}`}>{selected.accountStatus === "active" ? "ระงับบัญชีนี้" : "ปลดระงับบัญชีนี้"}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Summary({ title, value }: { title: string; value: number }) { return <div className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-sm text-gray-500"><Users className="h-4 w-4" />{title}</div><p className="mt-2 text-3xl font-bold">{value}</p></div> }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 break-all font-semibold">{value}</p></div> }
