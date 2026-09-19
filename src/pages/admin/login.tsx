import { useState } from "react"
import Navbar from "../../components/admin/Navbar"
import Reveal from "../../components/effects/Reveal"

type LoginStep = "credentials" | "otp"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [otp, setOtp] = useState("")
  const [loginStep, setLoginStep] =
    useState<LoginStep>("credentials")

  const [isLoading, setIsLoading] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] =
    useState(false)

  const [otpError, setOtpError] = useState("")

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    setIsLoading(true)

    try {
      /*
       * TODO:
       * Connect your admin authentication API here.
       *
       * Example:
       *
       * const response = await fetch("/api/admin/login", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     email,
       *     password,
       *   }),
       * })
       *
       * if (!response.ok) {
       *   throw new Error("Login failed")
       * }
       *
       * const data = await response.json()
       *
       * if (data.requiresOtp) {
       *   setLoginStep("otp")
       * }
       */

      console.log("Admin login:", {
        email,
        password,
      })

      // Demo:
      // หลังจาก Login สำเร็จ ให้ไปหน้า OTP
      setLoginStep("otp")
      setOtp("")
      setOtpError("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setOtpError("กรุณากรอก OTP ให้ครบ 6 หลัก")
      return
    }

    setIsVerifyingOtp(true)
    setOtpError("")

    try {
      /*
       * TODO:
       * Connect your OTP verification API here.
       *
       * Example:
       *
       * const response = await fetch("/api/admin/verify-otp", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     email,
       *     otp,
       *   }),
       * })
       *
       * if (!response.ok) {
       *   throw new Error("Invalid OTP")
       * }
       *
       * const data = await response.json()
       *
       * if (data.success) {
       *   // Navigate to admin dashboard
       * }
       */

      console.log("Verify admin OTP:", {
        email,
        otp,
      })

      // TODO:
      // navigate("/admin")
    } catch (error) {
      console.error(error)
      setOtpError("OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/\D/g, "")

    if (value.length <= 6) {
      setOtp(value)
      setOtpError("")
    }
  }

  const handleBackToLogin = () => {
    setLoginStep("credentials")
    setOtp("")
    setOtpError("")
  }

  const handleResendOtp = async () => {
    /*
     * TODO:
     * Connect resend OTP API here.
     *
     * Example:
     *
     * await fetch("/api/admin/resend-otp", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify({
     *     email,
     *   }),
     * })
     */

    console.log("Resend OTP:", email)
    setOtp("")
    setOtpError("")
  }

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
            <div className="max-w-4xl">
              {/* Heading */}
              <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl lg:text-7xl">
                Admin Login
              </h1>

              <h2 className="mt-1 text-3xl text-[#403a38] sm:text-4xl">
                Manage the challenge!
              </h2>

              <p className="mt-3 max-w-4xl text-[#403a38] sm:text-base">
                เข้าสู่ระบบสำหรับผู้ดูแลระบบ
                เพื่อจัดการผู้ใช้งาน ภารกิจ
                และข้อมูลภายในระบบ
              </p>

              {/* ========================= */}
              {/* STEP 1: EMAIL + PASSWORD */}
              {/* ========================= */}

              {loginStep === "credentials" && (
                <>
                  <form
                    onSubmit={handleLogin}
                    className="mt-10 w-full max-w-xl"
                  >
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="admin-email"
                        className="mb-2 block text-[#b01414]"
                      >
                        อีเมลผู้ดูแลระบบ
                      </label>

                      <input
                        id="admin-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="admin@example.com"
                        autoComplete="email"
                        className="
                          w-full
                          rounded-md
                          border
                          border-gray-200
                          bg-white
                          px-4
                          py-3
                          text-[#403a38]
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-gray-400
                          focus:border-[#b01414]
                          focus:ring-2
                          focus:ring-[#b01414]/10
                        "
                      />
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                      <label
                        htmlFor="admin-password"
                        className="mb-2 block text-[#b01414]"
                      >
                        รหัสผ่าน
                      </label>

                      <div className="relative">
                        <input
                          id="admin-password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          name="password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          placeholder="กรอกรหัสผ่าน"
                          autoComplete="current-password"
                          className="
                            w-full
                            rounded-md
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-3
                            pr-20
                            text-[#403a38]
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-gray-400
                            focus:border-[#b01414]
                            focus:ring-2
                            focus:ring-[#b01414]/10
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              !showPassword,
                            )
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-xs
                            text-gray-400
                            transition-colors
                            hover:text-[#b01414]
                          "
                        >
                          {showPassword
                            ? "ซ่อน"
                            : "แสดง"}
                        </button>
                      </div>
                    </div>

                    {/* Remember / Forgot */}
                    <div className="mt-4 flex items-center justify-between">
                    

                      <button
                        type="button"
                        className="
                          text-[#b01414]
                          transition-colors
                          hover:text-[#8f1010]
                          hover:underline
                        "
                      >
                        ลืมรหัสผ่าน?
                      </button>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="
                        mt-7
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        rounded-md
                        bg-[#b01414]
                        px-5
                        font-medium
                        text-white
                        transition-all
                        duration-200
                        hover:bg-[#8f1010]
                        hover:shadow-lg
                        hover:shadow-[#b01414]/20
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isLoading
                        ? "กำลังตรวจสอบ..."
                        : "เข้าสู่ระบบ"}
                    </button>
                  </form>

                  {/* Security Notice */}
                  <div
                    className="
                      mt-7
                      flex
                      max-w-xl
                      items-start
                      gap-3
                      border-l-2
                      border-[#b01414]
                      bg-[#b01414]/[0.03]
                      px-4
                      py-3
                      text-xs
                      leading-relaxed
                      text-[#403a38]
                    "
                  >
                    <span className="mt-[1px] text-[#b01414]">
                      !
                    </span>

                    <p>
                      หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
                      หลังจากตรวจสอบอีเมลและรหัสผ่านแล้ว
                      ระบบจะส่ง OTP
                      เพื่อยืนยันตัวตนเพิ่มเติม
                    </p>
                  </div>
                </>
              )}

              {/* ========================= */}
              {/* STEP 2: OTP */}
              {/* ========================= */}

              {loginStep === "otp" && (
                <div className="mt-10 w-full max-w-xl">
                  <div
                    className="
                      rounded-2xl
                      border
                      border-[#e5e1df]
                      bg-white
                      p-6
                      shadow-sm
                      sm:p-8
                    "
                  >
                    {/* OTP Icon */}
                    <div className="flex justify-center">
                      <div
                        className="
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-full
                          bg-[#b01414]/10
                          text-[#b01414]
                        "
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-8 w-8"
                        >
                          <rect
                            x="4"
                            y="11"
                            width="16"
                            height="10"
                            rx="2"
                          />

                          <path
                            d="M8 11V8a4 4 0 0 1 8 0v3"
                            strokeLinecap="round"
                          />

                          <circle
                            cx="12"
                            cy="16"
                            r="1"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* OTP Heading */}
                    <div className="mt-5 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b01414]">
                        Two-Factor Authentication
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-[#403a38]">
                        ยืนยัน OTP
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#77716e]">
                        กรุณากรอกรหัส OTP 6 หลัก
                        ที่ส่งไปยังอีเมล
                      </p>

                      <p className="mt-1 font-medium text-[#403a38]">
                        {email}
                      </p>
                    </div>

                    {/* OTP Form */}
                    <form
                      onSubmit={handleVerifyOtp}
                      className="mt-7"
                    >
                      <label
                        htmlFor="admin-otp"
                        className="mb-2 block text-sm font-medium text-[#403a38]"
                      >
                        รหัส OTP
                      </label>

                      <input
                        id="admin-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={handleOtpChange}
                        autoFocus
                        placeholder="000000"
                        className="
                          h-14
                          w-full
                          rounded-xl
                          border
                          border-[#d8d2cf]
                          bg-[#faf9f8]
                          px-4
                          text-center
                          text-2xl
                          font-bold
                          tracking-[0.45em]
                          text-[#403a38]
                          outline-none
                          transition-all
                          placeholder:text-[#c5c0bd]
                          placeholder:tracking-[0.45em]
                          focus:border-[#b01414]
                          focus:bg-white
                          focus:ring-2
                          focus:ring-[#b01414]/10
                        "
                      />

                      {/* OTP Error */}
                      {otpError && (
                        <p className="mt-2 text-center text-sm font-medium text-red-600">
                          {otpError}
                        </p>
                      )}

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={
                          isVerifyingOtp ||
                          otp.length !== 6
                        }
                        className="
                          mt-5
                          flex
                          h-12
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#b01414]
                          px-5
                          font-medium
                          text-white
                          transition-all
                          duration-200
                          hover:bg-[#8f1010]
                          hover:shadow-lg
                          hover:shadow-[#b01414]/20
                          active:scale-[0.98]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isVerifyingOtp
                          ? "กำลังตรวจสอบ OTP..."
                          : "ยืนยัน OTP"}
                      </button>
                    </form>

                    {/* Resend */}
                    <div className="mt-5 text-center">
                      <p className="text-sm text-[#77716e]">
                        ไม่ได้รับรหัส OTP?
                      </p>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="
                          mt-1
                          text-sm
                          font-semibold
                          text-[#b01414]
                          transition-colors
                          hover:text-[#8f1010]
                          hover:underline
                        "
                      >
                        ส่ง OTP อีกครั้ง
                      </button>
                    </div>

                    {/* Back */}
                    <div className="mt-6 border-t border-[#eeeae8] pt-5 text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          text-[#77716e]
                          transition-colors
                          hover:text-[#b01414]
                        "
                      >
                        <span>←</span>
                        กลับไปหน้าเข้าสู่ระบบ
                      </button>
                    </div>
                  </div>

                  {/* OTP Security Notice */}
                  <div
                    className="
                      mt-5
                      flex
                      items-start
                      gap-3
                      border-l-2
                      border-[#b01414]
                      bg-[#b01414]/[0.03]
                      px-4
                      py-3
                      text-xs
                      leading-relaxed
                      text-[#403a38]
                    "
                  >
                    <span className="mt-[1px] text-[#b01414]">
                      !
                    </span>

                    <p>
                      อย่าเปิดเผยรหัส OTP
                      ให้บุคคลอื่น
                      ระบบจะใช้รหัสนี้เพื่อยืนยันว่า
                      คุณเป็นเจ้าของบัญชีผู้ดูแลระบบ
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Reveal>
    </>
  )
}