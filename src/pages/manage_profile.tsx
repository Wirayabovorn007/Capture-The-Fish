import { useRef, useState } from "react"
import { Camera } from "lucide-react"

import Reveal from "../components/effects/Reveal"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ManageProfile() {
  const [username, setUsername] = useState("Hack_the_cat")
  const [nickname, setNickname] = useState("Deep Sea Scout")

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    console.log({
      username,
      nickname,
      profileImage,
    })
  }

  const handleCancel = () => {
    setUsername("Hack_the_cat")
    setNickname("Deep Sea Scout")
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Make sure the selected file is an image
    if (!file.type.startsWith("image/")) {
      return
    }

    // Create a temporary URL for preview
    const imageUrl = URL.createObjectURL(file)

    setProfileImage(imageUrl)
  }

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-5xl">

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Top Actions */}
            <div className="flex items-center justify-end gap-5">
              <a href="/profile">
                <button
                  type="button"
                  onClick={handleSave}
                  className="
                    font-semibold
                    text-black
                    underline
                    underline-offset-2
                    transition-colors
                    duration-200
                    hover:text-[#B01414]
                  "
                >
                  เสร็จสิ้น
                </button>
              </a>

              <a href="/profile">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    font-semibold
                    text-[#B01414]
                    underline
                    underline-offset-2
                    transition-colors
                    duration-200
                    hover:text-[#8F1010]
                  "
                >
                  ยกเลิก
                </button>
              </a>
            </div>

            {/* Profile Header */}
            <section className="mt-8">
              <p className="text-sm text-[#B01414]">
                ฉายา
              </p>

              <div className="mt-1">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="
                    w-full
                    max-w-[600px]
                    border-none
                    bg-transparent
                    p-0
                    text-4xl
                    font-bold
                    tracking-wide
                    text-[#B01414]
                    outline-none
                    transition-all
                    duration-200
                    focus:tracking-wider
                    sm:text-5xl
                  "
                />
              </div>
            </section>

            {/* Profile Information */}
            <section className="mt-8">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start">

                {/* Profile Image */}
                <div className="group relative h-[130px] w-[130px] shrink-0">

                  {/* Clickable Image */}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-full
                      border-[6px]
                      border-[#f5e4e4]
                      transition-all
                      duration-300
                      hover:border-[#B01414]
                      hover:shadow-lg
                      focus:outline-none
                    "
                    aria-label="เปลี่ยนรูปโปรไฟล์"
                  >
                    {/* Profile Image */}
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />

                    {/* Dark Hover Overlay */}
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        rounded-full
                        bg-black/0
                        transition-all
                        duration-300
                        group-hover:bg-black/45
                      "
                    >
                      {/* Center Camera */}
                      <Camera
                        className="
                          h-9
                          w-9
                          scale-75
                          text-white
                          opacity-0
                          transition-all
                          duration-300
                          group-hover:scale-100
                          group-hover:opacity-100
                        "
                        strokeWidth={1.8}
                      />
                    </div>
                  </button>

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="
                      absolute
                      bottom-0
                      right-0
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[#B01414]
                      text-white
                      shadow-md
                      transition-all
                      duration-300
                      hover:scale-110
                      hover:bg-[#8F1010]
                      active:scale-95
                    "
                    aria-label="เปลี่ยนรูปโปรไฟล์"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <div className="w-full max-w-[600px]">

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="text-xs text-gray-600"
                    >
                      ชื่อผู้ใช้
                    </label>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      className="
                        mt-1
                        block
                        w-full
                        border-b
                        border-gray-300
                        bg-transparent
                        px-0
                        py-1
                        text-2xl
                        font-bold
                        text-black
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#B01414]
                      "
                    />
                  </div>

                  {/* Email */}
                  <div className="mt-7">
                    <label
                      htmlFor="email"
                      className="text-xs text-gray-600"
                    >
                      Email
                    </label>

                    <div className="mt-1 flex items-end gap-6">
                      <input
                        id="email"
                        type="email"
                        value="67070BLABLA@gmail.com"
                        readOnly
                        className="
                          block
                          w-full
                          border-b
                          border-gray-300
                          bg-transparent
                          px-0
                          py-1
                          text-2xl
                          font-bold
                          text-black
                          outline-none
                        "
                      />

                      <button
                        type="button"
                        className="
                          shrink-0
                          pb-2
                          text-xs
                          text-[#B01414]
                          underline
                          underline-offset-2
                          transition-colors
                          duration-200
                          hover:text-[#8F1010]
                        "
                      >
                        เปลี่ยนอีเมลบัญชี
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="mt-14 h-px w-full bg-gray-100" />
          </div>
        </main>
      </Reveal>

      <Footer />
    </>
  )
}