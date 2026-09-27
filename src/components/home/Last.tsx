export default function CybersecurityCTA() {
  return (
    <section className="relative mt-10 overflow-hidden bg-[#A61B1B] py-16 sm:py-20 lg:py-24">
      {/* faint grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* giant background number */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 select-none text-[7rem] leading-none text-white/10 sm:text-[12rem] lg:text-[16rem] xl:text-[20rem]"
      >
        03
      </span>

      <div className="relative px-6 sm:px-10 lg:mx-40">
        <h2 className=" text-3xl sm:text-4xl font-bold leading-tight text-white lg:text-5xl">
          Cybersecurity ที่ผู้เรียนรัก
        </h2>

        <p className="mt-4 sm:mt-6 text-sm leading-relaxed text-white/90 sm:text-[15px] lg:text-base">
          ออกแบบมาเพื่อกระตุ้นการมีส่วนร่วมของผู้เรียนผ่านการฝึกอบรมด้านความปลอดภัยทางไซเบอร์ที่เน้นการปฏิบัติจริงตามสถานการณ์ที่เกิดขึ้นจริง ซึ่งช่วยสร้างความมั่นใจ ตอกย้ำความรู้ทางทฤษฎี และสนับสนุนผลลัพธ์การเรียนรู้ในระยะยาว
        </p>

        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <a href="/story">
            <button
              type="button"
              className=" bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-[#A61B1B] transition-colors hover:bg-white/90"
            >
              จับปลาเลย
            </button>
          </a>
          <a href="/competition">
          <button
            type="button"
            className="border border-white/70 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            ดูโจทย์ทั้งหมด
          </button>
          </a>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3">
          <div className="flex items-center gap-2 text-sm text-white/90">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-green-400"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
            Beginner-friendly
          </div>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4 shrink-0 text-green-400"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
            Guides and challenges
          </div>
        </div>
      </div>
    </section>
  );
}