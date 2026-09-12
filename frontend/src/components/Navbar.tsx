import logo from "../assets/Logo.png"

export default function Navbar(){
    return (
        <>
            <div>

                <img src={logo} alt="Brand Logo" />


                <div>
                    <a href="">แข่งขัน</a>
                    <a href="">เนื้อเรื่อง</a>
                    <a href="">ตารางคะแนน</a>
                    <a href="">ติดต่อเรา</a>
                </div>

                <button>เข้าสู่ระบบ</button>

            </div>
        
        </>
    )
}