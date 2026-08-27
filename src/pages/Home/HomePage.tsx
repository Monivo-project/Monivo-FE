import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

import {
  CircleDollarSign,
  FileQuestion,
  Wallet,
  XCircle,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import SummaryCard from "./components/SummaryCard";
import BudgetProgress from "./components/BudgetProgress";
import WeeklySpending from "./components/WeeklySpending";
import CategorySpending from "./components/CategorySpending";
import RecentTransactions from "./components/RecentTransactions";

/**
 * =========================
 * Home Summary
 * =========================
 */
export interface HomeSummary {
  year: number;
  month: number;

  totalExpense: number;
  budget: number;
  remainingBudget: number;
  budgetUsageRate: number;

  abnormalCount: number;
  uncategorizedCount: number;

  changeFromLastMonth: number;
}

/**
 * =========================
 * Expected Budget
 * =========================
 */
export interface ExpectedBudget {
  targetYear: number;
  targetMonth: number;

  expectedAmount: number;
  recommendedBudget: number;

  currentAmount: number;
  remainingExpectedAmount: number;

  reason: string;
  confidence: number;

  analyzedMonths: number;
}

export default function HomePage() {
  const navigate = useNavigate();

  /**
   * =========================
   * 현재 연 / 월
   * =========================
   */
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  /**
   * =========================
   * State
   * =========================
   */

  const [summary, setSummary] =
    useState<HomeSummary | null>(null);

  const [expectedBudget, setExpectedBudget] =
    useState<ExpectedBudget | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * =========================
   * Home API
   * =========================
   */
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);

      try {
        /**
         * =========================
         * 1. 홈 상단 요약
         * =========================
         */
        const summaryResponse =
          await api.get<{
            isSuccess: boolean;
            code: string;
            message: string;
            result: HomeSummary;
          }>(
            "/api/home",
            {
              params: {
                year,
                month,
              },
            }
          );

        console.log(
          "홈 요약 API 응답:",
          summaryResponse.data
        );

        setSummary(
          summaryResponse.data.result
        );

        /**
         * =========================
         * 2. AI 예상 지출
         * =========================
         */
        const expectedBudgetResponse =
          await api.get<{
            isSuccess: boolean;
            code: string;
            message: string;
            result: ExpectedBudget;
          }>(
            "/api/home/expected-budget",
            {
              params: {
                year,
                month,
              },
            }
          );

        console.log(
          "예상 지출 API 응답:",
          expectedBudgetResponse.data
        );

        setExpectedBudget(
          expectedBudgetResponse.data.result
        );

      } catch (error: any) {
        console.error(
          "홈 데이터 조회 실패:",
          error
        );

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [year, month]);

  return (
    <MainLayout activeMenu="홈">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* =========================
            Header
        ========================= */}
        <header className="mb-7 flex items-center justify-between">

          <div>
            <h1
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-[#172033]
              "
            >
              홈
            </h1>

            <p
              className="
                mt-1
                text-[15px]
                text-[#9AA5B5]
              "
            >
              {summary
                ? `${summary.year}년 ${summary.month}월 소비 현황`
                : "소비 현황"}
            </p>
          </div>


        </header>


        {/* =========================
            Summary Cards
        ========================= */}
        <section
          className="
            mb-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* 이번 달 지출 */}
          <SummaryCard
            icon={<Wallet size={22} />}
            label="이번 달 지출"
            value={
              summary
                ? `₩${summary.totalExpense.toLocaleString()}`
                : loading
                  ? "조회 중..."
                  : "조회 실패"
            }
            subText={
              summary ? (
                summary.changeFromLastMonth > 0 ? (
                  <span className="text-[#F04444]">
                    지난 달보다 ₩
                    {summary.changeFromLastMonth.toLocaleString()}
                    {" "}증가
                  </span>
                ) : summary.changeFromLastMonth < 0 ? (
                  <span className="text-[#2F6BEB]">
                    지난 달보다 ₩
                    {Math.abs(
                      summary.changeFromLastMonth
                    ).toLocaleString()}
                    {" "}감소
                  </span>
                ) : (
                  <span className="text-[#9AA5B5]">
                    지난 달과 동일
                  </span>
                )
              ) : loading ? (
                "데이터를 불러오는 중..."
              ) : (
                "데이터를 불러오지 못했습니다."
              )
            }
            tone="blue"
          />


          {/* 예상 지출 */}
          <SummaryCard
            icon={
              <CircleDollarSign size={22} />
            }
            label="예상 지출"
            value={
              expectedBudget
                ? `₩${expectedBudget.expectedAmount.toLocaleString()}`
                : loading
                  ? "조회 중..."
                  : "₩0"
            }
            subText={
              expectedBudget && summary ? (
                <>
                  현재 지출 ₩
                  {summary.totalExpense.toLocaleString()}
                </>
              ) : loading ? (
                "데이터를 불러오는 중..."
              ) : (
                "예상 지출 데이터를 불러오지 못했습니다."
              )
            }
            tone="green"
          />


          {/* 이상 지출 */}
          <SummaryCard
            icon={
              <XCircle size={22} />
            }
            label="이상 지출"
            value={
              summary
                ? `${summary.abnormalCount}건`
                : "0건"
            }
            subText="클릭하여 확인"
            tone="red"
            onClick={() =>
              navigate("/abnormal")
            }
          />


          {/* 미분류 */}
          <SummaryCard
            icon={
              <FileQuestion size={22} />
            }
            label="미분류 항목"
            value={
              summary
                ? `${summary.uncategorizedCount}건`
                : "0건"
            }
            subText="분류 필요"
            tone="yellow"
            onClick={() =>
              navigate("/unclassified")
            }
          />

        </section>


        {/* =========================
            Budget
        ========================= */}
        <div className="mb-6">
          <BudgetProgress
            currentAmount={
              summary?.totalExpense ?? 0
            }
            expectedAmount={
              expectedBudget?.expectedAmount ?? 0
            }
          />
        </div>


        {/* =========================
            Charts
        ========================= */}
        <section
          className="
            mb-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[1.5fr_1fr]
          "
        >

          <WeeklySpending />

          {/* API 연동된 카테고리별 지출 */}
          <CategorySpending
            year={year}
            month={month}
          />

        </section>


        {/* =========================
            Recent Transactions
        ========================= */}
        <RecentTransactions />

      </div>
    </MainLayout>
  );
}