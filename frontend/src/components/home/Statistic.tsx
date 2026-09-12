
import Timer from "../../assets/home/Timer.png"
import Fish from "../../assets/home/Fish.png"
import People from "../../assets/home/People.png"
import Wing from "../../assets/home/Laurel Wreath.png"


export default function Statistic(){
	return (
		<>
			<div className="bg-[#B01414] text-white flex gap-14 my-10 py-6 justify-center">
				<div className="flex gap-4 items-center">
					<img src={Wing} alt="" className="h-10"/>
					<div><p className="text-white text-4xl font-bold">9+</p><span className="text-sm">โจทย์ท้าทาย</span> </div>
				</div>
					<span className="hidden h-auto w-px bg-white md:block" />
				<div className="flex gap-4 items-center">
					<img src={People} alt="" className="h-10 "/>
					<div><p className="text-white text-4xl font-bold">2,450+</p> <span className="text-sm">ผู้เล่นทั่วประเทศ</span> </div>
				</div>
				<span className="hidden h-auto w-px bg-white md:block" />
				<div className="flex gap-4 items-center">
					<img src={Fish} alt="" className="h-10 "/>
					<div><p className="text-white text-4xl font-bold">900+</p> <span className="text-sm">ปลาที่สะสมแล้ว</span> </div>
				</div>
				<span className="hidden h-auto w-px bg-white md:block" />
				<div>
					<div className="flex gap-4 items-center">
						<img src={Timer} alt="" className="h-10"/>
						<div><p className="text-white text-4xl font-bold">15,000+</p> <span className="text-sm">ชั่วโมงการเล่นรวม</span></div>
					</div>
				</div>

			</div>
		</>
	)
}