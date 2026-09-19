import { useRef } from "react"
import TaskSetup from "../components/competition/Setup_task"
import Task from "../components/competition/Task"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

/* =============================================================
   Challenge Detail
============================================================= */

export default function Challenge_detail() {
	const heroRef = useRef<HTMLDivElement>(null)


	return (
		<>
			<div className="absolute w-full">
							<Navbar/>
							

{/* =====================================================
			    Hero
			    - Sits at the very top of the page (no top margin/offset)
			====================================================== */}
			<section
				className="top-0 absolute w-full z-0 overflow-hidden px-6 pb-14 pt-32 sm:px-10 sm:pt-40"
				style={{
					background: "linear-gradient(135deg, #3D3D3D 0%, #1e1e1e 100%)",
				}}
			>
				{/* decorative "</>" background motif */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[26rem] font-bold leading-none text-white/[0.04] sm:text-[32rem]"
				>
					{"</>"}
				</span>

				<div ref={heroRef} className="relative z-10 mx-auto max-w-6xl">
					<h1 className="text-7xl font-bold text-white sm:text-6xl">Salmon's Secret </h1>

					<div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
					

						<div className="text-white">
								<p className="text-lg text-white">
									Dificulty: ง่าย <br />
									Category: Web / Recon <br />
									Fish amount: 100
								</p>
							<p className="text-white mt-10">สถานีวิจัยทางทะเลแห่งหนึ่งกำลังตรวจสอบระบบติดตามการอพยพของปลาแซลมอน หลังจากพบว่าระบบบางส่วนมีข้อมูลเก่าที่ไม่ควรยังคงอยู่บนเซิร์ฟเวอร์
							ทีมวิจัยเชื่อว่ามีบางอย่างถูกซ่อนไว้ในระบบ แต่ไม่มีใครรู้ว่ามันอยู่ที่ไหน คุณได้รับหน้าที่ให้สำรวจเว็บไซต์และค้นหาสิ่งที่นักวิจัยคนก่อนทิ้งเอาไว้</p>
						</div>
					</div>
				</div>
			</section>

			<section className="text-[#3C3232] mx-36 mt-[500px] flex flex-col gap-y-10 mb-64 ">
				<div>
					<h1 className="font-bold text-xl">Description</h1>
				<p>สถานีวิจัยทางทะเลพบความผิดปกติบางอย่างในระบบเว็บไซต์ของสถานี ข้อมูลจากโครงการติดตามปลาแซลมอนในอดีตดูเหมือนจะยังหลงเหลืออยู่บนเซิร์ฟเวอร์
 นักวิจัยเชื่อว่ามีความลับบางอย่างถูกซ่อนไว้ในระบบ จงสำรวจเว็บไซต์และค้นหาสิ่งที่ถูกทิ้งเอาไว้</p>
				</div>

				<div>
					<h1 className="font-bold text-xl">Objective</h1>
				<p>ค้นหา Flag ที่ถูกซ่อนอยู่ภายในเว็บไซต์</p>
				</div>
				
				<div>
					<h1 className="font-bold text-xl">Hints</h1>
				<ul className="list-disc pl-6 space-y-2">
				<li>dirb, Browser Developer Tools</li>
				<li>Not everything on a website is meant to be seen.</li>
				</ul>
				
				</div>
				
				<div>
				<h1 className="font-bold text-xl">Flag format</h1>
				<p>flag&#123;****&#125;</p>
				</div>


			</section>

				<section>
					<TaskSetup/>
					<Task/>
				</section>


							<Footer/>
			</div>
		</>
	)
}
