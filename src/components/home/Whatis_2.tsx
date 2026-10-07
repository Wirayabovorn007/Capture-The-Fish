import { BarChart3, CircleCheck, Crosshair, Fish } from "lucide-react";

type FloatingItem = {
  text: string;
  emoji?: string;

  // Desktop positioning
  desktopClassName?: string;

  // Mobile/tablet positioning
  mobileClassName?: string;
};

type FeatureSection = {
  title: string;
  icon: typeof Crosshair;
  items: FloatingItem[];
};

const sections: FeatureSection[] = [
  {
    title: "โจทย์มากมาย",
    icon: Crosshair,
    items: [
      {
        text: "Web exploitation",
        desktopClassName: "left-[4%] top-[17%] w-[310px] rotate-[1deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[1deg]",
      },
      {
        text: "Networking",
        desktopClassName: "left-[10%] top-[39%] w-[300px] rotate-[1deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[1deg]",
      },
      {
        text: "Cryptography",
        desktopClassName: "left-[25%] top-[57%] w-[300px] rotate-[-1deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[-1deg]",
      },
      {
        text: "Forensics",
        desktopClassName: "left-[15%] top-[76%] w-[290px] rotate-[-2deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[-2deg]",
      },
    ],
  },

  {
    title: "หลายระดับความยาก",
    icon: BarChart3,
    items: [
      {
        emoji: "😄",
        text: "Easy  -  ง่ายมาก",
        desktopClassName: "left-[16%] top-[17%] w-[285px] border-green-300",
        mobileClassName: "w-full max-w-[360px] border-green-300",
      },
      {
        emoji: "🥺",
        text: "Medium  -  ชิวอยู่พี่",
        desktopClassName: "left-[38%] top-[39%] w-[300px] border-red-200",
        mobileClassName: "w-full max-w-[380px] border-red-200",
      },
      {
        emoji: "😭",
        text: "Hard  -  ร้องขอชีวิต",
        desktopClassName: "left-[18%] top-[60%] w-[285px] border-red-400",
        mobileClassName: "w-full max-w-[360px] border-red-400",
      },
    ],
  },

  {
    title: "ปลาให้สะสม",
    icon: Fish,
    items: [
      {
        text: "ปลาหมอกดำ",
        desktopClassName: "left-[30%] top-[17%] w-[310px] rotate-[1deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[1deg]",
      },
      {
        text: "โลมา",
        desktopClassName: "left-[52%] top-[39%] w-[210px] rotate-[2deg]",
        mobileClassName: "w-full max-w-[4200px] rotate-[2deg]",
      },
      {
        text: "ฉลาม",
        desktopClassName: "left-[42%] top-[57%] w-[230px] rotate-[-1deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[-1deg]",
      },
      {
        text: "ปิรันยา",
        desktopClassName: "left-[47%] top-[74%] w-[240px] rotate-[-2deg]",
        mobileClassName: "w-full max-w-[420px] rotate-[-2deg]",
      },
    ],
  },
];

export default function ProblemFeatures() {
  return (
    <section
      className="
        w-full
        py-12
        xl:py-16
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1200px]
          grid-cols-1
          gap-12
          sm:gap-20
          px-5
          sm:px-8
          xl:grid-cols-3
          xl:gap-8
          lg:px-6
        "
      >
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <FeatureColumn
              key={section.title}
              title={section.title}
              icon={Icon}
              items={section.items}
            />
          );
        })}
      </div>
    </section>
  );
}

function FeatureColumn({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: FloatingItem[];
}) {
  return (
    <div
      className="
        relative
        min-w-0

        xl:h-[390px]
      "
    >
      {/* =========================
          Heading
      ========================== */}
      <div
        className="
          relative
          z-20
          flex
          flex-col
          items-center
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Icon
            size={38}
            strokeWidth={2}
            className="
              shrink-0
              text-[#B01414]
            "
          />

          <h2
            className="
              whitespace-nowrap
              text-[22px]
              font-bold
              leading-none
              text-[#3B3535]
              sm:text-[26px]
              lg:text-[27px]
              xl:text-[28px]
            "
          >
            {title}
          </h2>
        </div>

        {/* Underline */}
        <div
          className="
            mt-4
            h-[5px]
            w-[150px]
            bg-gradient-to-r
            from-[#B01414]
            via-[#D98B8B]
            to-transparent
          "
        />
      </div>

      {/* =========================
          Items
      ========================== */}
      <div
        className="
          mt-8
          flex
          flex-col
          items-center
          gap-4

          xl:mt-0
          xl:block
        "
      >
        {items.map((item) => (
          <div
            key={`${item.emoji ?? ""}-${item.text}`}
            className={`
              relative
              z-10
              flex
              min-h-[58px]
              max-w-full
              shrink-0
              items-center
              rounded-xl
              border
              border-transparent
              bg-white
              px-5
              py-3
              shadow-[0_5px_22px_rgba(0,0,0,0.06)]
              transition-all
              duration-300

              hover:z-30
              hover:-translate-y-1
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.10)]

              /* Mobile / Tablet (incl. iPad Mini 768x1024) */
              ${item.mobileClassName ?? ""}

              /* Desktop (>=1280px) */
              xl:absolute
              ${getDesktopPosition(item)}
            `}
          >
            {/* Emoji / Check */}
            {item.emoji ? (
              <span
                className="
                  mr-5
                  shrink-0
                  text-[28px]
                  leading-none
                "
              >
                {item.emoji}
              </span>
            ) : (
              <CircleCheck
                size={20}
                strokeWidth={2}
                className="
                  mr-4
                  shrink-0
                  text-green-500
                "
              />
            )}

            {/* Text */}
            <span
              className="
                whitespace-nowrap
                text-[16px]
                sm:text-[18px]
                font-semibold
                leading-none
                text-[#3B3535]
                xl:text-[17px]
              "
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * IMPORTANT:
 *
 * We explicitly map every desktop class here, each already
 * prefixed with xl: individually. This prevents Tailwind's JIT
 * from missing the breakpoint on anything but the first token,
 * and stops these values leaking into the mobile/tablet layout
 * — which now includes the full iPad Mini range (768x1024,
 * both orientations) using the safe stacked/centered layout.
 */
function getDesktopPosition(item: FloatingItem) {
  const positions: Record<string, string> = {
    "Web exploitation":
      "xl:left-[4%] xl:top-[17%] xl:w-[310px] xl:rotate-[1deg]",

    Networking: "xl:left-[10%] xl:top-[39%] xl:w-[300px] xl:rotate-[1deg]",

    Cryptography: "xl:left-[25%] xl:top-[57%] xl:w-[300px] xl:rotate-[-1deg]",

    Forensics: "xl:left-[15%] xl:top-[76%] xl:w-[290px] xl:rotate-[-2deg]",

    "Easy  -  ง่ายมาก":
      "xl:left-[16%] xl:top-[17%] xl:w-[285px] xl:border-green-300",

    "Medium  -  ชิวอยู่พี่":
      "xl:left-[38%] xl:top-[39%] xl:w-[300px] xl:border-red-200",

    "Hard  -  ร้องขอชีวิต":
      "xl:left-[18%] xl:top-[60%] xl:w-[285px] xl:border-red-400",

    ปลาหมอกดำ: "xl:left-[30%] xl:top-[17%] xl:w-[310px] xl:rotate-[1deg]",

    โลมา: "xl:left-[52%] xl:top-[39%] xl:w-[210px] xl:rotate-[2deg]",

    ฉลาม: "xl:left-[42%] xl:top-[57%] xl:w-[230px] xl:rotate-[-1deg]",

    ปิรันยา: "xl:left-[47%] xl:top-[74%] xl:w-[240px] xl:rotate-[-2deg]",
  };

  return positions[item.text] ?? "";
}
