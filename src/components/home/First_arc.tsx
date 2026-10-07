import Mask from "../../assets/home/Mask.png";

export default function First_arc() {
  return (
    <>
      <article className="mt-20 sm:mt-24 md:mt-32 lg:mt-36 px-4 sm:px-6 lg:px-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-1 text-[#B01414] font-bold">
          Capture the Fishes
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl py-1">
          Explore the challenge!
        </p>
        <p className="py-1 text-sm sm:text-base max-w-md sm:max-w-xl lg:max-w-none">
          เปลี่ยนการฝึก Cybersecurity แบบเดิม ๆ ให้กลายเป็นการผจญภัย ออกล่า Flag
          สะสมปลา และปลดล็อกทักษะใหม่ไปพร้อมกัน
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a href="/story" className="w-full sm:w-auto">
            <button
              className="
								group relative overflow-hidden w-full sm:w-auto
								font-bold text-white
								bg-[#B01414] border border-[#B01414]
								px-6 py-2.5 sm:px-8 sm:py-3
								text-sm sm:text-base
								transition-all duration-300
								hover:-translate-y-1
								hover:shadow-[4px_4px_0px_#3C3232]
								active:translate-y-0
								active:shadow-none
							"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
                จับปลาเลย
              </span>

              <span
                className="
									absolute inset-0
									-translate-x-full
									bg-white/10
									skew-x-[-20deg]
									transition-transform duration-500
									group-hover:translate-x-full
								"
              />
            </button>
          </a>

          <a href="/competition" className="w-full sm:w-auto">
            <button
              className="
								group relative overflow-hidden w-full sm:w-auto
								font-bold text-[#3C3232]
								border border-[#3C3232]
								bg-transparent
								px-6 py-2.5 sm:px-8 sm:py-3
								text-sm sm:text-base
								transition-all duration-300
								hover:bg-[#3C3232]
								hover:text-white
								hover:-translate-y-1
								hover:shadow-[4px_4px_0px_#B01414]
								active:translate-y-0
								active:shadow-none
							"
            >
              <span className="relative z-10">ดูโจทย์ทั้งหมด</span>
            </button>
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 mt-24 sm:mt-32 md:mt-44 lg:mt-60 px-4 sm:px-0 text-xs sm:text-sm">
          <img src={Mask} alt="" className="h-auto w-auto mx-1" />
          <p>
            Developed by{" "}
            <a
              href="https://www.instagram.com/to.exphp/"
              target="_blank"
              className="underline"
            >
              to.exphp
            </a>
            ,
            <a
              target="_blank"
              href="https://www.instagram.com/kenkungkab/"
              className="underline"
            >
              kenkungkab
            </a>
            ,
            <a
              target="_blank"
              href="https://www.instagram.com/callme_luckr/"
              className="underline"
            >
              callme_luckr
            </a>
            ,
            <a
              target="_blank"
              className="underline"
              href="https://www.instagram.com/wiraya.sh/"
            >
              wiraya.sh
            </a>
          </p>
        </div>
      </article>
    </>
  );
}
