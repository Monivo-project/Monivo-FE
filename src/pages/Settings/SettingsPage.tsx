"use client";

import MainLayout from "../../components/layout/MainLayout";

import ProfileSection from "./components/ProfileSection";
import SubscriptionSection from "./components/SubscriptionSection";

export default function SettingsPage() {
  return (
    <MainLayout activeMenu="설정">
      <div className="w-full px-8 py-8 lg:px-12">
        <header className="mb-7">
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
            설정
          </h1>

          <p className="mt-1 text-[15px] text-[#9AA5B5]">
            앱 설정 및 예산을 관리하세요.
          </p>
        </header>

        <div className="mt-6 space-y-6">
          <ProfileSection />
          <SubscriptionSection />
        </div>
      </div>
    </MainLayout>
  );
}