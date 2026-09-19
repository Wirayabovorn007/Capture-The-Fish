import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen px-6 py-10">
        {/* Header */}
        <section className="mx-auto max-w-[1200px]">
          <h1 className="text-5xl font-bold text-[#b01414] md:text-6xl">
            Get in touch
          </h1>

          <p className="mt-1 text-3xl text-[#3b3333] md:text-4xl">
            Explore the challenge!
          </p>

          <p className="mt-3  text-[#444]">
            เปลี่ยนการฝึก Cybersecurity แบบเดิม ๆ ให้กลายเป็นการผจญภัย
            ออกล่า Flag สะสมปลา และปลดล็อกทักษะใหม่ไปพร้อมกัน
          </p>
        </section>

        {/* Contact Form */}
        <section className="mx-auto mt-7 max-w-[1200px] rounded-xl border border-gray-200 bg-white px-10 py-6 shadow-sm">
          <form className="flex flex-col">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 ml-4 text-[#b01414]"
              >
                อีเมลของคุณ
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                className="
                  w-full
                  rounded-md
                  border
                  border-[#b01414]
                  bg-white
                  px-4
                  py-2.5
                  text-black
                  outline-none
                  transition
                  duration-200
                  placeholder:text-gray-400
                  focus:border-[#d21515]
                  focus:ring-1
                  focus:ring-[#d21515]
                "
              />
            </div>

            {/* Message */}
            <div className="mt-5 flex flex-col">
              <label
                htmlFor="content"
                className="mb-1 ml-4 text-[#b01414]"
              >
                มีอะไรที่เราพอช่วยคุณได้บ้าง
              </label>

              <textarea
                name="content"
                id="content"
                rows={8}
                placeholder="เขียนข้อความที่นี่"
                className="
                  w-full
                  resize-none
                  rounded-md
                  border
                  border-[#b01414]
                  bg-white
                  px-4
                  py-2.5
                  text-black
                  outline-none
                  transition
                  duration-200
                  placeholder:text-gray-400
                  focus:border-[#d21515]
                  focus:ring-1
                  focus:ring-[#d21515]
                "
              />
            </div>

            {/* Submit */}
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="
                  bg-[#b01414]
                  px-7
                  py-2
                  text-white
                  transition
                  duration-200
                  hover:bg-[#8f1010]
                  active:scale-95
                "
              >
                ส่งข้อความ
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}