import Mask from "../../assets/Mask.png"

export default function First_arc(){
	return (
		<>
				<article  className="mt-36">
					<h1 className="text-7xl py-1 text-[#B01414] font-bold">Capture the Fishes</h1>
					<p className="text-4xl py-1">Explore the challenge!</p>
					<p className="py-1">เปลี่ยนการฝึก Cybersecurity แบบเดิม ๆ ให้กลายเป็นการผจญภัย ออกล่า Flag สะสมปลา และปลดล็อกทักษะใหม่ไปพร้อมกัน</p>
		
		
					<div className="mt-10 flex gap-4">
			<button
				className="
					group relative overflow-hidden
					font-bold text-white
					bg-[#B01414] border border-[#B01414]
					px-8 py-3
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
		
			<button
				className="
					group relative overflow-hidden
					font-bold text-[#3C3232]
					border border-[#3C3232]
					bg-transparent
					px-8 py-3
					transition-all duration-300
					hover:bg-[#3C3232]
					hover:text-white
					hover:-translate-y-1
					hover:shadow-[4px_4px_0px_#B01414]
					active:translate-y-0
					active:shadow-none
				"
			>
				<span className="relative z-10">
					ดูโจทย์ทั้งหมด
				</span>
				
			</button>
		</div>
					<div className="flex mt-60 text-sm">
						<img src={Mask} alt="" className="h-auto w-auto mx-1"/>
						<p>
							Developed by <a href="https://www.instagram.com/to.exphp/" target="_blank" className="underline">to.exphp</a>, 
							<a target="_blank" href="https://www.instagram.com/kenkungkab/" className="underline">kenkungkab</a>,  
							<a target="_blank" href="https://www.instagram.com/callme_luckr/" className="underline">callme_luckr</a>,  
							<a target="_blank" className="underline" href="https://www.instagram.com/wiraya.sh/">wiraya.sh</a>
						</p>
					</div>
				</article>
		
		</>
	)
}