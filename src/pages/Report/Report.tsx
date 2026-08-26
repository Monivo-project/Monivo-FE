import { Download } from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import MonthlyExpenseChart from "./components/MonthlyExpenseChart";
import CategoryDistribution from "./components/CategoryDistribution";
import ExpectedBudget from "./components/ExpectedBudget";

export default function ReportPage() {
  return (
    <MainLayout activeMenu="소비 리포트">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* =====================================================
            Header
        ===================================================== */}

        <header className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
              소비 리포트
            </h1>

            <p className="mt-1 text-[15px] text-[#9AA5B5]">
              2026년 8월 상세 분석
            </p>
          </div>

          <button
            type="button"
            className="flex h-[46px] items-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-5 text-[14px] font-medium text-[#475569] transition hover:bg-[#F8FAFC]"
          >
            <Download
              size={18}
              strokeWidth={1.8}
            />

            리포트 다운로드
          </button>
        </header>

        {/* =====================================================
            Monthly Expense
        ===================================================== */}

        <section className="mb-6 rounded-[18px] border border-[#EEF0F3] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
          <h2 className="mb-3 text-[16px] font-bold text-[#334155]">
            월별 지출 추이 (최근 6개월)
          </h2>

          <MonthlyExpenseChart />
        </section>

        {/* =====================================================
            Bottom Grid
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* ===================================================
              Category Distribution
          =================================================== */}

          <section className="min-h-[430px] rounded-[18px] border border-[#EEF0F3] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
            <h2 className="mb-7 text-[16px] font-bold text-[#334155]">
              카테고리별 분포
            </h2>

            <CategoryDistribution />
          </section>

          {/* ===================================================
              Expected Budget
          =================================================== */}

          <section className="min-h-[430px] rounded-[18px] border border-[#EEF0F3] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(15,23,42,0.02)]">
            <h2 className="mb-7 text-[16px] font-bold text-[#334155]">
              AI 예상 지출 및 예산
            </h2>

            <ExpectedBudget />
          </section>

        </div>
      </div>
    </MainLayout>
  );
}