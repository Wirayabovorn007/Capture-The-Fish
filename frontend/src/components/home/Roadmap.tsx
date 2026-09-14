import {
  Award,
  BookOpen,
  Crosshair,
  Trophy,
} from "lucide-react";

type TimelineItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  side: "left" | "right";
};

const timelineItems: TimelineItem[] = [
  {
    title: "Story mode",
    description:
      "เรียนรู้ Cybersecurity ผ่านเรื่องราวและภารกิจที่เชื่อมโยงกัน ค่อย ๆ ปลดล็อกความท้าทายจากระดับเริ่มต้นไปสู่โจทย์ที่ซับซ้อนพร้อมสะสมปลาและทักษะระหว่างการเดินทาง",
    icon: BookOpen,
    side: "left",
  },
  {
    title: "Competition",
    description:
      "ท้าทายความสามารถของตัวเองด้วยโจทย์ Cybersecurity ที่ต้องแข่งกับเวลา แก้โจทย์ ค้นหา Flag และทำคะแนนให้ได้มากที่สุด เพื่อพิสูจน์ว่าใครคือนักล่าที่เก่งที่สุด",
    icon: Crosshair,
    side: "right",
  },
  {
    title: "Leaderboard",
    description:
      "แสดงความสำเร็จจากการเรียนรู้และพิชิตโจทย์บนแพลตฟอร์ม เมื่อผ่านเงื่อนไขที่กำหนด คุณจะได้รับใบรับรองเพื่อยืนยันความสำเร็จและทักษะที่ได้ฝึกฝน",
    icon: Trophy,
    side: "left",
  },
  {
    title: "Certification",
    description:
      "แสดงความสำเร็จจากการเรียนรู้และพิชิตโจทย์บนแพลตฟอร์ม เมื่อผ่านเงื่อนไขที่กำหนด คุณจะได้รับใบรับรองเพื่อยืนยันความสำเร็จและทักษะที่ได้ฝึกฝน",
    icon: Award,
    side: "right",
  },
];

export default function LearningJourney() {
  return (
    <section className="w-full md:py-20">
      <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        {/* =====================================================
            Section Header
        ====================================================== */}
        <div
          className="
            relative
            mb-14
            min-h-[210px]
            md:mb-20
            md:min-h-[250px]
          "
        >
          {/* Large section number */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-10px]
              top-[-45px]
              select-none
              text-[190px]
              leading-none
              text-[#EFC7C7]
              md:right-[10px]
              md:top-[-60px]
              md:text-[250px]
            "
          >
            02
          </div>

          {/* Heading */}
          <div
            className="
              relative
              z-10
              flex
              max-w-[850px]
              flex-col
              pt-8
              md:pt-10
            "
          >
            <h2
              className="
                max-w-[850px]
                text-[42px]
                font-bold
                leading-[1.15]
                tracking-[-0.03em]
                text-[#3B3535]
                sm:text-[52px]
                md:text-[64px]
                lg:text-[68px]
              "
            >
              ให้การฝึก{" "}
              <span className="text-[#B01414]">
                Cybersecurity
              </span>
              <br />
              สนุกยิ่งขึ้น
            </h2>
          </div>
        </div>

        {/* =====================================================
            Learning Journey Timeline
        ====================================================== */}
        <div className="relative">
          {/* ===================================================
              Center dashed timeline

              Starts at the first card level and ends at the
              last card level.

              This prevents:
              - Line above Story mode
              - Line below Certification
          ==================================================== */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-[78px]
              bottom-[220px]
              hidden
              w-[3px]
              -translate-x-1/2
              border-l-[3px]
              border-dashed
              border-[#3B3535]
              lg:block
            "
          />

          {/* ===================================================
              Timeline items
          ==================================================== */}
          <div className="relative flex flex-col gap-12 lg:gap-0">
            {timelineItems.map((item) => (
              <TimelineCard
                key={item.title}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================
   Timeline Card
============================================================= */

function TimelineCard({
  item,
}: {
  item: TimelineItem;
}) {
  const Icon = item.icon;
  const isLeft = item.side === "left";

  return (
    <div
      className={`
        relative
        flex
        w-full
        lg:min-h-[285px]
        lg:items-start
        ${isLeft ? "lg:justify-start" : "lg:justify-end"}
      `}
    >
      {/* =====================================================
          Horizontal dashed connector

          This connects the card to the center timeline.
          It is intentionally kept for ALL cards.
      ====================================================== */}
      <div
        className={`
          pointer-events-none
          absolute
          top-[78px]
          hidden
          h-[3px]
          w-[115px]
          border-t-[3px]
          border-dashed
          border-[#3B3535]
          lg:block

          ${
            isLeft
              ? "left-[calc(50%-115px)]"
              : "left-1/2"
          }
        `}
      />

      {/* =====================================================
          Card
      ====================================================== */}
      <article
        className={`
          relative
          z-10
          w-full
          rounded-lg
          border
          border-[#F2E6E6]
          bg-white
          px-8
          py-7
          shadow-[0_2px_12px_rgba(176,20,20,0.08)]
          transition-all
          duration-300

          hover:-translate-y-1
          hover:shadow-[0_8px_25px_rgba(176,20,20,0.12)]

          sm:px-9
          sm:py-8

          lg:w-[290px]
          lg:min-h-[255px]
          lg:px-8
          lg:py-7

          ${
            isLeft
              ? "lg:mr-auto"
              : "lg:ml-auto"
          }
        `}
      >
        {/* ===================================================
            Card title
        ==================================================== */}
        <div className="flex items-center gap-3">
          <Icon
            size={29}
            strokeWidth={2}
            className="shrink-0 text-[#B01414]"
          />

          <h3
            className="
              text-[22px]
              font-bold
              leading-none
              text-[#B01414]
              sm:text-[23px]
            "
          >
            {item.title}
          </h3>
        </div>

        {/* ===================================================
            Title underline
        ==================================================== */}
        <div
          className="
            mt-3
            h-[3px]
            w-[145px]
            bg-gradient-to-r
            from-[#B01414]
            via-[#D98B8B]
            to-transparent
          "
        />

        {/* ===================================================
            Description
        ==================================================== */}
        <p
          className="
            mt-5
            text-[13px]
            leading-[1.8]
            text-[#3B3535]
            sm:text-[14px]
          "
        >
          {item.description}
        </p>

        {/* ===================================================
            More button
        ==================================================== */}
        <button
          type="button"
          className="
            mt-7
            flex
            items-center
            gap-2
            text-[13px]
            font-medium
            text-[#3B3535]
            underline
            underline-offset-4
            transition-colors
            duration-200
            hover:text-[#B01414]
          "
        >
          เพิ่มเติม
          <span aria-hidden="true">→</span>
        </button>
      </article>
    </div>
  );
}