export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] px-6 pb-6 pt-16 sm:px-10 sm:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 sm:flex-row sm:items-start">
        <div>
          <p className=" text-lg font-bold text-white">Get in touch</p>
          <a href=""><p className="mt-2  text-base text-white/60">Contact Us</p></a>
        </div>

        <div className="text-right">
          <h2 className=" text-3xl font-bold leading-tight text-white sm:text-4xl">
            Capture the Fishes
          </h2>
          <p className="mt-1  text-2xl text-white/50 sm:text-3xl">
            Explore the challenge!
          </p>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            เราคือแพลตฟอร์มฝึกอบรมด้านความปลอดภัยทางไซเบอร์ที่เน้นการลงมือปฏิบัติจริงและใช้รูปแบบเกม (Gamification) <br />	
ซึ่งคุณสามารถเข้าใช้งานผ่านเว็บเบราว์เซอร์ได้
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <p className="text-xs text-white/40">Copyright Capture The Fish 2026-Now</p>
      </div>
    </footer>
  );
}