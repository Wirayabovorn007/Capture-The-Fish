import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type StoryCardProps = {
  title: string;
  description: string;
  side: "left" | "right";
  locked?: boolean;
};

const actOneCards: StoryCardProps[] = [
  {
    title: "Cybersecurity 101",
    description:
      "เรียนรู้พื้นฐานด้าน Cybersecurity ผ่านภารกิจแรกของการเดินทาง",
    side: "left",
  },
  {
    title: "Cybersecurity 101",
    description:
      "สำรวจข้อมูลและค้นหาเบาะแสที่ซ่อนอยู่ในระบบ",
    side: "right",
  },
  {
    title: "Cybersecurity 101",
    description:
      "ฝึกวิเคราะห์ข้อมูลและค้นหาสิ่งผิดปกติจากระบบ",
    side: "left",
  },
  {
    title: "Cybersecurity 101",
    description:
      "ค้นหาเบาะแสเพิ่มเติมเพื่อเดินทางต่อไปยังภารกิจถัดไป",
    side: "right",
  },
  {
    title: "Cybersecurity 101",
    description:
      "ท้าทายตัวเองด้วยโจทย์ที่ซับซ้อนมากขึ้น",
    side: "left",
  },
  {
    title: "Cybersecurity 101",
    description:
      "เชื่อมโยงเบาะแสทั้งหมดและค้นหาความจริงที่ซ่อนอยู่",
    side: "right",
  },
];

const actTwoCards: StoryCardProps[] = [
  {
    title: "Cybersecurity 101",
    description:
      "เข้าสู่ส่วนลึกของระบบและค้นหาสิ่งที่ถูกซ่อนไว้",
    side: "left",
  },
  {
    title: "Cybersecurity 101",
    description:
      "เผชิญหน้ากับโจทย์ที่ยากขึ้นและค้นหา Flag ต่อไป",
    side: "right",
  },
  {
    title: "Cybersecurity 101",
    description:
      "รวบรวมข้อมูลที่จำเป็นก่อนเข้าสู่บทสรุปของเรื่องราว",
    side: "left",
  },
  {
    title: "Cybersecurity 101",
    description:
      "ไขปริศนาสุดท้ายและเตรียมพร้อมสำหรับสมบัติที่รออยู่",
    side: "right",
  },
];

/* =========================================================
   Main Story
========================================================= */

export default function Story() {
  return (
    <>
      <Navbar />

      <style>{`
        /* =====================================================
           Story Timeline
        ====================================================== */

        .story-rail {
          position: absolute;
          left: 50%;
          top: 55px;
          bottom: 105px;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(
            to bottom,
            rgba(176, 20, 20, 0.05),
            rgba(176, 20, 20, 0.65) 10%,
            rgba(176, 20, 20, 0.65) 90%,
            rgba(176, 20, 20, 0.05)
          );
          box-shadow: 0 0 12px rgba(176, 20, 20, 0.08);
          pointer-events: none;
        }

        .story-rail-dark {
          position: absolute;
          left: 50%;
          top: 45px;
          bottom: 140px;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.65) 10%,
            rgba(255, 255, 255, 0.65) 90%,
            rgba(255, 255, 255, 0.05)
          );
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }

        /* =====================================================
           Timeline Nodes
        ====================================================== */

        .story-node,
        .story-node-dark {
          position: absolute;
          top: 66px;
          left: 50%;
          z-index: 30;

          display: flex;

          width: 28px;
          height: 28px;

          transform: translate(-50%, -50%);

          align-items: center;
          justify-content: center;

          border-radius: 9999px;

          font-family: monospace;
          font-size: 10px;
          font-weight: 700;

          transition:
            transform 300ms ease,
            box-shadow 300ms ease,
            background-color 300ms ease,
            color 300ms ease;
        }

        .story-node {
          border: 2px solid #B01414;
          background: white;
          color: #B01414;

          box-shadow:
            0 0 0 5px rgba(176, 20, 20, 0.06),
            0 0 18px rgba(176, 20, 20, 0.15);
        }

        .story-node-dark {
          border: 2px solid white;
          background: #1E1E1E;
          color: white;

          box-shadow:
            0 0 0 5px rgba(255, 255, 255, 0.05),
            0 0 18px rgba(255, 255, 255, 0.12);
        }

        /* =====================================================
           Card Connectors
        ====================================================== */

        .story-connector {
          position: absolute;
          top: 72px;
          height: 2px;

          pointer-events: none;

          transition:
            height 300ms ease,
            background 300ms ease,
            box-shadow 300ms ease;
        }

        .story-connector-left {
          left: 0;
          width: calc(50% - 14px);

          background: linear-gradient(
            to left,
            rgba(176, 20, 20, 0.7),
            rgba(176, 20, 20, 0.12)
          );
        }

        .story-connector-right {
          left: 50%;
          width: calc(50% - 14px);

          background: linear-gradient(
            to right,
            rgba(176, 20, 20, 0.7),
            rgba(176, 20, 20, 0.12)
          );
        }

        .story-connector-dark.story-connector-left {
          background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.08)
          );
        }

        .story-connector-dark.story-connector-right {
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.08)
          );
        }

        /* Connector endpoints */

        .story-connector::after {
          content: "";

          position: absolute;
          top: 50%;

          width: 7px;
          height: 7px;

          transform: translateY(-50%);

          border-radius: 9999px;

          background: #B01414;

          box-shadow:
            0 0 8px rgba(176, 20, 20, 0.3);

          transition:
            width 300ms ease,
            height 300ms ease;
        }

        .story-connector-left::after {
          left: 0;
        }

        .story-connector-right::after {
          right: 0;
        }

        .story-connector-dark::after {
          background: white;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.25);
        }

        /* =====================================================
           Timeline Hover
        ====================================================== */

        .story-timeline-row:has(.story-card:hover)
          .story-node {
          transform: translate(-50%, -50%) scale(1.15);

          background: #B01414;
          color: white;

          box-shadow:
            0 0 0 7px rgba(176, 20, 20, 0.08),
            0 0 25px rgba(176, 20, 20, 0.3);
        }

        .story-timeline-row:has(.story-card:hover)
          .story-connector {
          height: 3px;

          background: #B01414;

          box-shadow:
            0 0 10px rgba(176, 20, 20, 0.2);
        }

        .story-timeline-row:has(.story-card:hover)
          .story-connector::after {
          width: 9px;
          height: 9px;
        }

        /* Dark timeline hover */

        .story-timeline-row:has(.story-card-dark:hover)
          .story-node-dark {
          transform: translate(-50%, -50%) scale(1.15);

          background: white;
          color: #1E1E1E;

          box-shadow:
            0 0 0 7px rgba(255, 255, 255, 0.06),
            0 0 25px rgba(255, 255, 255, 0.2);
        }

        .story-timeline-row:has(.story-card-dark:hover)
          .story-connector-dark {
          height: 3px;

          background: white;

          box-shadow:
            0 0 10px rgba(255, 255, 255, 0.18);
        }

        .story-timeline-row:has(.story-card-dark:hover)
          .story-connector-dark::after {
          width: 9px;
          height: 9px;
        }

        /* =====================================================
           Final Story Branch
        ====================================================== */

        .story-final-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.7),
            rgba(255, 255, 255, 0.08)
          );
        }

        /* =====================================================
           Responsive
        ====================================================== */

        @media (max-width: 1023px) {
          .story-rail,
          .story-rail-dark,
          .story-node,
          .story-node-dark,
          .story-connector,
          .story-final-line {
            display: none;
          }
        }
      `}</style>

      <main className="w-full overflow-hidden">
        {/* =====================================================
            ACT I
        ====================================================== */}

        <section className="relative  px-5 pb-32 pt-20 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[1100px]">

            {/* ================= Intro ================= */}

            <div className="relative">

              {/* Large 01 */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-[-10px]
                  top-[90px]
                  select-none
                  text-[200px]
                  leading-none
                  text-[#EFC7C7]
                  sm:right-0
                "
              >
                01
              </div>

              <div className="relative z-10 max-w-[900px]">

                {/* Breadcrumb */}

                <p className="mb-4 text-[#403a38]">
                  ให้การ{" "}
                  <span className="text-[#B01414]">
                    Cybersecurity
                  </span>{" "}
                  สนุกยิ่งขึ้นด้วย โหมดเนื้อเรื่อง
                </p>

                {/* Title */}

                <h1
                  className="
                    max-w-[900px]
                    text-7xl
                    font-bold
                    leading-[1.1]
                    tracking-tight
                    text-[#3B3535]
                  "
                >
                  The{" "}
                  <span className="text-[#B01414]">
                    Deep Sea
                  </span>{" "}
                  Incident
                </h1>

                {/* Description */}

                <div
                  className="
                    mt-5
                    max-w-[850px]
                    leading-[1.7]
                    text-[#403a38]
                  "
                >
                  <p>
                    ใต้มหาสมุทรแปซิฟิก มีสถานีวิจัยลับแห่งหนึ่งที่ถูกสร้างขึ้นเพื่อเฝ้าติดตามและเก็บข้อมูลสิ่งมีชีวิตในทะเลลึก สถานีแห่งนี้ทำงานร่วมกับระบบคอมพิวเตอร์และเครือข่ายจำนวนมาก เพื่อรวบรวมข้อมูลจากอุปกรณ์ตรวจวัดและสถานีสำรวจที่กระจายอยู่ทั่วมหาสมุทร
แต่วันหนึ่ง ระบบของสถานีเริ่มเกิดความผิดปกติ
ข้อมูลบางส่วนถูกแก้ไข ไฟล์สำคัญหายไป และระบบตรวจพบการสื่อสารแปลกประหลาดจากสถานีสำรวจที่ไม่ควรมีการติดต่ออีกแล้ว นักวิจัยจึงเริ่มสงสัยว่าเหตุการณ์ทั้งหมดอาจไม่ได้เกิดจากความผิดพลาดของระบบธรรมดา
เบาะแสที่กระจัดกระจายอยู่ตามสถานีต่าง ๆ นำไปสู่ความลับบางอย่างที่ถูกซ่อนเอาไว้ ทั้งข้อความเข้ารหัส ข้อมูลที่ถูกซ่อน ระบบเครือข่ายที่ผิดปกติ และร่องรอยของผู้บุกรุกที่พยายามปกปิดตัวตน
ภารกิจของผู้เล่นคือการสำรวจระบบเหล่านี้ ค้นหาเบาะแส วิเคราะห์ข้อมูล และเปิดเผยความจริงที่ซ่อนอยู่ใต้มหาสมุทร
ทุกเบาะแสมีความหมาย และทุกสิ่งที่ถูกซ่อนไว้กำลังนำคุณเข้าใกล้ความจริง
แต่เมื่อคุณตามรอยไปถึงจุดสุดท้าย คุณอาจพบว่า...
สิ่งที่น่ากลัวที่สุดในมหาสมุทร ไม่ใช่สิ่งที่อยู่ใต้น้ำ
                  </p>
                </div>
              </div>
            </div>

            {/* ================= ACT I TIMELINE ================= */}

            <div className="relative mt-10 sm:mt-16">

              {/* Center vertical timeline */}

              <div
                aria-hidden="true"
                className="story-rail hidden lg:block"
              />

              {/* Act I title */}

              <div
                className="
                  absolute
                  right-0
                  top-[-25px]
                  z-10
                  text-lg
                  text-[#403a38]
                  sm:text-xl
                "
              >
                Act I – Echoes from the Deep
              </div>

              <div className="relative flex flex-col gap-12 pt-20 lg:gap-0">
                {actOneCards.map((card, index) => (
                  <StoryTimelineCard
                    key={`act1-${index}`}
                    {...card}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACT II
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#1E1E1E] px-5 pb-40 pt-36 text-white sm:px-8 lg:px-16">

          {/* Diagonal white transition */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -top-[1px]
              left-0
              h-[180px]
              w-[120%]
              origin-top-left
              -translate-x-[2%]
              -translate-y-[75px]
              -rotate-[28deg]
              bg-white
              lg:h-[230px]
              lg:-translate-y-[95px]
              lg:-rotate-[24deg]
            "
          />

          <div className="relative z-10 mx-auto max-w-[1100px]">

            {/* ================= Act II Header ================= */}

            <div className="relative min-h-[230px]">

              {/* Large 02 */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-0
                  top-0
                  select-none
                  text-[200px]
                  leading-none
                  text-white/[0.28]
                "
              >
                02
              </div>

              <div className="relative z-10 pt-32 sm:pt-36">
                <h2
                  className="
                    text-xl
                    text-white
                  "
                >
                  Act II – The Abyss Awakens
                </h2>
              </div>
            </div>

            {/* ================= ACT II TIMELINE ================= */}

            <div className="relative mt-2">

              {/* Center vertical timeline */}

              <div
                aria-hidden="true"
                className="story-rail-dark hidden lg:block"
              />

              <div className="relative flex flex-col gap-12 lg:gap-0">
                {actTwoCards.map((card, index) => (
                  <StoryTimelineCard
                    key={`act2-${index}`}
                    {...card}
                    index={index}
                    dark
                  />
                ))}
              </div>
            </div>

            {/* ================= TREASURE ================= */}

            <Treasure />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   Timeline Card
========================================================= */

function StoryTimelineCard({
  title,
  description,
  side,
  index,
  dark = false,
}: StoryCardProps & {
  index: number;
  dark?: boolean;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={`
        story-timeline-row
        relative
        flex
        w-full
        lg:min-h-[290px]
        ${isLeft ? "lg:justify-start" : "lg:justify-end"}
      `}
    >

      {/* Horizontal connector */}

      <div
        aria-hidden="true"
        className={`
          story-connector
          ${isLeft
            ? "story-connector-left"
            : "story-connector-right"
          }
          ${dark ? "story-connector-dark" : ""}
          hidden
          lg:block
        `}
      />

      {/* Timeline numbered node */}

      <div
        aria-hidden="true"
        className={`
          ${dark
            ? "story-node-dark"
            : "story-node"
          }
          hidden
          lg:flex
        `}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Card */}

      <article
        className={`
          story-card
          ${dark ? "story-card-dark" : ""}
          group
          relative
          z-10
          w-full
          max-w-[290px]
          cursor-pointer
          rounded-lg
          border
          p-3
          shadow-sm
          transition-all
          duration-300

          hover:-translate-y-2
          hover:shadow-xl

          ${
            dark
              ? "border-[#444] bg-white text-[#3B3535]"
              : "border-[#F0E3E3] bg-white text-[#3B3535]"
          }

          ${isLeft ? "lg:mr-auto" : "lg:ml-auto"}
        `}
      >

        {/* Image placeholder */}

        <StoryImage />

        {/* Card content */}

        <div className="p-3 pb-1 pt-2">

          {/* Metadata */}

          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-medium text-green-600">
              Easy
            </span>

            <span className="text-gray-400">
              ●
            </span>

            <span className="text-gray-400">
              0/1 flag
            </span>
          </div>

          {/* Title */}

          <h3
            className="
              mt-1
              text-xl
              font-bold
              text-[#3B3535]
              transition-colors
              duration-200
              group-hover:text-[#B01414]
            "
          >
            {title}
          </h3>

          {/* Description */}

          <p className="mt-1 line-clamp-2 leading-[1.5] text-gray-500">
            {description}
          </p>

          {/* Button */}

          <button
            type="button"
            className="
              mt-2
              bg-[#B01414]
              px-4
              py-1.5
              text-white
              transition-all
              duration-200
              hover:bg-[#8F1010]
              hover:shadow-md
              active:scale-95
            "
          >
            เริ่มทำ
          </button>
        </div>
      </article>
    </div>
  );
}

/* =========================================================
   Card Image
========================================================= */

function StoryImage() {
  return (
    <div
      className="
        relative
        h-[105px]
        overflow-hidden
        rounded-sm
        bg-gradient-to-b
        from-[#112d08]
        via-[#257a14]
        to-[#3e9b25]
        transition-transform
        duration-300
        group-hover:scale-[1.02]
      "
    >

      {/* Glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-12
          w-28
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border-2
          border-lime-300/70
          shadow-[0_0_25px_rgba(150,255,40,0.5)]
          transition-all
          duration-300
          group-hover:scale-110
        "
      />

      {/* Radar rings */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-8
          w-20
          -translate-x-1/2
          -translate-y-1/2
          rounded-[50%]
          border
          border-lime-300/60
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-5
          w-12
          -translate-x-1/2
          -translate-y-1/2
          rounded-[50%]
          border
          border-lime-300/50
        "
      />

      {/* Vertical radar beam */}

      <div
        className="
          absolute
          bottom-[28px]
          left-1/2
          h-[35px]
          w-[2px]
          -translate-x-1/2
          bg-lime-300/50
        "
      />

      {/* Small fish-like marker */}

      <div
        className="
          absolute
          bottom-5
          left-[42%]
          h-3
          w-5
          rotate-[-15deg]
          rounded-full
          bg-lime-400/70
        "
      />

      <div
        className="
          absolute
          bottom-[17px]
          left-[37%]
          h-0
          w-0
          border-b-[5px]
          border-r-[7px]
          border-t-[5px]
          border-b-transparent
          border-r-lime-400/70
          border-t-transparent
        "
      />

      {/* Scan line */}

      <div
        className="
          absolute
          left-0
          right-0
          top-1/2
          border-t
          border-lime-300/20
        "
      />
    </div>
  );
}

/* =========================================================
   Treasure
========================================================= */

function Treasure() {
  return (
    <div className="relative mt-16 flex flex-col items-center pb-4">

      {/* Chest glow */}

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-16
          h-28
          w-44
          rounded-full
          bg-[#B01414]/10
          blur-3xl
        "
      />

      {/* Treasure chest */}

      <div className="relative h-[145px] w-[190px]">

        {/* Open lid */}

        <div
          className="
            absolute
            left-[28px]
            top-[20px]
            h-[60px]
            w-[134px]
            rotate-[-8deg]
            rounded-t-[55px]
            border-[8px]
            border-[#F59B2F]
            bg-[#8D2222]
            shadow-lg
          "
        >
          <div className="absolute left-5 right-5 top-4 h-3 rounded-full bg-[#F8B13A]" />
        </div>

        {/* Chest body */}

        <div
          className="
            absolute
            bottom-3
            left-[25px]
            h-[75px]
            w-[140px]
            rounded-b-xl
            border-8
            border-[#F59B2F]
            bg-[#B83B32]
            shadow-xl
          "
        >
          <div className="absolute left-0 right-0 top-4 h-5 bg-[#D95543]" />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-7
              w-5
              -translate-x-1/2
              -translate-y-1/2
              rounded-sm
              bg-[#F6B933]
            "
          />
        </div>

        {/* Coins */}

        <div className="absolute bottom-0 left-3 text-3xl">
          🪙
        </div>

        <div className="absolute bottom-0 right-3 text-3xl">
          🪙
        </div>

        <div className="absolute left-8 top-8 text-xl">
          ✨
        </div>

        <div className="absolute right-7 top-5 text-xl">
          ✨
        </div>
      </div>

      <h3
        className="
          mt-2
          text-xl
          text-white
          transition-colors
          duration-300
          hover:text-[#B01414]
        "
      >
        สมบัติใต้ทะเลลึก
      </h3>

      <p className="mt-2 text-center text-xs text-gray-400">
        Complete the story and discover what lies beneath.
      </p>
    </div>
  );
}