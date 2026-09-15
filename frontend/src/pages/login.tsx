import Navbar from "../components/Navbar"

export default function Login() {
  return (
    <>
	<Navbar/>
	<main className="flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="max-w-4xl">
          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight text-[#b51217] sm:text-6xl lg:text-7xl">
            Login / Sign up
          </h1>

          {/* Subtitle */}
          <h2 className="mt-1 text-3xl text-[#403a38] sm:text-4xl">
            Explore the challenge!
          </h2>

          {/* Description */}
          <p className="mt-3 max-w-4xl text-sm text-[#403a38] sm:text-base">
            เปลี่ยนการฝึก Cybersecurity แบบเดิม ๆ ให้กลายเป็นการผจญภัย ออกล่า Flag สะสมปลา และปลดล็อกทักษะใหม่ไปพร้อมกัน
          </p>

          {/* Google Login */}
          <button
            type="button"
            className="
              mt-9
              flex
              h-10
              items-center
              gap-3
              border
              border-gray-200
              bg-white
              px-5
              text-sm
              text-[#403a38]

              transition-all
              duration-200
              hover:border-gray-200
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            {/* Google Logo */}
            <span className="flex h-6 w-6 items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.68-.06-1.34-.17-1.97H12v3.73h5.22a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.13Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.75Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.53 13.85A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.85V7.63H3.28A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.37l3.25-2.52Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.22 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.72 5.38l3.25 2.52C7.3 7.84 9.46 6.12 12 6.12Z"
                />
              </svg>
            </span>

            <span>เข้าสู่ระบบด้วย Google</span>
          </button>
        </div>
      </div>
    </main>
	
	</>
  )
}