import { useEffect, useRef, useState } from "react"
import { Camera, Image as ImageIcon } from "lucide-react"
import { fetchUserAttributes, updatePassword, updateUserAttributes, fetchAuthSession } from "aws-amplify/auth"

import Reveal from "../components/effects/Reveal"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ManageProfile() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [apiUrl, setApiUrl] = useState("")

  // Password States
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // โหลด config.json เพื่อดึง Lambda URL
    fetch('/config.json')
      .then((res) => res.json())
      .then((config) => {
        if (config.ALB_URL) {
          setApiUrl(config.ALB_URL)
        }
      })
      .catch((err) => console.error("Failed to load config.json", err))

    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const attributes = await fetchUserAttributes()
      const currentName = attributes.preferred_username || attributes.email || ""
      setUsername(currentName)
      setEmail(attributes.email || "")
      if (attributes.picture) {
        setProfileImage(attributes.picture)
      }
    } catch (error) {
      console.error("Error loading user attributes:", error)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return

    if (!apiUrl) {
      setErrorMsg("ยังไม่พบ URL สำหรับอัปโหลด กรุณาลองใหม่อีกครั้ง")
      return
    }

    setLoading(true)
    setErrorMsg("")

    try {
      const fileName = `${Date.now()}_${file.name}`

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload_profile_image",
          fileName: fileName,
          contentType: file.type,
        }),
      })

      const data = await response.json()
      if (!data.uploadUrl) {
        throw new Error(data.error || "ไม่สามารถขอลิงก์อัปโหลดได้")
      }

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error("อัปโหลดไฟล์ไปที่ S3 ไม่สำเร็จ")
      }

      if (data.imageUrl) {
        setProfileImage(data.imageUrl)

        await updateUserAttributes({
          userAttributes: {
            picture: data.imageUrl,
          },
        })
        setSuccessMsg("อัปเดตภาพโปรไฟล์สำเร็จ")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (newPassword || oldPassword || confirmPassword) {
      if (!oldPassword) {
        setErrorMsg("กรุณากรอกรหัสผ่านเดิมเพื่อยืนยันการเปลี่ยนรหัสผ่าน")
        return
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน")
        return
      }
    }

    setLoading(true)
    try {
      await updateUserAttributes({
        userAttributes: {
          preferred_username: username,
        },
      })

      if (newPassword && oldPassword) {
        await updatePassword({ oldPassword, newPassword })
      }

      setSuccessMsg("บันทึกข้อมูลและอัปเดตลง Cognito สำเร็จเรียบร้อย!")
      setTimeout(() => {
        window.location.href = "/profile"
      }, 1500)
    } catch (err: any) {
      console.error("Update profile error:", err)
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <form onSubmit={handleSave}>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#B01414]">จัดการโปรไฟล์</h1>
                <div className="flex items-center gap-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="font-semibold text-black underline underline-offset-2 hover:text-[#B01414] disabled:text-gray-400"
                  >
                    {loading ? "กำลังบันทึก..." : "เสร็จสิ้น"}
                  </button>

                  <a href="/profile" className="font-semibold text-[#B01414] underline underline-offset-2 hover:text-[#8F1010]">
                    ยกเลิก
                  </a>
                </div>
              </div>

              {errorMsg && <p className="mt-4 text-sm font-medium text-red-600">{errorMsg}</p>}
              {successMsg && <p className="mt-4 text-sm font-medium text-green-600">{successMsg}</p>}

              <section className="mt-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                  {/* Profile Image / Initial Letter Fallback */}
                  <div className="group relative h-[130px] w-[130px] shrink-0">
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="relative h-full w-full overflow-hidden rounded-full border-[6px] border-[#f5e4e4] bg-gray-200 flex items-center justify-center transition-all duration-300 hover:border-[#B01414] hover:shadow-lg focus:outline-none"
                      aria-label="เปลี่ยนรูปโปรไฟล์"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-[#B01414]">
                          {username ? username.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 backdrop-blur-[2px] transition-all duration-300 opacity-90 group-hover:opacity-100">
                        <ImageIcon className="h-8 w-8 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">เปลี่ยนรูป</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#B01414] text-white shadow-md transition-all hover:scale-110"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="w-full max-w-[600px] space-y-6">
                    <div>
                      <label className="text-xs text-gray-600">ชื่อผู้ใช้ (Username)</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full border-b border-gray-300 bg-transparent px-0 py-1 text-xl font-bold text-black outline-none focus:border-[#B01414]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600">Email</label>
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="mt-1 block w-full border-b border-gray-300 bg-transparent px-0 py-1 text-xl font-bold text-gray-500 outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-4">
                      <h3 className="text-sm font-bold text-[#B01414]">เปลี่ยนรหัสผ่าน (ไม่บังคับ)</h3>
                      
                      <div>
                        <label className="text-xs text-gray-600">รหัสผ่านเดิม</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B01414]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-600">รหัสผ่านใหม่</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B01414]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-600">ยืนยันรหัสผ่านใหม่</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#B01414]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </main>
      </Reveal>

      <Footer />
    </>
  )
}