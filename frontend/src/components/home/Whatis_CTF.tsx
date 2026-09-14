import ProblemFeatures from "./Whatis_2"


export default function Whatis()
{
	return (
		<>
		<article>
			<div className="flex gap-10 items-center">
				<h1 className="text-[300px] text-[#B01414]/30">01</h1>
				<div>
					<div className="my-6">
					<h1 className="text-5xl font-bold my-3 text-right">
						<span className="text-[#B01414]">Capture the Fish</span> คืออะไร?
					</h1>
					<div className="flex justify-end">
						<span className="inline-flex items-center gap-2">
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
						<span className="inline-flex items-center gap-2 mx-6">
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
					<p>
						Capture the Fish คือแพลตฟอร์มฝึกทักษะ Cybersecurity ในรูปแบบ CTF ที่ผสมผสาน Gamification เข้าด้วยกัน เปลี่ยนจากการตามหา Flag ให้กลายเป็นการออกล่าและสะสมปลา แต่ละตัวแทนทักษะที่แตกต่างกัน เมื่อพิชิตโจทย์ได้ คุณจะได้ปลาเพิ่มขึ้น พร้อมพัฒนาทักษะของตัวเองไปทีละขั้น จนพร้อมออกไปเผชิญกับความท้าทายที่ใหญ่กว่าในโลก Cybersecurity
					</p>
				</div>
			</div>
			<ProblemFeatures/>
		</article>
		
		</>
	)
}