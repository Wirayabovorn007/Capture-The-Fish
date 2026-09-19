import { FormEvent, useMemo, useState } from "react"
import Navbar from "../../components/Navbar"
import Reveal from "../../components/effects/Reveal"

type ManagementTab = "users" | "challenges"

type DockerContainer = {
  id: number
  name: string
  image: string
  port: string
}

type Challenge = {
  id: number
  title: string
  challengeId: string
  category: string
  description: string
  containers: DockerContainer[]
}

type ChallengeForm = {
  title: string
  challengeId: string
  category: string
  description: string
  containers: DockerContainer[]
}

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

const categories = [
  "Web Security",
  "Cryptography",
  "Forensics",
  "Reverse Engineering",
  "Pwn",
  "OSINT",
  "Miscellaneous",
]

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "Phishing in the Dark",
    challengeId: "phishing-in-the-dark",
    category: "Web Security",
    description:
      "ค้นหาและวิเคราะห์ช่องโหว่จากเว็บไซต์ที่ถูกสร้างขึ้นเพื่อจำลองสถานการณ์ Phishing",
    containers: [
      {
        id: 101,
        name: "app",
        image: "ctfarena/phishing-dark:latest",
        port: "80",
      },
    ],
  },
  {
    id: 2,
    title: "Hidden Message",
    challengeId: "hidden-message",
    category: "Cryptography",
    description:
      "ค้นหาข้อความที่ถูกซ่อนอยู่และถอดรหัสเพื่อค้นหา Flag ที่ถูกต้อง",
    containers: [
      {
        id: 201,
        name: "crypto",
        image: "ctfarena/hidden-message:latest",
        port: "8080",
      },
    ],
  },
  {
    id: 3,
    title: "Digital Evidence",
    challengeId: "digital-evidence",
    category: "Forensics",
    description:
      "วิเคราะห์ข้อมูล Digital Evidence เพื่อค้นหาเบาะแสที่นำไปสู่ Flag",
    containers: [],
  },
]

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

function createEmptyContainer(): DockerContainer {
  return {
    id: Date.now() + Math.random(),
    name: "",
    image: "",
    port: "80",
  }
}

function createEmptyChallenge(): ChallengeForm {
  return {
    title: "",
    challengeId: "",
    category: "Web Security",
    description: "",
    containers: [createEmptyContainer()],
  }
}

function createChallengeId(title: string) {
  if (!title.trim()) {
    return ""
  }

  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function Management() {
  const [activeTab, setActiveTab] =
    useState<ManagementTab>("users")

  /*
   * =========================================
   * User Management State
   * =========================================
   */

  const [users, setUsers] =
    useState<User[]>(initialUsers)

  const [userSearch, setUserSearch] =
    useState("")

  const [userStatusFilter, setUserStatusFilter] =
    useState<"all" | UserStatus>("all")

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null)

  /*
   * =========================================
   * Challenge Management State
   * =========================================
   */

  const [challenges, setChallenges] =
    useState<Challenge[]>(initialChallenges)

  const [challenge, setChallenge] =
    useState<ChallengeForm>(
      createEmptyChallenge()
    )

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [showForm, setShowForm] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState("")

  const [isSaving, setIsSaving] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [deletingChallenge, setDeletingChallenge] =
    useState<Challenge | null>(null)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const isEditing = editingId !== null

  /*
   * =========================================
   * User Filtering
   * =========================================
   */

  const filteredUsers = useMemo(() => {
    const query = userSearch
      .trim()
      .toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.username
          .toLowerCase()
          .includes(query) ||
        user.email
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        userStatusFilter === "all" ||
        user.status === userStatusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })
  }, [
    users,
    userSearch,
    userStatusFilter,
  ])

  const selectedUser = selectedUserId
    ? users.find(
        (user) =>
          user.id === selectedUserId
      ) ?? null
    : null

  /*
   * =========================================
   * User Actions
   * =========================================
   */

  const handleToggleUserStatus = (
    userId: number
  ) => {
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
          : user
      )
    )
  }

  const handleCloseUserDetails = () => {
    setSelectedUserId(null)
  }

  /*
   * =========================================
   * Challenge Filtering
   * =========================================
   */

  const filteredChallenges = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase()

    if (!query) {
      return challenges
    }

    return challenges.filter((item) => {
      return (
        item.title
          .toLowerCase()
          .includes(query) ||
        item.challengeId
          .toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query)
      )
    })
  }, [challenges, searchQuery])

  /*
   * =========================================
   * Challenge Update
   * =========================================
   */

  const updateChallenge = (
    field: keyof Omit<
      ChallengeForm,
      "containers"
    >,
    value: string
  ) => {
    setChallenge((prev) => ({
      ...prev,
      [field]: value,

      ...(field === "title"
        ? {
            challengeId:
              createChallengeId(value),
          }
        : {}),
    }))
  }

  /*
   * =========================================
   * Container Update
   * =========================================
   */

  const updateContainer = (
    id: number,
    field: keyof DockerContainer,
    value: string
  ) => {
    setChallenge((prev) => ({
      ...prev,

      containers:
        prev.containers.map(
          (container) =>
            container.id === id
              ? {
                  ...container,
                  [field]: value,
                }
              : container
        ),
    }))
  }

  const addContainer = () => {
    setChallenge((prev) => ({
      ...prev,

      containers: [
        ...prev.containers,
        createEmptyContainer(),
      ],
    }))
  }

  const removeContainer = (
    id: number
  ) => {
    setChallenge((prev) => {
      if (
        prev.containers.length <= 1
      ) {
        return prev
      }

      return {
        ...prev,

        containers:
          prev.containers.filter(
            (container) =>
              container.id !== id
          ),
      }
    })
  }

  /*
   * =========================================
   * Create Challenge
   * =========================================
   */

  const handleCreateNew = () => {
    setEditingId(null)
    setChallenge(
      createEmptyChallenge()
    )
    setMessage("")
    setShowForm(true)

    setTimeout(() => {
      document
        .getElementById(
          "challenge-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

  /*
   * =========================================
   * Edit Challenge
   * =========================================
   */

  const handleEdit = (
    selectedChallenge: Challenge
  ) => {
    setEditingId(
      selectedChallenge.id
    )

    setChallenge({
      title: selectedChallenge.title,
      challengeId:
        selectedChallenge.challengeId,
      category:
        selectedChallenge.category,
      description:
        selectedChallenge.description,
      containers:
        selectedChallenge.containers.map(
          (container) => ({
            ...container,
          })
        ),
    })

    setMessage("")
    setShowForm(true)

    setTimeout(() => {
      document
        .getElementById(
          "challenge-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

  /*
   * =========================================
   * Delete Challenge
   * =========================================
   */

  const handleDeleteChallenge = (
    selectedChallenge: Challenge
  ) => {
    setMessage("")
    setDeletingChallenge(selectedChallenge)
  }

  const confirmDeleteChallenge = async () => {
    if (!deletingChallenge) {
      return
    }

    const challengeToDelete = deletingChallenge

    setIsDeleting(true)
    setMessage("")

    try {
      /*
       * TODO:
       * DELETE /api/admin/challenges/:id
       */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      )

      setChallenges((prev) =>
        prev.filter(
          (item) =>
            item.id !== challengeToDelete.id
        )
      )

      if (editingId === challengeToDelete.id) {
        setEditingId(null)
        setChallenge(createEmptyChallenge())
        setShowForm(false)
      }

      setDeletingChallenge(null)
      setMessage(
        `ลบโจทย์ "${challengeToDelete.title}" สำเร็จ`
      )
    } catch {
      setMessage(
        "ไม่สามารถลบโจทย์ได้ กรุณาลองใหม่อีกครั้ง"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  /*
   * =========================================
   * Cancel Challenge Form
   * =========================================
   */

  const handleCancel = () => {
    setEditingId(null)
    setChallenge(
      createEmptyChallenge()
    )
    setMessage("")
    setShowForm(false)
  }

  /*
   * =========================================
   * Submit Challenge
   * =========================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setMessage("")

    if (!challenge.title.trim()) {
      setMessage(
        "กรุณากรอกชื่อโจทย์"
      )
      return
    }

    if (
      !challenge.description.trim()
    ) {
      setMessage(
        "กรุณากรอกรายละเอียดโจทย์"
      )
      return
    }

    const invalidContainer =
      challenge.containers.some(
        (container) =>
          !container.name.trim() ||
          !container.image.trim() ||
          !container.port.trim()
      )

    if (invalidContainer) {
      setMessage(
        "กรุณากรอกข้อมูล Docker Container ให้ครบถ้วน"
      )
      return
    }

    setIsSaving(true)

    try {
      /*
       * TODO:
       * POST /api/admin/challenges
       * PUT  /api/admin/challenges/:id
       */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 700)
      )

      if (
        isEditing &&
        editingId !== null
      ) {
        setChallenges((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  title:
                    challenge.title,
                  challengeId:
                    challenge.challengeId,
                  category:
                    challenge.category,
                  description:
                    challenge.description,
                  containers:
                    challenge.containers,
                }
              : item
          )
        )

        setMessage(
          "แก้ไขโจทย์สำเร็จ"
        )
      } else {
        const newChallenge: Challenge = {
          id: Date.now(),
          title: challenge.title,
          challengeId:
            challenge.challengeId,
          category:
            challenge.category,
          description:
            challenge.description,
          containers:
            challenge.containers,
        }

        setChallenges((prev) => [
          newChallenge,
          ...prev,
        ])

        setMessage(
          "สร้างโจทย์สำเร็จ"
        )
      }

      setEditingId(null)
      setChallenge(
        createEmptyChallenge()
      )
      setShowForm(false)
    } catch {
      setMessage(
        isEditing
          ? "ไม่สามารถแก้ไขโจทย์ได้ กรุณาลองใหม่อีกครั้ง"
          : "ไม่สามารถสร้างโจทย์ได้ กรุณาลองใหม่อีกครั้ง"
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">

            {/* =================================
                Page Header
            ================================= */}

            <div className="mb-8">
              <p className="font-medium uppercase tracking-[0.2em] text-[#b01414]">
                ระบบผู้ดูแล
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#403a38] sm:text-5xl">
                จัดการระบบ
              </h1>

              <p className="mt-3 text-[#77716e]">
                จัดการผู้ใช้งานและ Challenge ภายในแพลตฟอร์ม
              </p>
            </div>

            {/* =================================
                Tabs
            ================================= */}

            <div className="mb-8 flex flex-wrap gap-2 border-b border-[#ddd8d5]">

              <button
                type="button"
                onClick={() =>
                  setActiveTab("users")
                }
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === "users"
                    ? "border-b-2 border-[#b01414] text-[#b01414]"
                    : "text-[#77716e] hover:text-[#403a38]"
                }`}
              >
                จัดการผู้ใช้งาน
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "challenges"
                  )
                }
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab ===
                  "challenges"
                    ? "border-b-2 border-[#b01414] text-[#b01414]"
                    : "text-[#77716e] hover:text-[#403a38]"
                }`}
              >
                จัดการ Challenge
              </button>

            </div>

            {/* =================================
                USER MANAGEMENT
            ================================= */}

            {activeTab === "users" && (
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
                          (user) =>
                            user.status ===
                            "active"
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
                          (user) =>
                            user.status ===
                            "suspended"
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
                          (
                            total,
                            user
                          ) =>
                            total +
                            user.fish,
                          0
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
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                          />
                          <path d="m20 20-3.5-3.5" />
                        </svg>

                        <input
                          type="text"
                          value={
                            userSearch
                          }
                          onChange={(
                            event
                          ) =>
                            setUserSearch(
                              event.target
                                .value
                            )
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
                        value={
                          userStatusFilter
                        }
                        onChange={(
                          event
                        ) =>
                          setUserStatusFilter(
                            event.target
                              .value as
                              | "all"
                              | UserStatus
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
                        {
                          filteredUsers.length
                        }
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

                        {filteredUsers.map(
                          (user) => (
                            <tr
                              key={
                                user.id
                              }
                              className="transition-colors hover:bg-[#faf9f8]"
                            >

                              {/* User */}

                              <td className="px-6 py-5">

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b01414]/10 text-sm font-bold text-[#b01414]">
                                    {user.username
                                      .charAt(
                                        0
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-semibold text-[#403a38]">
                                      {
                                        user.username
                                      }
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#999390]">
                                      {
                                        user.email
                                      }
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
                                {
                                  user.completedChallenges
                                }
                              </td>

                              {/* Flags */}

                              <td className="px-4 py-5 text-sm text-[#77716e]">
                                {
                                  user.flagsSubmitted
                                }
                              </td>

                              {/* Status */}

                              <td className="px-4 py-5">

                                {user.status ===
                                "active" ? (
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
                                      setSelectedUserId(
                                        user.id
                                      )
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
                                      handleToggleUserStatus(
                                        user.id
                                      )
                                    }
                                    className={`
                                      rounded-lg
                                      border px-3 py-2
                                      text-xs
                                      font-semibold
                                      transition-all
                                      ${
                                        user.status ===
                                        "active"
                                          ? "border-red-200 bg-white text-red-600 hover:bg-red-50"
                                          : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                                      }
                                    `}
                                  >
                                    {user.status ===
                                    "active"
                                      ? "ระงับ"
                                      : "เปิดใช้งาน"}
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* Mobile Cards */}

                  <div className="divide-y divide-[#eeeae8] lg:hidden">

                    {filteredUsers.map(
                      (user) => (
                        <div
                          key={user.id}
                          className="p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b01414]/10 text-sm font-bold text-[#b01414]">
                                {user.username
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">

                                <p className="font-semibold text-[#403a38]">
                                  {
                                    user.username
                                  }
                                </p>

                                <p className="truncate text-xs text-[#999390]">
                                  {
                                    user.email
                                  }
                                </p>

                              </div>

                            </div>

                            {user.status ===
                            "active" ? (
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
                                {
                                  user.completedChallenges
                                }
                              </p>
                            </div>

                            <div className="rounded-xl bg-[#faf9f8] p-3">
                              <p className="text-xs text-[#999390]">
                                Flags
                              </p>
                              <p className="mt-1 font-bold text-[#403a38]">
                                {
                                  user.flagsSubmitted
                                }
                              </p>
                            </div>

                          </div>

                          <div className="mt-4 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedUserId(
                                  user.id
                                )
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
                                handleToggleUserStatus(
                                  user.id
                                )
                              }
                              className={`
                                flex-1
                                rounded-lg
                                border px-3 py-2
                                text-xs
                                font-semibold
                                ${
                                  user.status ===
                                  "active"
                                    ? "border-red-200 bg-white text-red-600"
                                    : "border-green-200 bg-white text-green-600"
                                }
                              `}
                            >
                              {user.status ===
                              "active"
                                ? "ระงับบัญชี"
                                : "เปิดใช้งาน"}
                            </button>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  {/* Empty */}

                  {filteredUsers.length ===
                    0 && (
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
            )}

            {/* =================================
                CHALLENGE MANAGEMENT
            ================================= */}

            {activeTab ===
              "challenges" && (
              <div className="space-y-6">

                {/* Add / Edit Form */}

                {showForm && (
                  <section
                    id="challenge-form"
                    className="scroll-mt-6 rounded-2xl border border-[#e5e1df] bg-white p-6 sm:p-8"
                  >

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b01414]/10">
                            ⚙
                          </div>

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                              Challenge Management
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[#403a38]">
                              {isEditing
                                ? "แก้ไขโจทย์"
                                : "เพิ่มโจทย์ใหม่"}
                            </h2>

                          </div>

                        </div>

                        <p className="mt-3 text-sm text-[#77716e]">
                          {isEditing
                            ? `กำลังแก้ไข Challenge: ${challenge.title}`
                            : "สร้าง Challenge ใหม่สำหรับผู้เล่น"}
                        </p>

                      </div>

                      {isEditing && (
                        <span className="inline-flex w-fit rounded-full bg-[#b01414]/10 px-3 py-1.5 text-xs font-semibold text-[#b01414]">
                          กำลังแก้ไข
                        </span>
                      )}

                    </div>

                    <form
                      onSubmit={
                        handleSubmit
                      }
                    >

                      <div className="space-y-6">

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                            ชื่อโจทย์
                            <span className="ml-1 text-[#b01414]">
                              *
                            </span>
                          </label>

                          <input
                            type="text"
                            value={
                              challenge.title
                            }
                            onChange={(
                              event
                            ) =>
                              updateChallenge(
                                "title",
                                event.target
                                  .value
                              )
                            }
                            placeholder="เช่น Phishing in the Dark"
                            className="
                              h-12 w-full
                              rounded-xl
                              border
                              border-[#d8d2cf]
                              bg-white px-4
                              text-sm
                              text-[#403a38]
                              outline-none
                              placeholder:text-[#aaa4a1]
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                            Challenge ID
                          </label>

                          <input
                            type="text"
                            value={
                              challenge.challengeId
                            }
                            readOnly
                            className="
                              h-12 w-full
                              cursor-not-allowed
                              rounded-xl
                              border
                              border-[#e0dcda]
                              bg-[#f3f2f1]
                              px-4
                              text-sm
                              text-[#77716e]
                              outline-none
                            "
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                            หมวดหมู่
                          </label>

                          <select
                            value={
                              challenge.category
                            }
                            onChange={(
                              event
                            ) =>
                              updateChallenge(
                                "category",
                                event.target
                                  .value
                              )
                            }
                            className="
                              h-12 w-full
                              rounded-xl
                              border
                              border-[#d8d2cf]
                              bg-white px-4
                              text-sm
                              text-[#403a38]
                              outline-none
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          >
                            {categories.map(
                              (
                                category
                              ) => (
                                <option
                                  key={
                                    category
                                  }
                                  value={
                                    category
                                  }
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#403a38]">
                            คำอธิบาย
                          </label>

                          <textarea
                            value={
                              challenge.description
                            }
                            onChange={(
                              event
                            ) =>
                              updateChallenge(
                                "description",
                                event.target
                                  .value
                              )
                            }
                            rows={5}
                            placeholder="รายละเอียดโจทย์"
                            className="
                              w-full
                              resize-y
                              rounded-xl
                              border
                              border-[#d8d2cf]
                              bg-white
                              px-4 py-3
                              text-sm
                              text-[#403a38]
                              outline-none
                              placeholder:text-[#aaa4a1]
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          />
                        </div>

                      </div>

                      {/* Containers */}

                      <div className="mt-10">

                        <div className="mb-4 flex items-center justify-between">

                          <div>
                            <h3 className="text-lg font-bold text-[#403a38]">
                              Docker Containers
                            </h3>

                            <p className="mt-1 text-xs text-[#999390]">
                              กำหนด Container ของโจทย์
                            </p>
                          </div>

                          <span className="text-xs text-[#999390]">
                            {
                              challenge
                                .containers
                                .length
                            }{" "}
                            Container
                          </span>

                        </div>

                        <div className="space-y-3">

                          {challenge.containers.map(
                            (
                              container,
                              index
                            ) => (
                              <div
                                key={
                                  container.id
                                }
                                className="rounded-xl border border-[#e7e3e1] bg-[#faf9f8] p-4"
                              >

                                <div className="mb-3 flex items-center justify-between">

                                  <span className="text-xs font-semibold uppercase tracking-wider text-[#77716e]">
                                    Container{" "}
                                    {index +
                                      1}
                                  </span>

                                  {challenge
                                    .containers
                                    .length >
                                    1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeContainer(
                                          container.id
                                        )
                                      }
                                      className="text-xs font-semibold text-red-600 hover:underline"
                                    >
                                      ลบ
                                    </button>
                                  )}

                                </div>

                                <div className="grid gap-3 lg:grid-cols-[0.8fr_1.6fr_0.5fr]">

                                  <input
                                    type="text"
                                    value={
                                      container.name
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateContainer(
                                        container.id,
                                        "name",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="ชื่อ Container"
                                    className="h-11 rounded-lg border border-[#d8d2cf] bg-white px-3 text-sm outline-none focus:border-[#b01414]"
                                  />

                                  <input
                                    type="text"
                                    value={
                                      container.image
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateContainer(
                                        container.id,
                                        "image",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="Docker Image"
                                    className="h-11 rounded-lg border border-[#d8d2cf] bg-white px-3 text-sm outline-none focus:border-[#b01414]"
                                  />

                                  <input
                                    type="number"
                                    min="1"
                                    max="65535"
                                    value={
                                      container.port
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateContainer(
                                        container.id,
                                        "port",
                                        event
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="Port"
                                    className="h-11 rounded-lg border border-[#d8d2cf] bg-white px-3 text-sm outline-none focus:border-[#b01414]"
                                  />

                                </div>

                              </div>
                            )
                          )}

                        </div>

                        <button
                          type="button"
                          onClick={
                            addContainer
                          }
                          className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-[#b01414] bg-white px-5 text-sm font-semibold text-[#b01414] transition-all hover:bg-[#b01414] hover:text-white"
                        >
                          + เพิ่ม Container
                        </button>

                      </div>

                      {message && (
                        <div
                          className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                            message.includes(
                              "สำเร็จ"
                            )
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >
                          {message}
                        </div>
                      )}

                      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eeeae8] pt-6 sm:flex-row sm:justify-end">

                        <button
                          type="button"
                          onClick={
                            handleCancel
                          }
                          className="h-12 rounded-xl border border-[#d8d2cf] bg-white px-6 text-sm font-semibold text-[#77716e] hover:border-[#b01414] hover:text-[#b01414]"
                        >
                          ยกเลิก
                        </button>

                        <button
                          type="submit"
                          disabled={
                            isSaving
                          }
                          className="h-12 rounded-xl bg-[#b01414] px-7 text-sm font-semibold text-white hover:bg-[#961010] disabled:opacity-60"
                        >
                          {isSaving
                            ? "กำลังบันทึก..."
                            : isEditing
                              ? "บันทึกการแก้ไข"
                              : "บันทึกสร้างโจทย์"}
                        </button>

                      </div>

                    </form>

                  </section>
                )}

                {/* Challenge List */}

                <section className="overflow-hidden rounded-2xl border border-[#e5e1df] bg-white">

                  <div className="border-b border-[#eeeae8] p-6 sm:p-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                          Challenge Management
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                          โจทย์ทั้งหมด
                        </h2>

                        <p className="mt-1 text-sm text-[#77716e]">
                          จัดการ Challenge ที่มีอยู่ในระบบ
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleCreateNew
                        }
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#b01414] px-5 text-sm font-semibold text-white hover:bg-[#961010]"
                      >
                        <span className="mr-2 text-lg">
                          +
                        </span>
                        เพิ่มโจทย์ใหม่
                      </button>

                    </div>

                    {/* Search */}

                    <div className="relative mt-6">

                      <svg
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#999390]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle
                          cx="11"
                          cy="11"
                          r="7"
                        />
                        <path d="m20 20-3.5-3.5" />
                      </svg>

                      <input
                        type="text"
                        value={
                          searchQuery
                        }
                        onChange={(
                          event
                        ) =>
                          setSearchQuery(
                            event.target
                              .value
                          )
                        }
                        placeholder="ค้นหาโจทย์จากชื่อ, Challenge ID, หมวดหมู่ หรือคำอธิบาย..."
                        className="h-12 w-full rounded-xl border border-[#d8d2cf] bg-[#faf9f8] pl-12 pr-4 text-sm text-[#403a38] outline-none placeholder:text-[#aaa4a1] focus:border-[#b01414] focus:bg-white focus:ring-2 focus:ring-[#b01414]/10"
                      />

                    </div>

                  </div>

                  <div className="divide-y divide-[#eeeae8]">

                    {filteredChallenges.map(
                      (item, index) => (
                        <div
                          key={item.id}
                          className="group p-6 transition-colors hover:bg-[#faf9f8] sm:p-7"
                        >

                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex min-w-0 gap-4">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#b01414]/10 text-sm font-bold text-[#b01414]">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div className="min-w-0">

                                <div className="flex flex-wrap items-center gap-2">

                                  <h3 className="truncate text-lg font-bold text-[#403a38]">
                                    {
                                      item.title
                                    }
                                  </h3>

                                  <span className="rounded-full bg-[#f1efed] px-2.5 py-1 text-xs font-medium text-[#77716e]">
                                    {
                                      item.category
                                    }
                                  </span>

                                </div>

                                <p className="mt-1 font-mono text-xs text-[#999390]">
                                  {
                                    item.challengeId
                                  }
                                </p>

                                <p className="mt-3 max-w-3xl line-clamp-2 text-sm leading-6 text-[#77716e]">
                                  {
                                    item.description
                                  }
                                </p>

                              </div>

                            </div>

                            <div className="flex shrink-0 gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    item
                                  )
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-[#d8d2cf] bg-white px-4 text-sm font-medium text-[#403a38] transition-all hover:border-[#b01414] hover:text-[#b01414]"
                              >
                                แก้ไข
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteChallenge(
                                    item
                                  )
                                }
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-all hover:border-red-600 hover:bg-red-50"
                              >
                                ลบ
                              </button>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>

              </div>
            )}

          </div>
        </main>
      </Reveal>

      {/* =========================================
          Delete Challenge Confirmation Modal
      ========================================= */}

      {deletingChallenge && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!isDeleting) {
              setDeletingChallenge(null)
            }
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#403a38]">
                    ยืนยันการลบโจทย์
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#77716e]">
                    คุณกำลังจะลบ Challenge นี้ออกจากรายการจัดการอย่างถาวร
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="font-semibold text-[#403a38]">
                  {deletingChallenge.title}
                </p>

                <p className="mt-1 font-mono text-xs text-[#77716e]">
                  {deletingChallenge.challengeId}
                </p>

                <p className="mt-3 text-sm leading-6 text-red-700">
                  การลบจะนำโจทย์ออกจากรายการ Challenge ในหน้านี้ และถ้ามี Docker Container หรือข้อมูลที่ผูกกับโจทย์ ระบบ Backend ควรจัดการลบข้อมูลเหล่านั้นด้วย
                </p>
              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae8] p-6 sm:flex-row sm:justify-end sm:p-8">

              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  setDeletingChallenge(null)
                }
                className="h-11 rounded-xl border border-[#d8d2cf] bg-white px-5 text-sm font-semibold text-[#77716e] transition-all hover:border-[#403a38] hover:text-[#403a38] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={
                  confirmDeleteChallenge
                }
                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting
                  ? "กำลังลบ..."
                  : "ยืนยันลบโจทย์"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================================
          User Detail Modal
      ========================================= */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={
            handleCloseUserDetails
          }
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-[#eeeae8] p-6 sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b01414]/10 text-xl font-bold text-[#b01414]">
                  {selectedUser.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#403a38]">
                    {
                      selectedUser.username
                    }
                  </h2>

                  <p className="mt-1 text-sm text-[#999390]">
                    {
                      selectedUser.email
                    }
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseUserDetails
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#999390] hover:bg-[#f3f1ef] hover:text-[#403a38]"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-6 p-6 sm:p-8">

              {/* Status */}

              <div className="flex items-center justify-between rounded-xl bg-[#faf9f8] p-4">

                <div>
                  <p className="text-xs text-[#999390]">
                    สถานะบัญชี
                  </p>

                  <p className="mt-1 font-semibold text-[#403a38]">
                    {selectedUser.status ===
                    "active"
                      ? "ใช้งานอยู่"
                      : "ถูกระงับ"}
                  </p>
                </div>

                {selectedUser.status ===
                "active" ? (
                  <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                    Suspended
                  </span>
                )}

              </div>

              {/* Statistics */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-xl border border-[#e5e1df] p-4">
                  <p className="text-xs text-[#999390]">
                    Fish
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#b01414]">
                    {selectedUser.fish.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e1df] p-4">
                  <p className="text-xs text-[#999390]">
                    คะแนน
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#403a38]">
                    {selectedUser.points.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e1df] p-4">
                  <p className="text-xs text-[#999390]">
                    โจทย์ที่สำเร็จ
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#403a38]">
                    {
                      selectedUser.completedChallenges
                    }
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e1df] p-4">
                  <p className="text-xs text-[#999390]">
                    Flags
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#403a38]">
                    {
                      selectedUser.flagsSubmitted
                    }
                  </p>
                </div>

              </div>

              {/* Account Information */}

              <div>

                <h3 className="mb-3 text-sm font-bold text-[#403a38]">
                  ข้อมูลบัญชี
                </h3>

                <div className="divide-y divide-[#eeeae8] rounded-xl border border-[#e5e1df]">

                  <div className="flex items-center justify-between gap-4 p-4">

                    <span className="text-sm text-[#77716e]">
                      วันที่สมัคร
                    </span>

                    <span className="text-sm font-medium text-[#403a38]">
                      {
                        selectedUser.joinedAt
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 p-4">

                    <span className="text-sm text-[#77716e]">
                      ใช้งานล่าสุด
                    </span>

                    <span className="text-sm font-medium text-[#403a38]">
                      {
                        selectedUser.lastActive
                      }
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 p-4">

                    <span className="text-sm text-[#77716e]">
                      User ID
                    </span>

                    <span className="font-mono text-sm text-[#403a38]">
                      #{selectedUser.id}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae8] p-6 sm:flex-row sm:justify-end sm:p-8">

              <button
                type="button"
                onClick={
                  handleCloseUserDetails
                }
                className="h-11 rounded-xl border border-[#d8d2cf] bg-white px-5 text-sm font-semibold text-[#77716e] hover:border-[#b01414] hover:text-[#b01414]"
              >
                ปิด
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleUserStatus(
                    selectedUser.id
                  )
                  handleCloseUserDetails()
                }}
                className={`h-11 rounded-xl px-5 text-sm font-semibold text-white ${
                  selectedUser.status ===
                  "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {selectedUser.status ===
                "active"
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