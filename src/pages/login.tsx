import { useEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Reveal from "../components/effects/Reveal";

export default function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start countdown when OTP section is shown
  useEffect(() => {
    if (!showOtp || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtp, countdown]);

  // Press "Login with Google"
  const handleGoogleLogin = () => {
    setShowOtp(true);
    setCountdown(60);

    // Focus first OTP input
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  // Handle OTP input
  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    // Only allow numbers
    const number = value.replace(/\D/g, "");

    if (!number) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];

    // Handle pasted/multiple numbers
    if (number.length > 1) {
      const digits = number.slice(0, 6).split("");

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      const nextIndex = Math.min(index + digits.length, 5);

      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);

      return;
    }

    newOtp[index] = number;
    setOtp(newOtp);

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, 5);

    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 0);
  };

  // Verify OTP
  const handleVerify = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      return;
    }

    console.log("OTP:", code);

    // TODO:
    // Send OTP to your backend here.
  };

  // Resend OTP
  const handleResend = () => {
    if (countdown > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setCountdown(60);

    inputRefs.current[0]?.focus();

    // TODO:
    // Request a new OTP from your backend here.
  };

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            {!showOtp ? (
              /* ================= GOOGLE LOGIN ================= */
              <div className="max-w-4xl">
                {/* Heading */}
                <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl lg:text-7xl">
                  Login / Sign up
                </h1>

                {/* Subtitle */}
                <h2 className="mt-1 text-3xl text-[#403a38] sm:text-4xl">
                  Explore the challenge!
                </h2>

                {/* Description */}
                <p className="mt-3 max-w-4xl text-sm text-[#403a38] sm:text-base">
                  เปลี่ยนการฝึก Cybersecurity แบบเดิม ๆ
                  ให้กลายเป็นการผจญภัย ออกล่า Flag
                  สะสมปลา และปลดล็อกทักษะใหม่ไปพร้อมกัน
                </p>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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
                    hover:border-[#b01414]
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
            ) : (
              /* ================= OTP VERIFICATION ================= */
              <div className="max-w-4xl">
                {/* Back */}
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="
                    mb-8
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-[#403a38]
                    transition-colors
                    hover:text-[#b01414]
                  "
                >
                  <span className="text-lg">←</span>
                  <span>กลับ</span>
                </button>

                {/* Heading */}
                <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl lg:text-7xl">
                  Verify your account
                </h1>

                {/* Subtitle */}
                <h2 className="mt-1 text-3xl text-[#403a38] sm:text-4xl">
                  Check your email
                </h2>

                {/* Description */}
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#403a38] sm:text-base">
                  เราได้ส่งรหัส OTP 6 หลักไปยังอีเมลของคุณ
                  กรุณากรอกรหัสเพื่อดำเนินการต่อ
                </p>

                {/* OTP Box */}
                <div className="mt-9 flex gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        handleOtpChange(
                          index,
                          event.target.value
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(index, event)
                      }
                      onPaste={handlePaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className="
                        h-14
                        w-12
                        rounded-md
                        border
                        border-gray-300
                        bg-white
                        text-center
                        font-mono
                        text-2xl
                        font-bold
                        text-[#403a38]
                        outline-none
                        transition-all
                        duration-200
                        hover:border-gray-400
                        focus:border-[#b01414]
                        focus:ring-2
                        focus:ring-[#b01414]/20
                        sm:h-16
                        sm:w-14
                      "
                    />
                  ))}
                </div>

                {/* Verify button */}
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={otp.join("").length !== 6}
                  className="
                    mt-8
                    h-11
                    bg-[#b01414]
                    px-8
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#8f1010]
                    hover:shadow-md
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:bg-gray-300
                    disabled:shadow-none
                  "
                >
                  ยืนยันรหัส OTP
                </button>

                {/* Resend */}
                <div className="mt-5 text-sm text-[#403a38]">
                  {countdown > 0 ? (
                    <p>
                      ส่งรหัสอีกครั้งใน{" "}
                      <span className="font-mono font-bold text-[#b01414]">
                        {countdown}
                      </span>{" "}
                      วินาที
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="
                        font-medium
                        text-[#b01414]
                        transition-colors
                        hover:text-[#8f1010]
                        hover:underline
                      "
                    >
                      ส่งรหัส OTP อีกครั้ง
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </Reveal>
    </>
  );
}