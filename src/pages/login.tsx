import { useEffect, useRef, useState } from "react";
import { signIn, signUp, confirmSignIn, confirmSignUp, resendSignUpCode, signOut, getCurrentUser } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import Navbar from "../components/Navbar";
import Reveal from "../components/effects/Reveal";

export default function Login() {
  const [viewMode, setViewMode] = useState<"login" | "signup" | "otp">("login");
  
  // ฟอร์มสเตท
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  
  // ข้อความแจ้งเตือนสีแดง (Error Message) แต่ละฟิลด์หรือภาพรวม
  const [errorMsg, setErrorMsg] = useState("");

  // ระบบ OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // โหลด Config และตั้งค่า Amplify
  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((config) => {
        Amplify.configure({
          Auth: {
            Cognito: {
              userPoolId: config.USER_POOL_ID,
              userPoolClientId: config.CLIENT_ID,
            }
          }
        });
      })
      .catch((err) => console.error("Failed to load config.json", err));
  }, []);

  // ตัวนับเวลาถอยหลัง OTP
  useEffect(() => {
    if (viewMode !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [viewMode, countdown]);

  // เปลี่ยนโหมดพร้อมเคลียร์ Error
  const switchMode = (mode: "login" | "signup" | "otp") => {
    setViewMode(mode);
    setErrorMsg("");
  };

  // จัดการการ Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      // เคลียร์ Session เก่าทิ้งก่อน login ป้องกัน Error UserAlreadyAuthenticatedException
      try {
        await signOut();
      } catch (signOutErr) {
        // ข้าม error หากไม่มี user ค้างอยู่
      }

      const { nextStep } = await signIn({ username: email, password });
      
      if (
        nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE' || 
        nextStep.signInStep === 'CONFIRM_SIGN_UP'
      ) {
        setViewMode("otp");
        setCountdown(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else if (nextStep.signInStep === 'DONE') {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg(error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // จัดการการ Sign Up พร้อมเช็ค Password
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            preferred_username: userNameInput,
          }
        }
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // ไปหน้า OTP ทันทีโดยไม่ใช้ alert
        setViewMode("otp");
        setCountdown(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      setErrorMsg(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setErrorMsg("กำลังเชื่อมต่อกับ Google OAuth...");
  };

  // จัดการกรอก OTP
  const handleOtpChange = (index: number, value: string) => {
    const number = value.replace(/\D/g, "");
    if (!number) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    if (number.length > 1) {
      const digits = number.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
      return;
    }

    newOtp[index] = number;
    setOtp(newOtp);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
  };

  // ยืนยัน OTP
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setErrorMsg("");
    setLoading(true);
    try {
      try {
        const result = await confirmSignUp({ username: email, confirmationCode: code });
        if (result.isSignUpComplete) {
          switchMode("login");
          setErrorMsg("");
          setLoading(false);
          return;
        }
      } catch {
        const result = await confirmSignIn({ challengeResponse: code });
        if (result.isSignedIn) {
          window.location.href = "/";
          return;
        }
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      setErrorMsg("รหัส OTP ไม่ถูกต้องหรือหมดอายุ");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await resendSignUpCode({ username: email });
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      inputRefs.current[0]?.focus();
      setErrorMsg("");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setErrorMsg("ไม่สามารถส่งรหัส OTP ใหม่ได้");
    }
  };

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
            {viewMode === "login" && (
              /* ================= LOGIN FORM ================= */
              <div className="max-w-xl">
                <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl">
                  Login
                </h1>
                <h2 className="mt-1 text-2xl text-[#403a38]">
                  Welcome back to CTF Arena
                </h2>

                <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
                  {errorMsg && (
                    <p className="text-sm font-medium text-red-600">{errorMsg}</p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">Email / Username</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#b01414] py-2.5 text-white font-medium hover:bg-[#8f1010] transition"
                  >
                    {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                  </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white py-2.5 text-sm text-[#403a38] hover:border-[#b01414] transition"
                  >
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </button>
                </div>

                <p className="mt-6 text-sm text-[#403a38]">
                  ยังไม่มีบัญชีใช่ไหม?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="font-bold text-[#b01414] hover:underline"
                  >
                    สมัครสมาชิก
                  </button>
                </p>
              </div>
            )}

            {viewMode === "signup" && (
              /* ================= SIGN UP FORM ================= */
              <div className="max-w-xl">
                <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl">
                  Sign up
                </h1>
                <h2 className="mt-1 text-2xl text-[#403a38]">
                  Create your CTF account
                </h2>

                <form onSubmit={handleSignUpSubmit} className="mt-8 space-y-4">
                  {errorMsg && (
                    <p className="text-sm font-medium text-red-600">{errorMsg}</p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">ชื่อผู้ใช้ (Username)</label>
                    <input
                      type="text"
                      required
                      value={userNameInput}
                      onChange={(e) => setUserNameInput(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="YourUsername"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#403a38]">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#b01414] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#b01414] py-2.5 text-white font-medium hover:bg-[#8f1010] transition"
                  >
                    {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                  </button>
                </form>

                <p className="mt-6 text-sm text-[#403a38]">
                  มีบัญชีอยู่แล้ว?{" "}
                  <button
                    onClick={() => switchMode("login")}
                    className="font-bold text-[#b01414] hover:underline"
                  >
                    เข้าสู่ระบบ
                  </button>
                </p>
              </div>
            )}

            {viewMode === "otp" && (
              /* ================= OTP VERIFICATION ================= */
              <div className="max-w-4xl">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="mb-8 flex items-center gap-2 text-sm text-[#403a38] hover:text-[#b01414]"
                >
                  <span className="text-lg">←</span>
                  <span>กลับหน้าเข้าสู่ระบบ</span>
                </button>

                <h1 className="text-5xl font-bold tracking-tight text-[#b01414] sm:text-6xl">
                  Verify your account
                </h1>
                <h2 className="mt-1 text-3xl text-[#403a38]">Check your email</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#403a38]">
                  เราได้ส่งรหัส OTP 6 หลักไปยังอีเมล <span className="font-semibold">{email}</span> กรุณากรอกรหัสเพื่อยืนยัน
                </p>
                <p className="mt-1 text-xs text-red-500 font-medium">
                  * หากไม่เจออีเมล กรุณาตรวจสอบในจดหมายขยะ (Spam) หรือกล่องจดหมายอื่นๆ
                </p>

                {errorMsg && (
                  <p className="mt-3 text-sm font-medium text-red-600">{errorMsg}</p>
                )}

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
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      onPaste={handlePaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className="h-14 w-12 rounded-md border border-gray-300 bg-white text-center font-mono text-2xl font-bold text-[#403a38] outline-none transition-all focus:border-[#b01414] focus:ring-2 focus:ring-[#b01414]/20 sm:h-16 sm:w-14"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={otp.join("").length !== 6 || loading}
                  className="mt-8 h-11 bg-[#b01414] px-8 text-sm font-medium text-white transition hover:bg-[#8f1010] disabled:bg-gray-300"
                >
                  {loading ? "กำลังตรวจสอบ..." : "ยืนยันรหัส OTP"}
                </button>

                <div className="mt-5 text-sm text-[#403a38]">
                  {countdown > 0 ? (
                    <p>
                      ส่งรหัสอีกครั้งใน{" "}
                      <span className="font-mono font-bold text-[#b01414]">{countdown}</span> วินาที
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-medium text-[#b01414] hover:underline"
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