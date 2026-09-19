import { useState } from "react";
import Navbar from "../../components/admin/Navbar"
import Reveal from "../../components/effects/Reveal";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO:
      // Connect your admin authentication API here.
      //
      // Example:
      // const response = await fetch("/api/admin/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //   }),
      // });

      console.log("Admin login:", {
        email,
        password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            <div className="max-w-4xl">
              {/* Heading */}
              <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl lg:text-7xl">
                Admin Login
              </h1>

              {/* Subtitle */}
              <h2 className="mt-1 text-3xl text-[#403a38] sm:text-4xl">
                Manage the challenge!
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-4xl  text-[#403a38] sm:text-base">
                เข้าสู่ระบบสำหรับผู้ดูแลระบบ เพื่อจัดการผู้ใช้งาน
                ภารกิจ และข้อมูลภายในระบบ
              </p>

              {/* Login Form */}
              <form
                onSubmit={handleLogin}
                className="mt-10 w-full max-w-xl"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block  text-[#b01414]"
                  >
                    อีเมลผู้ดูแลระบบ
                  </label>

                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="mb-2 block  text-[#b01414]"
                  >
                    รหัสผ่าน
                  </label>

                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      onClick={() => setShowPassword(!showPassword)}
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
                      {showPassword ? "ซ่อน" : "แสดง"}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2  text-[#403a38]">
                    <input
                      type="checkbox"
                      className="
                        h-4
                        w-4
                        accent-[#b01414]
                      "
                    />
                    จำการเข้าสู่ระบบ
                  </label>

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
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </button>
              </form>

              {/* Admin Notice */}
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
                <span className="mt-[1px] text-[#b01414]">!</span>

                <p>
                  หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
                  หากคุณเป็นผู้ใช้งานทั่วไป
                  กรุณาเข้าสู่ระบบผ่านหน้าสำหรับผู้ใช้งาน
                </p>
              </div>
            </div>
          </div>
        </main>
      </Reveal>
    </>
  );
}