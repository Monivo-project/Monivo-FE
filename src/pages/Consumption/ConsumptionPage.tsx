import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import {
  transactionGroups,
} from "./data/consumptionData";

import ConsumptionSummaryCard from "./components/ConsumptionSummaryCard";
import CategorySpending from "./components/CategorySpending";
import FilterButton from "./components/FilterButton";
import TransactionGroup from "./components/TransactionGroup";

export default function ConsumptionPage() {
  const [search, setSearch] = useState("");

  const filteredGroups = transactionGroups
    .map((group) => ({
      ...group,
      transactions: group.transactions.filter((transaction) =>
        transaction.title
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.transactions.length > 0);

  return (
    <MainLayout activeMenu="소비 내역">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* Header */}
        <header className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
              소비 내역
            </h1>

            <p className="mt-1 text-[15px] text-[#9AA5B5]">
              월별 거래 내역
            </p>
          </div>

          <button
            className="
              flex h-11 items-center gap-2
              rounded-xl
              bg-[#2161F5]
              px-5
              text-sm font-semibold text-white
              shadow-[0_3px_10px_rgba(33,97,245,0.18)]
              transition-colors
              hover:bg-[#1553DE]
            "
          >
            <Plus size={19} />
            거래 추가
          </button>
        </header>

        {/* Month Selector */}
        <section
          className="
            mb-6 flex h-[104px]
            items-center justify-between
            rounded-2xl
            border border-[#E9EDF3]
            bg-white
            px-5
          "
        >
          <button
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[#EEF1F5]
              text-[#CBD1DA]
              transition-colors
              hover:bg-[#F8FAFC]
            "
          >
            <ChevronLeft size={21} />
          </button>

          <div className="text-center">
            <h2 className="text-[24px] font-bold text-[#182133]">
              2026년 8월
            </h2>

            <p className="mt-1 text-sm text-[#A1AAB8]">
              30건의 거래
            </p>
          </div>

          <button
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[#EEF1F5]
              text-[#CBD1DA]
              transition-colors
              hover:bg-[#F8FAFC]
            "
          >
            <ChevronRight size={21} />
          </button>
        </section>

        {/* Summary Cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ConsumptionSummaryCard
            label="이 달 총 지출"
            value="₩3,505,500"
          />

          <ConsumptionSummaryCard
            label="거래 건수"
            value="30건"
          />

          <ConsumptionSummaryCard
            label="이상 지출"
            value="3건"
            tone="red"
          />

          <ConsumptionSummaryCard
            label="미분류"
            value="3건"
            tone="yellow"
          />
        </section>

        {/* Category Spending */}
        <div className="mb-6">
          <CategorySpending />
        </div>

        {/* Search / Filter */}
        <section
          className="
            mb-6 flex flex-col gap-3
            rounded-2xl
            border border-[#E9EDF3]
            bg-white
            p-4
            lg:flex-row
          "
        >
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={20}
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#A5AFBE]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="가맹점 검색..."
              className="
                h-11 w-full
                rounded-xl
                border border-[#E5EAF0]
                bg-white
                pl-11 pr-4
                text-sm
                text-[#374151]
                outline-none
                placeholder:text-[#A5AFBE]
                focus:border-[#2F6BEB]
                focus:ring-2
                focus:ring-[#2F6BEB]/10
              "
            />
          </div>

          <FilterButton>
            전체 카테고리
          </FilterButton>

          <FilterButton>
            분류 방식 전체
          </FilterButton>
        </section>

        {/* Transactions */}
        <div className="flex flex-col gap-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <TransactionGroup
                key={group.date}
                group={group}
              />
            ))
          ) : (
            <div
              className="
                rounded-2xl
                border border-[#E9EDF3]
                bg-white
                py-16
                text-center
              "
            >
              <Search
                size={32}
                className="mx-auto text-[#CBD1DA]"
              />

              <p className="mt-3 text-sm text-[#9AA5B5]">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}