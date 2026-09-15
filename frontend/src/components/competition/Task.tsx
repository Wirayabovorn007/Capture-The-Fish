import { useState } from "react"
import { ChevronUp } from "lucide-react"
import Reveal from "../effects/Reveal"

export default function Task() {
  const [open, setOpen] = useState(true)

  return (
	<Reveal>
    <section className="mx-20 my-10 overflow-hidden bg-[#1d1d1d] text-white">
      {/* Task Header */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10"
      >
        <h2 className="font-mono text-lg font-bold">
          Task 2 - Capture the Fish!
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
            <p className="text-white">
              <a
                href=""
                className="underline transition-colors hover:text-red-400"
              >
                http://example.com
              </a>

              <br />
              <br />

              “Not everything on a website is meant to be seen.”
            </p>

            <div className="my-4">
              <input
                type="text"
                placeholder="รูปแบบคำตอบ: flag{*****}"
                className="
                  mx-3
                  w-[500px]
                  rounded-md
                  border
                  border-white
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  transition-colors
                  focus:border-[#59ff4b]
                  placeholder:text-gray-400
                "
              />

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
    </section>
	</Reveal>
  )
}