import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import MonthlyExpenseChart from "./components/MonthlyExpenseChart";
import CategoryDistribution from "./components/CategoryDistribution";
import ExpectedBudget from "./components/ExpectedBudget";

import api from "../../api/api";

/* ============================================================
   Summary API Response
============================================================ */

interface SummaryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    totalExpense: number;
  };
}

/* ============================================================
   Report Page
============================================================ */

export default function ReportPage() {
  /* ==========================================================
     Summary
  ========================================================== */

  const [totalExpense, setTotalExpense] =
    useState(0);

  const [summaryLoading, setSummaryLoading] =
    useState(true);

  /* ==========================================================
     현재 연 / 월
  ========================================================== */

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  /* ==========================================================
     Summary 조회
  ========================================================== */

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);

        /*
         * Home에서 사용하는 summary API와
         * 동일한 API를 사용해야 함.
         *
         * 아래 URL은 예시이므로
         * Home에서 실제 사용하는 summary API가
         * 다르다면 그 URL로 변경.
         */

        const response =
          await api.get<SummaryResponse>(
            "/api/home/summary",
            {
              params: {
                year,
                month,
              },
            }
          );

        console.log(
          "소비 Summary:",
          response.data
        );

        setTotalExpense(
          Number(
            response.data.result?.totalExpense ?? 0
          )
        );
      } catch (error: any) {
        console.error(
          "소비 Summary 조회 실패:",
          error
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setTotalExpense(0);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [year, month]);

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <MainLayout activeMenu="소비 리포트">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* =====================================================
            Header
        ===================================================== */}

        <header className="mb-7 flex items-start justify-between">

          <div>

            <h1
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-[#172033]
              "
            >
              소비 리포트
            </h1>

            <p
              className="
                mt-1
                text-[15px]
                text-[#9AA5B5]
              "
            >
              {year}년 {month}월 상세 분석
            </p>

          </div>

        </header>

        {/* =====================================================
            Monthly Expense
        ===================================================== */}

        <section
          className="
            mb-6
            rounded-[18px]
            border
            border-[#EEF0F3]
            bg-white
            px-6
            py-6
            shadow-[0_1px_3px_rgba(15,23,42,0.02)]
          "
        >

          <h2
            className="
              mb-3
              text-[16px]
              font-bold
              text-[#334155]
            "
          >
            월별 지출 추이 (최근 6개월)
          </h2>

          <MonthlyExpenseChart />

        </section>

        {/* =====================================================
            Bottom Grid
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-2
          "
        >

          {/* ===================================================
              Category Distribution
          =================================================== */}

          <section
            className="
              min-h-[430px]
              rounded-[18px]
              border
              border-[#EEF0F3]
              bg-white
              px-6
              py-6
              shadow-[0_1px_3px_rgba(15,23,42,0.02)]
            "
          >

            <h2
              className="
                mb-7
                text-[16px]
                font-bold
                text-[#334155]
              "
            >
              카테고리별 분포
            </h2>

            <CategoryDistribution />

          </section>

          {/* ===================================================
              Expected Budget
          =================================================== */}

          <section
            className="
              min-h-[430px]
              rounded-[18px]
              border
              border-[#EEF0F3]
              bg-white
              px-6
              py-6
              shadow-[0_1px_3px_rgba(15,23,42,0.02)]
            "
          >

            <h2
              className="
                mb-7
                text-[16px]
                font-bold
                text-[#334155]
              "
            >
              AI 예상 지출 및 예산
            </h2>

            {summaryLoading ? (
              <div
                className="
                  flex
                  min-h-[360px]
                  items-center
                  justify-center
                "
              >
                <p
                  className="
                    text-sm
                    text-[#9AA5B5]
                  "
                >
                  소비 데이터를 불러오는 중...
                </p>
              </div>
            ) : (
              <ExpectedBudget
                totalExpense={totalExpense}
              />
            )}

          </section>

        </div>
      </div>
    </MainLayout>
  );
}