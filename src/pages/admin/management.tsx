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

export default function Management() {
  const [activeTab, setActiveTab] =
    useState<ManagementTab>("challenges")

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

  const isEditing = editingId !== null

  /*
   * =========================================
   * Filter Challenges
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
   * Update Challenge
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
   * Update Container
   * =========================================
   */

  const updateContainer = (
    id: number,
    field: keyof DockerContainer,
    value: string
  ) => {
    setChallenge((prev) => ({
      ...prev,

      containers: prev.containers.map(
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

  /*
   * =========================================
   * Add Container
   * =========================================
   */

  const addContainer = () => {
    setChallenge((prev) => ({
      ...prev,

      containers: [
        ...prev.containers,
        createEmptyContainer(),
      ],
    }))
  }

  /*
   * =========================================
   * Remove Container
   * =========================================
   */

  const removeContainer = (id: number) => {
    setChallenge((prev) => {
      if (prev.containers.length <= 1) {
        return prev
      }

      return {
        ...prev,

        containers: prev.containers.filter(
          (container) =>
            container.id !== id
        ),
      }
    })
  }

  /*
   * =========================================
   * Open Create Form
   * =========================================
   */

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

  /*
   * =========================================
   * Open Edit Form
   * =========================================
   */

  const handleEdit = (
    selectedChallenge: Challenge
  ) => {
    setEditingId(selectedChallenge.id)

    setChallenge({
      title: selectedChallenge.title,
      challengeId:
        selectedChallenge.challengeId,
      category: selectedChallenge.category,
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
        .getElementById("challenge-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
    }, 50)
  }

  /*
   * =========================================
   * Close Form
   * =========================================
   */

  const handleCancel = () => {
    setEditingId(null)
    setChallenge(createEmptyChallenge())
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
      setMessage("กรุณากรอกชื่อโจทย์")
      return
    }

    if (!challenge.description.trim()) {
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
       * เชื่อมต่อ Backend API ตรงนี้
       *
       * Create:
       * POST /api/admin/challenges
       *
       * Update:
       * PUT /api/admin/challenges/:id
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      )

      if (
        isEditing &&
        editingId !== null
      ) {
        /*
         * =================================
         * Update Challenge
         * =================================
         */

        setChallenges((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
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
              : item
          )
        )

        setMessage(
          "แก้ไขโจทย์สำเร็จ"
        )
      } else {
        /*
         * =================================
         * Create Challenge
         * =================================
         */

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

  /*
   * =========================================
   * Render
   * =========================================
   */

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

              <p className="mt-3 text-[#77716e] sm:text-base">
                จัดการผู้ใช้งานและ Challenge ภายในแพลตฟอร์ม
              </p>
            </div>

            {/* =================================
                Management Tabs
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
                  setActiveTab("challenges")
                }
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === "challenges"
                    ? "border-b-2 border-[#b01414] text-[#b01414]"
                    : "text-[#77716e] hover:text-[#403a38]"
                }`}
              >
                จัดการ Challenge
              </button>

            </div>

            {/* =================================
                User Management
            ================================= */}

            {activeTab === "users" && (
              <section className="rounded-2xl border border-[#e5e1df] bg-white p-6 sm:p-8">

                <div className="mb-6">
                  <p className="font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                    Users
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                    จัดการผู้ใช้งาน
                  </h2>

                  <p className="mt-2 text-[#77716e]">
                    ส่วนจัดการข้อมูลผู้ใช้งานจะเพิ่มในขั้นตอนถัดไป
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-[#d8d2cf] bg-[#faf9f8] p-10 text-center">
                  <p className="text-[#999390]">
                    User Management
                  </p>
                </div>

              </section>
            )}

            {/* =================================
                Challenge Management
            ================================= */}

            {activeTab === "challenges" && (
              <div className="space-y-6">

                {/* =================================
                    Add / Edit Form

                    แสดงเฉพาะเมื่อกดเพิ่ม/แก้ไข
                ================================= */}

                {showForm && (
                  <section
                    id="challenge-form"
                    className="scroll-mt-6 rounded-2xl border border-[#e5e1df] bg-white p-6 sm:p-8"
                  >

                    {/* Form Header */}

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b01414]/10 text-lg">
                            ⚙
                          </div>

                          <div>

                            <p className=" font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                              Challenge Management
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[#403a38]">
                              {isEditing
                                ? "แก้ไขโจทย์"
                                : "เพิ่มโจทย์ใหม่"}
                            </h2>

                          </div>

                        </div>

                        <p className="mt-3  text-[#77716e]">
                          {isEditing
                            ? `กำลังแก้ไข Challenge: ${challenge.title}`
                            : "สร้าง Challenge ใหม่สำหรับผู้เล่น พร้อมกำหนด Docker Container ที่ใช้ในการรันโจทย์"}
                        </p>

                      </div>

                      {isEditing && (
                        <span className="inline-flex w-fit items-center rounded-full bg-[#b01414]/10 px-3 py-1.5  font-semibold text-[#b01414]">
                          กำลังแก้ไข
                        </span>
                      )}

                    </div>

                    <form onSubmit={handleSubmit}>

                      {/* =================================
                          Challenge Information
                      ================================= */}

                      <div className="space-y-6">

                        {/* Title */}

                        <div>
                          <label
                            htmlFor="challenge-title"
                            className="mb-2 block  font-semibold text-[#403a38]"
                          >
                            ชื่อโจทย์
                            <span className="ml-1 text-[#b01414]">
                              *
                            </span>
                          </label>

                          <input
                            id="challenge-title"
                            type="text"
                            value={
                              challenge.title
                            }
                            onChange={(event) =>
                              updateChallenge(
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="เช่น Phishing in the Dark"
                            className="
                              h-12 w-full rounded-xl
                              border border-[#d8d2cf]
                              bg-white px-4
                               text-[#403a38]
                              outline-none transition-all
                              placeholder:text-[#aaa4a1]
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          />
                        </div>

                        {/* Challenge ID */}

                        <div>
                          <label
                            htmlFor="challenge-id"
                            className="mb-2 block  font-semibold text-[#403a38]"
                          >
                            Challenge ID

                            <span className="ml-2  font-normal text-[#999390]">
                              สร้างอัตโนมัติ
                            </span>
                          </label>

                          <input
                            id="challenge-id"
                            type="text"
                            value={
                              challenge.challengeId
                            }
                            readOnly
                            placeholder="challenge-id"
                            className="
                              h-12 w-full
                              cursor-not-allowed
                              rounded-xl
                              border border-[#e0dcda]
                              bg-[#f3f2f1]
                              px-4
                              
                              text-[#77716e]
                              outline-none
                            "
                          />

                          <p className="mt-2  text-[#999390]">
                            ID จะถูกสร้างจากชื่อโจทย์โดยอัตโนมัติ
                          </p>
                        </div>

                        {/* Category */}

                        <div>
                          <label
                            htmlFor="challenge-category"
                            className="mb-2 block  font-semibold text-[#403a38]"
                          >
                            หมวดหมู่
                            <span className="ml-1 text-[#b01414]">
                              *
                            </span>
                          </label>

                          <select
                            id="challenge-category"
                            value={
                              challenge.category
                            }
                            onChange={(event) =>
                              updateChallenge(
                                "category",
                                event.target.value
                              )
                            }
                            className="
                              h-12 w-full rounded-xl
                              border border-[#d8d2cf]
                              bg-white px-4
                               text-[#403a38]
                              outline-none transition-all
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          >
                            {categories.map(
                              (category) => (
                                <option
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Description */}

                        <div>
                          <label
                            htmlFor="challenge-description"
                            className="mb-2 block  font-semibold text-[#403a38]"
                          >
                            คำอธิบาย
                            <span className="ml-1 text-[#b01414]">
                              *
                            </span>
                          </label>

                          <textarea
                            id="challenge-description"
                            value={
                              challenge.description
                            }
                            onChange={(event) =>
                              updateChallenge(
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="รายละเอียดโจทย์"
                            rows={5}
                            className="
                              w-full resize-y
                              rounded-xl
                              border border-[#d8d2cf]
                              bg-white px-4 py-3
                               leading-6
                              text-[#403a38]
                              outline-none transition-all
                              placeholder:text-[#aaa4a1]
                              focus:border-[#b01414]
                              focus:ring-2
                              focus:ring-[#b01414]/10
                            "
                          />
                        </div>

                      </div>

                      {/* =================================
                          Docker Containers
                      ================================= */}

                      <div className="mt-10">

                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                          <div>
                            <h3 className="text-lg font-bold text-[#403a38]">
                              Docker Containers
                            </h3>

                            <p className="mt-1  text-[#999390]">
                              กำหนด Container ที่ใช้สำหรับ Challenge นี้
                            </p>
                          </div>

                          <span className=" text-[#999390]">
                            {challenge.containers.length}{" "}
                            Container
                            {challenge.containers.length >
                            1
                              ? "s"
                              : ""}
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
                                className="
                                  rounded-xl
                                  border
                                  border-[#e7e3e1]
                                  bg-[#faf9f8]
                                  p-4
                                "
                              >

                                <div className="mb-3 flex items-center justify-between">

                                  <span className=" font-semibold uppercase tracking-wider text-[#77716e]">
                                    Container{" "}
                                    {index + 1}
                                  </span>

                                  {challenge
                                    .containers
                                    .length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeContainer(
                                          container.id
                                        )
                                      }
                                      className="
                                        rounded-lg
                                        border
                                        border-red-200
                                        bg-white
                                        px-3 py-1.5
                                        
                                        font-medium
                                        text-red-600
                                        transition-colors
                                        hover:bg-red-50
                                      "
                                    >
                                      ลบ
                                    </button>
                                  )}

                                </div>

                                <div className="grid gap-3 lg:grid-cols-[0.8fr_1.6fr_0.5fr]">

                                  {/* Container Name */}

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
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="ชื่อ Container (เช่น app)"
                                    className="
                                      h-11 w-full
                                      rounded-lg
                                      border
                                      border-[#d8d2cf]
                                      bg-white px-3
                                      
                                      text-[#403a38]
                                      outline-none
                                      transition-all
                                      placeholder:text-[#aaa4a1]
                                      focus:border-[#b01414]
                                      focus:ring-2
                                      focus:ring-[#b01414]/10
                                    "
                                  />

                                  {/* Docker Image */}

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
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="Docker Image URL (เช่น username/repo:tag)"
                                    className="
                                      h-11 w-full
                                      rounded-lg
                                      border
                                      border-[#d8d2cf]
                                      bg-white px-3
                                      
                                      text-[#403a38]
                                      outline-none
                                      transition-all
                                      placeholder:text-[#aaa4a1]
                                      focus:border-[#b01414]
                                      focus:ring-2
                                      focus:ring-[#b01414]/10
                                    "
                                  />

                                  {/* Port */}

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
                                        event.target
                                          .value
                                      )
                                    }
                                    placeholder="Port"
                                    className="
                                      h-11 w-full
                                      rounded-lg
                                      border
                                      border-[#d8d2cf]
                                      bg-white px-3
                                      
                                      text-[#403a38]
                                      outline-none
                                      transition-all
                                      placeholder:text-[#aaa4a1]
                                      focus:border-[#b01414]
                                      focus:ring-2
                                      focus:ring-[#b01414]/10
                                    "
                                  />

                                </div>

                              </div>
                            )
                          )}

                        </div>

                        {/* Add Container */}

                        <button
                          type="button"
                          onClick={addContainer}
                          className="
                            mt-4 inline-flex
                            h-11 items-center
                            gap-2 rounded-xl
                            border
                            border-[#b01414]
                            bg-white px-5
                             font-semibold
                            text-[#b01414]
                            transition-all
                            hover:bg-[#b01414]
                            hover:text-white
                            active:scale-[0.98]
                          "
                        >
                          <span className="text-lg leading-none">
                            +
                          </span>

                          เพิ่ม Container
                        </button>

                      </div>

                      {/* =================================
                          Message
                      ================================= */}

                      {message && (
                        <div
                          className={`
                            mt-6 rounded-xl
                            border px-4 py-3
                            
                            ${
                              message.includes(
                                "สำเร็จ"
                              )
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }
                          `}
                        >
                          {message}
                        </div>
                      )}

                      {/* =================================
                          Form Actions
                      ================================= */}

                      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eeeae8] pt-6 sm:flex-row sm:justify-end">

                        <button
                          type="button"
                          onClick={handleCancel}
                          className="
                            inline-flex h-12
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#d8d2cf]
                            bg-white px-6
                             font-semibold
                            text-[#77716e]
                            transition-all
                            hover:border-[#b01414]
                            hover:text-[#b01414]
                          "
                        >
                          ยกเลิก
                        </button>

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="
                            inline-flex h-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#b01414]
                            px-7
                             font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            hover:bg-[#961010]
                            hover:shadow-md
                            active:scale-[0.98]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
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

                {/* =================================
                    Challenge List
                ================================= */}

                <section className="overflow-hidden rounded-2xl border border-[#e5e1df] bg-white">

                  {/* List Header */}

                  <div className="border-b border-[#eeeae8] p-6 sm:p-8">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Title */}

                      <div>
                        <p className=" font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                          Challenge Management
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[#403a38]">
                          โจทย์ทั้งหมด
                        </h2>

                        <p className="mt-1  text-[#77716e]">
                          จัดการ Challenge ที่มีอยู่ในระบบ
                        </p>
                      </div>

                      {/* Add Button */}

                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="
                          inline-flex h-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#b01414]
                          px-5
                           font-semibold
                          text-white
                          transition-all
                          hover:bg-[#961010]
                          hover:shadow-md
                          active:scale-[0.98]
                        "
                      >
                        <span className="mr-2 text-lg">
                          +
                        </span>

                        เพิ่มโจทย์ใหม่
                      </button>

                    </div>

                    {/* =================================
                        Search Bar
                    ================================= */}

                    <div className="mt-6">

                      <div className="relative">

                        {/* Search Icon */}

                        <svg
                          className="
                            pointer-events-none
                            absolute left-4
                            top-1/2
                            h-5 w-5
                            -translate-y-1/2
                            text-[#999390]
                          "
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
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
                          value={searchQuery}
                          onChange={(event) =>
                            setSearchQuery(
                              event.target.value
                            )
                          }
                          placeholder="ค้นหาโจทย์จากชื่อ, Challenge ID, หมวดหมู่ หรือคำอธิบาย..."
                          className="
                            h-12 w-full
                            rounded-xl
                            border
                            border-[#d8d2cf]
                            bg-[#faf9f8]
                            pl-12 pr-12
                            
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

                        {/* Clear Search */}

                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() =>
                              setSearchQuery("")
                            }
                            aria-label="ล้างการค้นหา"
                            className="
                              absolute right-3
                              top-1/2
                              flex h-7 w-7
                              -translate-y-1/2
                              items-center
                              justify-center
                              rounded-full
                              text-[#999390]
                              transition-colors
                              hover:bg-[#eae7e5]
                              hover:text-[#403a38]
                            "
                          >
                            ×
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* =================================
                      Result Count
                  ================================= */}

                  <div className="border-b border-[#eeeae8] bg-[#faf9f8] px-6 py-3 sm:px-8">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <p className=" text-[#77716e]">

                        {searchQuery ? (
                          <>
                            พบ{" "}
                            <span className="font-semibold text-[#403a38]">
                              {filteredChallenges.length}
                            </span>{" "}
                            จาก{" "}
                            <span className="font-semibold text-[#403a38]">
                              {challenges.length}
                            </span>{" "}
                            โจทย์
                          </>
                        ) : (
                          <>
                            มีโจทย์ทั้งหมด{" "}
                            <span className="font-semibold text-[#403a38]">
                              {challenges.length}
                            </span>{" "}
                            โจทย์
                          </>
                        )}

                      </p>

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() =>
                            setSearchQuery("")
                          }
                          className="
                            
                            font-medium
                            text-[#b01414]
                            hover:underline
                          "
                        >
                          ล้างการค้นหา
                        </button>
                      )}

                    </div>

                  </div>

                  {/* =================================
                      Challenge List
                  ================================= */}

                  <div className="divide-y divide-[#eeeae8]">

                    {filteredChallenges.length ===
                    0 ? (
                      <div className="p-12 text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f1ef] text-xl">
                          🔍
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-[#403a38]">
                          ไม่พบโจทย์
                        </h3>

                        <p className="mt-1  text-[#999390]">
                          ไม่พบ Challenge ที่ตรงกับคำค้นหา
                        </p>

                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() =>
                              setSearchQuery("")
                            }
                            className="
                              mt-4
                              
                              font-semibold
                              text-[#b01414]
                              hover:underline
                            "
                          >
                            ล้างการค้นหา
                          </button>
                        )}

                      </div>
                    ) : (
                      filteredChallenges.map(
                        (item) => {

                          const originalIndex =
                            challenges.findIndex(
                              (challengeItem) =>
                                challengeItem.id ===
                                item.id
                            )

                          return (
                            <div
                              key={item.id}
                              className="
                                group p-6
                                transition-colors
                                hover:bg-[#faf9f8]
                                sm:p-7
                              "
                            >

                              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                {/* Challenge Info */}

                                <div className="flex min-w-0 gap-4">

                                  {/* Number */}

                                  <div className="
                                    flex h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#b01414]/10
                                    
                                    font-bold
                                    text-[#b01414]
                                  ">
                                    {String(
                                      originalIndex + 1
                                    ).padStart(2, "0")}
                                  </div>

                                  {/* Details */}

                                  <div className="min-w-0">

                                    <div className="
                                      flex flex-wrap
                                      items-center gap-2
                                    ">

                                      <h3 className="
                                        truncate
                                        text-lg font-bold
                                        text-[#403a38]
                                      ">
                                        {item.title}
                                      </h3>

                                      <span className="
                                        rounded-full
                                        bg-[#f1efed]
                                        px-2.5 py-1
                                        
                                        font-medium
                                        text-[#77716e]
                                      ">
                                        {item.category}
                                      </span>

                                    </div>

                                    <p className="
                                      mt-1
                                      
                                      
                                      text-[#999390]
                                    ">
                                      {item.challengeId ||
                                        "ยังไม่มี Challenge ID"}
                                    </p>

                                    <p className="
                                      mt-3
                                      max-w-3xl
                                      line-clamp-2
                                      
                                      leading-6
                                      text-[#77716e]
                                    ">
                                      {item.description}
                                    </p>

                                    {/* Container Info */}

                                    <div className="mt-3 flex flex-wrap gap-2">

                                      <span className="
                                        rounded-lg
                                        border
                                        border-[#e5e1df]
                                        bg-white
                                        px-3 py-1.5
                                        
                                        text-[#77716e]
                                      ">
                                        Docker{" "}
                                        {
                                          item
                                            .containers
                                            .length
                                        }{" "}
                                        Container
                                        {item.containers
                                          .length !==
                                        1
                                          ? "s"
                                          : ""}
                                      </span>

                                      {item.containers
                                        .slice(0, 3)
                                        .map(
                                          (
                                            container
                                          ) => (
                                            <span
                                              key={
                                                container.id
                                              }
                                              className="
                                                rounded-lg
                                                border
                                                border-[#e5e1df]
                                                bg-white
                                                px-3 py-1.5
                                                
                                                
                                                text-[#77716e]
                                              "
                                            >
                                              {
                                                container.name
                                              }
                                            </span>
                                          )
                                        )}

                                    </div>

                                  </div>

                                </div>

                                {/* Edit Button */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                  className="
                                    inline-flex
                                    h-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-[#d8d2cf]
                                    bg-white
                                    px-4
                                    
                                    font-medium
                                    text-[#403a38]
                                    transition-all
                                    hover:border-[#b01414]
                                    hover:text-[#b01414]
                                  "
                                >
                                  แก้ไข
                                </button>

                              </div>

                            </div>
                          )
                        }
                      )
                    )}

                  </div>

                </section>

              </div>
            )}

          </div>
        </main>
      </Reveal>
    </>
  )
}