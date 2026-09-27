import ProblemFeatures from "./Whatis_2"


export default function Whatis()
{
	return (
		<>
		<article className="px-4 sm:px-6 lg:px-0">
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 items-center lg:items-center">
				<h1 className="text-[190px] md:text-[250px] text-[#B01414]/30 leading-none">01</h1>
				<div>
					<div className="my-4 sm:my-6">
					<h1 className="text-[42px]  font-bold my-3 text-center lg:text-right">
						<span className="text-[#B01414]">Capture the Fish</span> คืออะไร?
					</h1>
					<div className="flex flex-wrap justify-center lg:justify-end gap-y-2">
						<span className="inline-flex items-center gap-2 text-sm sm:text-base">
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
            </svg> Beginner-friendly
						</span>
						<span className="inline-flex items-center gap-2 mx-6 text-sm sm:text-base">
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
            </svg> Guides and challenges
						</span>
					</div>
				</div>
					<p className="text-sm sm:text-base text-center lg:text-left">
						Capture the Fish คือแพลตฟอร์มฝึกทักษะ Cybersecurity ในรูปแบบ CTF ที่ผสมผสาน Gamification เข้าด้วยกัน เปลี่ยนจากการตามหา Flag ให้กลายเป็นการออกล่าและสะสมปลา แต่ละตัวแทนทักษะที่แตกต่างกัน เมื่อพิชิตโจทย์ได้ คุณจะได้ปลาเพิ่มขึ้น พร้อมพัฒนาทักษะของตัวเองไปทีละขั้น จนพร้อมออกไปเผชิญกับความท้าทายที่ใหญ่กว่าในโลก Cybersecurity
					</p>
				</div>
			</div>
			<ProblemFeatures/>
		</article>
		
		</>
	)
}