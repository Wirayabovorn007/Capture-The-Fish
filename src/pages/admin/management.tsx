import { useState } from "react"
import Navbar from "../../components/admin/Navbar"
import Reveal from "../../components/effects/Reveal"
import UserManagement from "./UserManagement"
import ChallengeManagement from "./ChallengeManagement"

type ManagementTab = "users" | "challenges"

export default function Management() {
  const [activeTab, setActiveTab] =
    useState<ManagementTab>("users")

  return (
    <>
      <Navbar />

      <Reveal>
        <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">

            {/* =================================
                Page Header
            ================================= */}

            <div className="mb-8">
              <p className="font-medium uppercase tracking-[0.2em] text-[#b01414]">
                ระบบผู้ดูแล
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#403a38] sm:text-5xl">
                จัดการระบบ
              </h1>

              <p className="mt-3 text-[#77716e]">
                จัดการผู้ใช้งานและ Challenge ภายในแพลตฟอร์ม
              </p>
            </div>

            {/* =================================
                Management Tabs
            ================================= */}

            <div className="mb-8 flex flex-wrap gap-2 border-b border-[#ddd8d5]">

              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === "users"
                    ? "border-b-2 border-[#b01414] text-[#b01414]"
                    : "text-[#77716e] hover:text-[#403a38]"
                }`}
              >
                จัดการผู้ใช้งาน
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("challenges")}
                className={`px-5 py-3 font-medium transition-colors ${
                  activeTab === "challenges"
                    ? "border-b-2 border-[#b01414] text-[#b01414]"
                    : "text-[#77716e] hover:text-[#403a38]"
                }`}
              >
                จัดการ Challenge
              </button>

            </div>

            {/* =================================
                User Management
            ================================= */}

            {activeTab === "users" && (
              <UserManagement />
            )}

            {/* =================================
                Challenge Management
            ================================= */}

            {activeTab === "challenges" && (
              <ChallengeManagement />
            )}

          </div>
        </main>
      </Reveal>
    </>
  )
}