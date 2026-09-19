import ProblemSlider from "./Problems"
import ArrowDown from "../../assets/home/arrow_down.png"

export default function Second_arc()
{
	return (
		<>
			<article className="my-64">
				<h1 className="text-7xl font-bold">เลือกเป้าหมาย <span className="text-[#B01414]">แล้วออกล่า!</span></h1>
				<ProblemSlider/>
				<p className="text-center mt-20">ยังไม่รู้จะเริ่มจากตรงใหนใช่มั้ย? เราขอแนะนำ <a href="/story" className="text-[#B01414] underline">โหมดเนื้อเรื่อง →</a></p>
				<img className="block m-auto mt-44 select-none "  src={ArrowDown} alt="arrow down" />
			</article>
		</>
	)
}