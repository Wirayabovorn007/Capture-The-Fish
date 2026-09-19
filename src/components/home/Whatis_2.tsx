import {
  BarChart3,
  CircleCheck,
  Crosshair,
  Fish,
} from "lucide-react";

type FloatingItem = {
  text: string;
  emoji?: string;

  // Desktop positioning
  desktopClassName?: string;

  // Mobile positioning
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
        desktopClassName:
          "left-[4%] top-[17%] w-[310px] rotate-[1deg]",
        mobileClassName:
          "self-end w-full max-w-[420px] rotate-[1deg]",
      },
      {
        text: "Networking",
        desktopClassName:
          "left-[10%] top-[39%] w-[300px] rotate-[1deg]",
        mobileClassName:
          "self-start ml-2 w-[300px] rotate-[1deg]",
      },
      {
        text: "Cryptography",
        desktopClassName:
          "left-[25%] top-[57%] w-[300px] rotate-[-1deg]",
        mobileClassName:
          "self-end mr-6 w-[300px] rotate-[-1deg]",
      },
      {
        text: "Forensics",
        desktopClassName:
          "left-[15%] top-[76%] w-[290px] rotate-[-2deg]",
        mobileClassName:
          "self-start ml-12 w-[290px] rotate-[-2deg]",
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
        desktopClassName:
          "left-[16%] top-[17%] w-[285px] border-green-300",
        mobileClassName:
          "self-end w-full max-w-[360px] border-green-300",
      },
      {
        emoji: "🥺",
        text: "Medium  -  ชิวอยู่พี่",
        desktopClassName:
          "left-[38%] top-[39%] w-[300px] border-red-200",
        mobileClassName:
          "self-start ml-2 w-full max-w-[380px] border-red-200",
      },
      {
        emoji: "😭",
        text: "Hard  -  ร้องขอชีวิต",
        desktopClassName:
          "left-[18%] top-[60%] w-[285px] border-red-400",
        mobileClassName:
          "self-end mr-4 w-full max-w-[360px] border-red-400",
      },
    ],
  },

  {
    title: "ปลาให้สะสม",
    icon: Fish,
    items: [
      {
        text: "ปลาหมอกดำ",
        desktopClassName:
          "left-[30%] top-[17%] w-[310px] rotate-[1deg]",
        mobileClassName:
          "self-end w-full max-w-[420px] rotate-[1deg]",
      },
      {
        text: "โลมา",
        desktopClassName:
          "left-[52%] top-[39%] w-[210px] rotate-[2deg]",
        mobileClassName:
          "self-start ml-8 w-[260px] rotate-[2deg]",
      },
      {
        text: "ฉลาม",
        desktopClassName:
          "left-[42%] top-[57%] w-[230px] rotate-[-1deg]",
        mobileClassName:
          "self-end mr-10 w-[280px] rotate-[-1deg]",
      },
      {
        text: "ปิรันยา",
        desktopClassName:
          "left-[47%] top-[74%] w-[240px] rotate-[-2deg]",
        mobileClassName:
          "self-start ml-14 w-[290px] rotate-[-2deg]",
      },
    ],
  },
];

export default function ProblemFeatures() {
  return (
    <section
      className="
        w-full
        overflow-hidden
        py-12
        md:py-16
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1200px]
          grid-cols-1
          gap-20
          px-5
          sm:px-8
          md:grid-cols-3
          md:gap-8
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

        md:h-[390px]
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
              text-[26px]
              font-bold
              leading-none
              text-[#3B3535]
              sm:text-[28px]
              md:text-[25px]
              lg:text-[28px]
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

          md:mt-0
          md:block
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

              /* Mobile */
              ${item.mobileClassName ?? ""}

              /* Desktop */
              md:absolute
              md:${getDesktopPosition(item)}
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
                text-[18px]
                font-semibold
                leading-none
                text-[#3B3535]
                md:text-[17px]
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
 * We explicitly map every desktop class here.
 * This prevents Tailwind from having to understand:
 *
 *     md:${item.className}
 *
 * which is unreliable because it is dynamically constructed.
 */
function getDesktopPosition(item: FloatingItem) {
  const positions: Record<string, string> = {
    "Web exploitation":
      "left-[4%] top-[17%] w-[310px] rotate-[1deg]",

    Networking:
      "left-[10%] top-[39%] w-[300px] rotate-[1deg]",

    Cryptography:
      "left-[25%] top-[57%] w-[300px] rotate-[-1deg]",

    Forensics:
      "left-[15%] top-[76%] w-[290px] rotate-[-2deg]",

    "Easy  -  ง่ายมาก":
      "left-[16%] top-[17%] w-[285px] border-green-300",

    "Medium  -  ชิวอยู่พี่":
      "left-[38%] top-[39%] w-[300px] border-red-200",

    "Hard  -  ร้องขอชีวิต":
      "left-[18%] top-[60%] w-[285px] border-red-400",

    ปลาหมอกดำ:
      "left-[30%] top-[17%] w-[310px] rotate-[1deg]",

    โลมา:
      "left-[52%] top-[39%] w-[210px] rotate-[2deg]",

    ฉลาม:
      "left-[42%] top-[57%] w-[230px] rotate-[-1deg]",

    ปิรันยา:
      "left-[47%] top-[74%] w-[240px] rotate-[-2deg]",
  };

  return positions[item.text] ?? "";
}