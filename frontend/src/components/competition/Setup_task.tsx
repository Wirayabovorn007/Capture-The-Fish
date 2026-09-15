import { useState } from "react"
import { ChevronUp } from "lucide-react"
import Reveal from "../effects/Reveal"

export default function TaskSetup() {
  const [open, setOpen] = useState(true)

  return (
	<Reveal>
    <section className="mx-20 mb-10 overflow-hidden bg-[#1d1d1d] text-white">
      {/* Task Header */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10"
      >
        <h2 className="text-lg font-bold">
          Task 1 - Setup your Virtual Environment
        </h2>

        <ChevronUp
          className={`h-6 w-6 transition-transform duration-300 ease-in-out ${
            open ? "rotate-0" : "rotate-180"
          }`}
          strokeWidth={3}
        />
      </button>

      {/* Animated Content */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-10 py-14 transition-opacity duration-300 ease-in-out ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="max-w-[760px] text-[16px] leading-relaxed text-white">
              เพื่อให้ผ่านด่านนี้ไปได้สำเร็จ คุณจะต้องตั้งค่า Virtual
              Environment ของคุณก่อน เพื่อเริ่มต้นใช้งาน Lab Machines
              และเพื่อตรวจสอบให้แน่ใจว่า
              คุณมีเครื่องมือและสิทธิ์การเข้าถึงที่จำเป็นเพื่อรับมือกับความท้าทายข้างต้น
            </p>

            {/* Lab Machine */}
            <div className="mt-12 flex items-center">
              {/* Server Icon */}
              <div className="relative z-10 flex w-[95px] flex-col gap-2">
                <ServerUnit />
                <ServerUnit />
                <ServerUnit />
              </div>

              {/* Machine Card */}
              <div className="-ml-8 flex h-[122px] w-[503px] items-center justify-between bg-[#3a3a3a] px-6 pl-[87px]">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Lab machine
                  </h3>

                  <div className="mt-5 inline-flex rounded-full bg-[#7c2929] px-3 py-1">
                    <span className="text-xs font-medium text-red-500">
                      Status: off
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="
                    rounded-md
                    bg-[#59ff4b]
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-[#111]
                    transition-all
                    duration-200
                    hover:bg-[#45e63a]
                    active:scale-95
                  "
                >
                  เปิด Lab machine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
	</Reveal>
  )
}

function ServerUnit() {
  return (
    <div className="relative h-[27px] w-[95px] bg-[#075776]">
      <div className="absolute left-0 top-0 h-full w-[48px] bg-[#08688b]" />

      <div className="absolute left-2 top-[9px] flex gap-2">
        <span className="h-[6px] w-[6px] bg-[#00ffb7]" />
        <span className="h-[6px] w-[6px] bg-[#ffe900]" />
      </div>

      <div className="absolute right-2 top-[9px] h-[6px] w-[25px] bg-[#a8d6df]" />
    </div>
  )
}