import { useState } from "react";
import {
  Zap,
  Brain,
  User,
  ChevronRight,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import StatCard from "./components/StatCard";
import ProcessStep from "./components/ProcessStep";
import AiSuggestionCard from "./components/AiSuggestionCard";
import ManualCard from "./components/ManualCard";

import {
  AI_SUGGESTED,
  MANUAL_NEEDED,
} from "./data/uncategorizedData";

type TabKey = "ai" | "manual";

export default function UncategorizedPage() {
  const [activeTab, setActiveTab] =
    useState<TabKey>("ai");

  const total =
    AI_SUGGESTED.length +
    MANUAL_NEEDED.length;

  return (
    <MainLayout activeMenu="미분류 관리">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* Header */}
        <header className="mb-7">
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
            미분류 관리
          </h1>

          <p className="mt-1 text-[15px] text-[#9AA5B5]">
            분류되지 않은 거래를 검토하고 카테고리를
            지정해 주세요.
          </p>
        </header>

        {/* 통계 카드 */}
        <div className="mt-6 flex gap-4">
          <StatCard
            value={AI_SUGGESTED.length}
            label="AI 추천 대기"
            variant="purple"
          />

          <StatCard
            value={MANUAL_NEEDED.length}
            label="수동 분류 필요"
            variant="amber"
          />

          <StatCard
            value={total}
            label="총 미분류"
            variant="blue"
          />
        </div>

        {/* 분류 프로세스 */}
        <div
          className="
            mt-6 rounded-2xl
            border border-gray-100
            bg-white p-6
          "
        >
          <p
            className="
              mb-4 text-sm
              font-medium text-gray-400
            "
          >
            분류 프로세스
          </p>

          <div
            className="
              flex flex-wrap
              items-center gap-3
            "
          >
            <ProcessStep
              icon={<Zap size={16} />}
              label="1단계: 규칙 분류"
              color="blue"
            />

            <ChevronRight
              size={16}
              className="text-gray-300"
            />

            <ProcessStep
              icon={<Brain size={16} />}
              label="2단계: AI 분류"
              color="violet"
            />

            <ChevronRight
              size={16}
              className="text-gray-300"
            />

            <ProcessStep
              icon={<User size={16} />}
              label="3단계: 직접 분류"
              color="amber"
            />
          </div>
        </div>

        {/* 탭 */}
        <div
          className="
            mt-6 inline-flex
            rounded-2xl bg-gray-100 p-1
          "
        >
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`
              rounded-xl px-5 py-2.5
              text-sm font-semibold
              transition-colors
              ${
                activeTab === "ai"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }
            `}
          >
            AI 추천 ({AI_SUGGESTED.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`
              rounded-xl px-5 py-2.5
              text-sm font-semibold
              transition-colors
              ${
                activeTab === "manual"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500"
              }
            `}
          >
            수동 분류 ({MANUAL_NEEDED.length})
          </button>
        </div>

        {/* 목록 */}
        <div className="mt-6 space-y-4">
          {activeTab === "ai"
            ? AI_SUGGESTED.map((transaction) => (
                <AiSuggestionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            : MANUAL_NEEDED.map((transaction) => (
                <ManualCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
        </div>

      </div>
    </MainLayout>
  );
}