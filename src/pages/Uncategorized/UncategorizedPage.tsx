import { useEffect, useState } from "react";
import {
  Zap,
  Brain,
  User,
  ChevronRight,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import ProcessStep from "./components/ProcessStep";
import AiSuggestionCard from "./components/AiSuggestionCard";
import ManualCard from "./components/ManualCard";

import api from "../../api/api";

import type {
  AiTransaction,
  ManualTransaction,
} from "./data/uncategorizedData";

type TabKey = "ai" | "manual";

export default function UncategorizedPage() {
  const [activeTab, setActiveTab] =
    useState<TabKey>("ai");

  const [aiTransactions, setAiTransactions] =
    useState<AiTransaction[]>([]);

  const [manualTransactions, setManualTransactions] =
    useState<ManualTransaction[]>([]);

  const [loading, setLoading] = useState(true);

  // 미분류 거래 조회
  useEffect(() => {
    const fetchUncategorized = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/api/uncategorized"
        );

        const data = response.data.result;

        console.log("미분류 거래:", data);

        // AI 추천이 있는 거래
        const aiData: AiTransaction[] =
          data.filter(
            (transaction: AiTransaction) =>
              transaction.candidateCategoryName !== null
          );

        // AI 추천이 없는 거래
        const manualData: ManualTransaction[] =
          data
            .filter(
              (transaction: AiTransaction) =>
                transaction.candidateCategoryName === null
            )
            .map((transaction: AiTransaction) => ({
              id: String(transaction.transactionId),
              title: transaction.merchant,
              date: transaction.date,
              amount: transaction.amount,
            }));

        setAiTransactions(aiData);
        setManualTransactions(manualData);

      } catch (error) {
        console.error(
          "미분류 거래 조회 실패:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUncategorized();
  }, []);

  // 전체 미분류 개수
  const total =
    aiTransactions.length +
    manualTransactions.length;

  return (
    <MainLayout activeMenu="미분류 관리">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* ==================================================
            Header
        ================================================== */}
        <header className="mb-7">
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
            미분류 관리
          </h1>

          <p className="mt-1 text-[15px] text-[#9AA5B5]">
            분류되지 않은 거래를 검토하고 카테고리를
            지정해 주세요.
          </p>
        </header>

        {/* ==================================================
            통계
        ================================================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* 전체 미분류 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">
              전체 미분류
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {total}
            </p>
          </div>

          {/* AI 추천 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">
              AI 추천
            </p>

            <p className="mt-2 text-2xl font-bold text-violet-600">
              {aiTransactions.length}
            </p>
          </div>

          {/* 직접 분류 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-400">
              직접 분류
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-500">
              {manualTransactions.length}
            </p>
          </div>

        </div>

        {/* ==================================================
            분류 프로세스
        ================================================== */}
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

            {/* 1단계 */}
            <ProcessStep
              icon={<Zap size={16} />}
              label="1단계: 규칙 분류"
              color="blue"
            />

            <ChevronRight
              size={16}
              className="text-gray-300"
            />

            {/* 2단계 */}
            <ProcessStep
              icon={<Brain size={16} />}
              label="2단계: AI 분류"
              color="violet"
            />

            <ChevronRight
              size={16}
              className="text-gray-300"
            />

            {/* 3단계 */}
            <ProcessStep
              icon={<User size={16} />}
              label="3단계: 직접 분류"
              color="amber"
            />

          </div>
        </div>

        {/* ==================================================
            탭
        ================================================== */}
        <div
          className="
            mt-6 inline-flex
            rounded-2xl bg-gray-100 p-1
          "
        >

          {/* AI 추천 탭 */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`
              rounded-xl px-5 py-2.5
              text-sm font-semibold
              transition-colors
              ${activeTab === "ai"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
              }
            `}
          >
            AI 추천 ({aiTransactions.length})
          </button>

          {/* 수동 분류 탭 */}
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`
              rounded-xl px-5 py-2.5
              text-sm font-semibold
              transition-colors
              ${activeTab === "manual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
              }
            `}
          >
            수동 분류 ({manualTransactions.length})
          </button>

        </div>

        {/* ==================================================
            목록
        ================================================== */}
        <div className="mt-6 space-y-4">

          {/* 로딩 */}
          {loading ? (

            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
              <p className="text-sm text-gray-400">
                미분류 거래를 불러오는 중...
              </p>
            </div>

          ) : activeTab === "ai" ? (

            /* ==================================================
               AI 추천 목록
            ================================================== */
            aiTransactions.length > 0 ? (

              aiTransactions.map((transaction) => (
                <AiSuggestionCard
                  key={transaction.transactionId}
                  transaction={transaction}

                  // AI 카테고리 승인 성공
                  // 해당 거래를 리스트에서 즉시 제거
                  onApproved={(transactionId) => {
                    setAiTransactions((prev) =>
                      prev.filter(
                        (item) =>
                          item.transactionId !==
                          transactionId
                      )
                    );
                  }}
                />
              ))

            ) : (

              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-sm text-gray-400">
                  AI 추천 거래가 없습니다.
                </p>
              </div>

            )

          ) : (

            /* ==================================================
               수동 분류 목록
            ================================================== */
            manualTransactions.length > 0 ? (

              manualTransactions.map((transaction) => (
                <ManualCard
                  key={transaction.id}
                  transaction={transaction}

                  // 수동 카테고리 승인 성공
                  // 해당 거래를 리스트에서 즉시 제거
                  onApproved={(transactionId) => {
                    setManualTransactions((prev) =>
                      prev.filter(
                        (item) =>
                          Number(item.id) !==
                          transactionId
                      )
                    );
                  }}
                />
              ))

            ) : (

              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-sm text-gray-400">
                  직접 분류할 거래가 없습니다.
                </p>
              </div>

            )

          )}

        </div>

      </div>
    </MainLayout>
  );
}