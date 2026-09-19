import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Reveal from "../components/effects/Reveal"

export default function Profile() {
  const [username, setUsername] = useState("Loading...")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      const name = attributes.preferred_username || currentUser.username
      setUsername(name)
      setEmail(attributes.email || "")
      if (attributes.picture) {
        setProfileImage(attributes.picture)
      }
    } catch (error) {
      console.error("Not authenticated or error loading profile", error)
    }
  }

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="group cursor-default">
                <p className="text-sm text-[#B01414]">ฉายา</p>
                <h1 className="mt-1 text-4xl font-bold tracking-wide text-[#B01414] sm:text-5xl">
                  Deep Sea Scout
                </h1>
              </div>

              {/* Manage Profile */}
              <a href="/profile-setting">
                <button
                  type="button"
                  className="group flex items-center gap-2 text-xs text-gray-700 transition-all hover:text-[#B01414]"
                >
                  <span>จัดการโปรไฟล์</span>
                  <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
                </button>
              </a>
            </div>

            {/* Profile Summary */}
            <section className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1.6fr_1fr]">
              <div className="flex items-center gap-5">
                {/* Profile Image or Initial Letter */}
                <div className="h-[125px] w-[125px] shrink-0 overflow-hidden rounded-full border-[6px] border-[#f5e4e4] bg-gray-200 flex items-center justify-center font-bold text-[#B01414] text-5xl shadow-sm">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span>{username !== "Loading..." && username ? username.charAt(0).toUpperCase() : "U"}</span>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500">ชื่อผู้ใช้</p>
                  <h2 className="text-2xl font-bold text-black sm:text-3xl">{username}</h2>
                  <p className="text-xs text-gray-400 mt-1">{email}</p>

                  <div className="mt-3 flex gap-10">
                    <div>
                      <p className="text-xs text-gray-500">อันดับ</p>
                      <p className="text-3xl font-bold text-black">123</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">จำนวนปลา</p>
                      <p className="text-3xl font-bold text-black">1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Stats */}
              <div className="flex items-center justify-between gap-8">
                <div className="space-y-2 text-sm">
                  <StatRow dot="bg-green-500" label="ง่าย" count="1" />
                  <StatRow dot="bg-orange-500" label="ปานกลาง" count="1" />
                  <StatRow dot="bg-[#B01414]" label="ยาก" count="1" />
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600">เคลียร์โจทย์</p>
                  <p className="text-3xl font-bold text-black">4<span className="text-xl">/10</span></p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </Reveal>

      <Footer />
    </>
  )
}

function StatRow({ dot, label, count }: { dot: string; label: string; count: number | string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${dot}`} />
      <span className="text-gray-700">{label}</span>
      <span className="text-black">{count}</span>
    </div>
  )
}