import {
  CircleDollarSign,
  Download,
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

export default function HomePage() {
  return (
    <MainLayout activeMenu="홈">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* Header */}
        <header className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
              대시보드
            </h1>

            <p className="mt-1 text-[15px] text-[#9AA5B5]">
              2026년 8월 소비 현황
            </p>
          </div>

          <button
            className="
              flex items-center gap-2
              rounded-lg
              border border-[#E1E6ED]
              bg-white
              px-4 py-2.5
              text-sm font-medium text-[#4B5563]
              transition-colors
              hover:bg-[#F8FAFC]
            "
          >
            <Download size={19} />
            <span>내보내기</span>
          </button>
        </header>

        {/* Summary Cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<Wallet size={22} />}
            label="이번 달 지출"
            value="₩3,505,500"
            subText="예산 대비 100% 사용"
            tone="blue"
            active
          />

          <SummaryCard
            icon={<CircleDollarSign size={22} />}
            label="예산 잔여"
            value="₩0"
            subText="총 예산 ₩2,250,000"
            tone="green"
          />

          <SummaryCard
            icon={<XCircle size={22} />}
            label="이상 지출"
            value="3건"
            subText="클릭하여 확인"
            tone="red"
          />

          <SummaryCard
            icon={<FileQuestion size={22} />}
            label="미분류 항목"
            value="3건"
            subText="분류 필요"
            tone="yellow"
          />
        </section>

        {/* Budget */}
        <div className="mb-6">
          <BudgetProgress />
        </div>

        {/* Charts */}
        <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
          <WeeklySpending />
          <CategorySpending />
        </section>

        {/* Recent Transactions */}
        <RecentTransactions />

      </div>
    </MainLayout>
  );
}