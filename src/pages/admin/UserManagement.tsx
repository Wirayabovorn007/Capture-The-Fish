import { useMemo, useState } from "react"

type UserStatus = "active" | "suspended"

type User = {
  id: number
  username: string
  email: string
  fish: number
  points: number
  completedChallenges: number
  flagsSubmitted: number
  status: UserStatus
  joinedAt: string
  lastActive: string
}

const initialUsers: User[] = [
  {
    id: 1,
    username: "cyberfox",
    email: "cyberfox@example.com",
    fish: 1280,
    points: 4250,
    completedChallenges: 18,
    flagsSubmitted: 31,
    status: "active",
    joinedAt: "12 มิ.ย. 2026",
    lastActive: "วันนี้ 14:32",
  },
  {
    id: 2,
    username: "rootkit",
    email: "rootkit@example.com",
    fish: 950,
    points: 3820,
    completedChallenges: 15,
    flagsSubmitted: 27,
    status: "active",
    joinedAt: "10 มิ.ย. 2026",
    lastActive: "วันนี้ 13:18",
  },
  {
    id: 3,
    username: "packetcat",
    email: "packetcat@example.com",
    fish: 740,
    points: 2940,
    completedChallenges: 11,
    flagsSubmitted: 24,
    status: "active",
    joinedAt: "8 มิ.ย. 2026",
    lastActive: "วันนี้ 11:45",
  },
  {
    id: 4,
    username: "nullbyte",
    email: "nullbyte@example.com",
    fish: 420,
    points: 1760,
    completedChallenges: 7,
    flagsSubmitted: 19,
    status: "suspended",
    joinedAt: "4 มิ.ย. 2026",
    lastActive: "เมื่อวาน 19:20",
  },
  {
    id: 5,
    username: "shellfish",
    email: "shellfish@example.com",
    fish: 310,
    points: 1240,
    completedChallenges: 5,
    flagsSubmitted: 13,
    status: "active",
    joinedAt: "1 มิ.ย. 2026",
    lastActive: "เมื่อวาน 17:03",
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [userSearch, setUserSearch] = useState("")
  const [userStatusFilter, setUserStatusFilter] =
    useState<"all" | UserStatus>("all")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)

      const matchesStatus =
        userStatusFilter === "all" ||
        user.status === userStatusFilter

      return matchesSearch && matchesStatus
    })
  }, [users, userSearch, userStatusFilter])

  const selectedUser = selectedUserId
    ? users.find((user) => user.id === selectedUserId) ?? null
    : null

  const handleToggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "active"
                  ? "suspended"
                  : "active",
            }
          : user,
      ),
    )
  }

  const handleCloseUserDetails = () => {
    setSelectedUserId(null)
  }

  return (
    <>
      <div className="space-y-6">
        {/* User Overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e5e1df] bg-white p-5">
            <p className="text-sm text-[#77716e]">
              ผู้ใช้ทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-bold text-[#403a38]">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1df] bg-white p-5">
            <p className="text-sm text-[#77716e]">
              ผู้ใช้งานอยู่
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                users.filter(
                  (user) => user.status === "active",
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1df] bg-white p-5">
            <p className="text-sm text-[#77716e]">
              ถูกระงับ
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {
                users.filter(
                  (user) => user.status === "suspended",
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1df] bg-white p-5">
            <p className="text-sm text-[#77716e]">
              Fish ทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-bold text-[#b01414]">
              {users
                .reduce(
                  (total, user) => total + user.fish,
                  0,
                )
                .toLocaleString()}
            </p>
          </div>
        </section>

        {/* User List */}
        <section className="overflow-hidden rounded-2xl border border-[#e5e1df] bg-white">
          {/* Header */}
          <div className="border-b border-[#eeeae8] p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                  User Management
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                  ผู้ใช้งานทั้งหมด
                </h2>

                <p className="mt-1 text-sm text-[#77716e]">
                  ค้นหา ตรวจสอบ และจัดการบัญชีผู้เล่น
                </p>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_200px]">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999390]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                  type="text"
                  value={userSearch}
                  onChange={(event) =>
                    setUserSearch(event.target.value)
                  }
                  placeholder="ค้นหาจาก Username หรือ Email..."
                  className="
                    h-12 w-full
                    rounded-xl
                    border
                    border-[#d8d2cf]
                    bg-[#faf9f8]
                    pl-12 pr-4
                    text-sm
                    text-[#403a38]
                    outline-none
                    transition-all
                    placeholder:text-[#aaa4a1]
                    focus:border-[#b01414]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#b01414]/10
                  "
                />
              </div>

              <select
                value={userStatusFilter}
                onChange={(event) =>
                  setUserStatusFilter(
                    event.target.value as
                      | "all"
                      | UserStatus,
                  )
                }
                className="
                  h-12 w-full
                  rounded-xl
                  border
                  border-[#d8d2cf]
                  bg-[#faf9f8]
                  px-4
                  text-sm
                  text-[#403a38]
                  outline-none
                  transition-all
                  focus:border-[#b01414]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#b01414]/10
                "
              >
                <option value="all">
                  สถานะทั้งหมด
                </option>

                <option value="active">
                  ใช้งานอยู่
                </option>

                <option value="suspended">
                  ถูกระงับ
                </option>
              </select>
            </div>
          </div>

          {/* Result Count */}
          <div className="border-b border-[#eeeae8] bg-[#faf9f8] px-6 py-3 sm:px-8">
            <p className="text-sm text-[#77716e]">
              พบ{" "}
              <span className="font-semibold text-[#403a38]">
                {filteredUsers.length}
              </span>{" "}
              ผู้ใช้
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#eeeae8] bg-[#faf9f8]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    ผู้ใช้งาน
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    Fish
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    คะแนน
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    สำเร็จ
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    Flags
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    สถานะ
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#999390]">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eeeae8]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[#faf9f8]"
                  >
                    {/* User */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b01414]/10 text-sm font-bold text-[#b01414]">
                          {user.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-[#403a38]">
                            {user.username}
                          </p>

                          <p className="mt-0.5 text-xs text-[#999390]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Fish */}
                    <td className="px-4 py-5">
                      <span className="font-semibold text-[#b01414]">
                        {user.fish.toLocaleString()}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="px-4 py-5">
                      <span className="font-semibold text-[#403a38]">
                        {user.points.toLocaleString()}
                      </span>
                    </td>

                    {/* Completed */}
                    <td className="px-4 py-5 text-sm text-[#77716e]">
                      {user.completedChallenges}
                    </td>

                    {/* Flags */}
                    <td className="px-4 py-5 text-sm text-[#77716e]">
                      {user.flagsSubmitted}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-5">
                      {user.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          ใช้งานอยู่
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          ถูกระงับ
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUserId(user.id)
                          }
                          className="
                            rounded-lg
                            border
                            border-[#d8d2cf]
                            bg-white
                            px-3 py-2
                            text-xs
                            font-semibold
                            text-[#403a38]
                            transition-all
                            hover:border-[#b01414]
                            hover:text-[#b01414]
                          "
                        >
                          ดูรายละเอียด
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleUserStatus(user.id)
                          }
                          className={`
                            rounded-lg
                            border
                            px-3 py-2
                            text-xs
                            font-semibold
                            transition-all
                            ${
                              user.status === "active"
                                ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                                : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                            }
                          `}
                        >
                          {user.status === "active"
                            ? "ระงับ"
                            : "เปิดใช้งาน"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#eeeae8] lg:hidden">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b01414]/10 text-sm font-bold text-[#b01414]">
                      {user.username
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-[#403a38]">
                        {user.username}
                      </p>

                      <p className="truncate text-xs text-[#999390]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {user.status === "active" ? (
                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      ใช้งานอยู่
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                      ถูกระงับ
                    </span>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-[#faf9f8] p-3">
                    <p className="text-xs text-[#999390]">
                      Fish
                    </p>

                    <p className="mt-1 font-bold text-[#b01414]">
                      {user.fish.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-3">
                    <p className="text-xs text-[#999390]">
                      คะแนน
                    </p>

                    <p className="mt-1 font-bold text-[#403a38]">
                      {user.points.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-3">
                    <p className="text-xs text-[#999390]">
                      สำเร็จ
                    </p>

                    <p className="mt-1 font-bold text-[#403a38]">
                      {user.completedChallenges}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-3">
                    <p className="text-xs text-[#999390]">
                      Flags
                    </p>

                    <p className="mt-1 font-bold text-[#403a38]">
                      {user.flagsSubmitted}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedUserId(user.id)
                    }
                    className="
                      flex-1
                      rounded-lg
                      border
                      border-[#d8d2cf]
                      bg-white
                      px-3 py-2
                      text-xs
                      font-semibold
                      text-[#403a38]
                      transition-all
                      hover:border-[#b01414]
                      hover:text-[#b01414]
                    "
                  >
                    ดูรายละเอียด
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleUserStatus(user.id)
                    }
                    className={`
                      flex-1
                      rounded-lg
                      border
                      px-3 py-2
                      text-xs
                      font-semibold
                      transition-all
                      ${
                        user.status === "active"
                          ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                          : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                      }
                    `}
                  >
                    {user.status === "active"
                      ? "ระงับบัญชี"
                      : "เปิดใช้งาน"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f1ef]">
                🔍
              </div>

              <h3 className="mt-4 font-semibold text-[#403a38]">
                ไม่พบผู้ใช้งาน
              </h3>

              <p className="mt-1 text-sm text-[#999390]">
                ลองเปลี่ยนคำค้นหาหรือตัวกรอง
              </p>
            </div>
          )}
        </section>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseUserDetails()
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-[#eeeae8] px-6 py-5 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#b01414]/10 text-xl font-bold text-[#b01414]">
                    {selectedUser.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-[#403a38]">
                        {selectedUser.username}
                      </h2>

                      {selectedUser.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          ใช้งานอยู่
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          ถูกระงับ
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-[#77716e]">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseUserDetails}
                  aria-label="ปิด"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-[#77716e]
                    transition-colors
                    hover:bg-[#f5f3f2]
                    hover:text-[#403a38]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M18 6 6 18"
                      strokeLinecap="round"
                    />
                    <path
                      d="m6 6 12 12"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
              {/* Account Information */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                  Account Information
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#faf9f8] p-4">
                    <p className="text-xs text-[#999390]">
                      User ID
                    </p>

                    <p className="mt-1 font-semibold text-[#403a38]">
                      #{selectedUser.id}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-4">
                    <p className="text-xs text-[#999390]">
                      Email
                    </p>

                    <p className="mt-1 break-all font-semibold text-[#403a38]">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-4">
                    <p className="text-xs text-[#999390]">
                      วันที่สมัคร
                    </p>

                    <p className="mt-1 font-semibold text-[#403a38]">
                      {selectedUser.joinedAt}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf9f8] p-4">
                    <p className="text-xs text-[#999390]">
                      Active ล่าสุด
                    </p>

                    <p className="mt-1 font-semibold text-[#403a38]">
                      {selectedUser.lastActive}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                  Player Statistics
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#eeeae8] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#77716e]">
                        Fish
                      </p>

                      <span className="text-lg"></span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#b01414]">
                      {selectedUser.fish.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#eeeae8] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#77716e]">
                        คะแนน
                      </p>

                      <span className="text-lg"></span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#403a38]">
                      {selectedUser.points.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#eeeae8] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#77716e]">
                        Challenge ที่สำเร็จ
                      </p>

                      <span className="text-lg"></span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#403a38]">
                      {selectedUser.completedChallenges}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#eeeae8] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#77716e]">
                        Flags ที่ส่ง
                      </p>

                      <span className="text-lg"></span>
                    </div>

                    <p className="mt-2 text-2xl font-bold text-[#403a38]">
                      {selectedUser.flagsSubmitted}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae8] bg-[#faf9f8] px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={handleCloseUserDetails}
                className="
                  rounded-xl
                  border
                  border-[#d8d2cf]
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-[#403a38]
                  transition-all
                  hover:border-[#b01414]
                  hover:text-[#b01414]
                "
              >
                ปิด
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleUserStatus(selectedUser.id)
                }}
                className={`
                  rounded-xl
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  ${
                    selectedUser.status === "active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }
                `}
              >
                {selectedUser.status === "active"
                  ? "ระงับบัญชี"
                  : "เปิดใช้งานบัญชี"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}