import ProblemSlider from "./Problems";
import ArrowDown from "../../assets/home/arrow_down.png";

export default function Second_arc() {
  return (
    <>
      <article className="my-24 sm:my-36 lg:my-64 px-4 sm:px-6 lg:px-0">
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold">
          เลือกเป้าหมาย <span className="text-[#B01414]">แล้วออกล่า!</span>
        </h1>
        <ProblemSlider />
        <p className="text-center mt-10 sm:mt-14 lg:mt-20 text-sm sm:text-base">
          ยังไม่รู้จะเริ่มจากตรงใหนใช่มั้ย? เราขอแนะนำ{" "}
          <a href="/story" className="text-[#B01414] underline">
            โหมดเนื้อเรื่อง →
          </a>
        </p>
        <img
          className="block m-auto mt-20 sm:mt-28 lg:mt-44 select-none w-24 sm:w-auto"
          src={ArrowDown}
          alt="arrow down"
        />
      </article>
    </>
  );
}
