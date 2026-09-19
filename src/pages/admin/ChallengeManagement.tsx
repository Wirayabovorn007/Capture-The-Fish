import { useMemo, useState } from "react"
import type { FormEvent } from "react"

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

export default function ChallengeManagement() {
  const [challenges, setChallenges] =
    useState<Challenge[]>(initialChallenges)

  const [challenge, setChallenge] =
    useState<ChallengeForm>(createEmptyChallenge())

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

  const filteredChallenges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return challenges
    }

    return challenges.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.challengeId.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    })
  }, [challenges, searchQuery])

  const updateChallenge = (
    field: keyof Omit<ChallengeForm, "containers">,
    value: string
  ) => {
    setChallenge((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title"
        ? {
            challengeId: createChallengeId(value),
          }
        : {}),
    }))
  }

  const updateContainer = (
    id: number,
    field: keyof DockerContainer,
    value: string
  ) => {
    setChallenge((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
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

  const removeContainer = (id: number) => {
    setChallenge((prev) => {
      if (prev.containers.length <= 1) {
        return prev
      }

      return {
        ...prev,
        containers: prev.containers.filter(
          (container) => container.id !== id
        ),
      }
    })
  }

  const handleCreateNew = () => {
    setEditingId(null)
    setChallenge(createEmptyChallenge())
    setMessage("")
    setShowForm(true)

    setTimeout(() => {
      document
        .getElementById("challenge-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

  const handleEdit = (selectedChallenge: Challenge) => {
    setEditingId(selectedChallenge.id)
    setChallenge({
      title: selectedChallenge.title,
      challengeId: selectedChallenge.challengeId,
      category: selectedChallenge.category,
      description: selectedChallenge.description,
      containers: selectedChallenge.containers.map(
        (container) => ({
          ...container,
        })
      ),
    })
    setMessage("")
    setShowForm(true)

    setTimeout(() => {
      document
        .getElementById("challenge-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

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

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      )

      setChallenges((prev) =>
        prev.filter(
          (item) => item.id !== challengeToDelete.id
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

  const handleCancel = () => {
    setEditingId(null)
    setChallenge(createEmptyChallenge())
    setMessage("")
    setShowForm(false)
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setMessage("")

    if (!challenge.title.trim()) {
      setMessage("กรุณากรอกชื่อโจทย์")
      return
    }

    if (!challenge.description.trim()) {
      setMessage("กรุณากรอกรายละเอียดโจทย์")
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

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      )

      if (isEditing && editingId !== null) {
        setChallenges((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  title: challenge.title,
                  challengeId: challenge.challengeId,
                  category: challenge.category,
                  description: challenge.description,
                  containers: challenge.containers,
                }
              : item
          )
        )

        setMessage("แก้ไขโจทย์สำเร็จ")
      } else {
        const newChallenge: Challenge = {
          id: Date.now(),
          title: challenge.title,
          challengeId: challenge.challengeId,
          category: challenge.category,
          description: challenge.description,
          containers: challenge.containers,
        }

        setChallenges((prev) => [
          newChallenge,
          ...prev,
        ])

        setMessage("สร้างโจทย์สำเร็จ")
      }

      setEditingId(null)
      setChallenge(createEmptyChallenge())
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
                onClick={confirmDeleteChallenge}
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
    </>
  )
}
