import { ChevronRight } from "lucide-react";

const recentTransactions = [
  {
    title: "스타벅스",
    meta: "식비 · 오늘",
    amount: "-₩5,500",
    tone: "orange",
    icon: "☕",
  },
  {
    title: "쿠팡",
    meta: "쇼핑 · 어제",
    amount: "-₩32,900",
    tone: "purple",
    icon: "🛍️",
  },
  {
    title: "카카오택시",
    meta: "교통 · 8월 22일",
    amount: "-₩12,800",
    tone: "blue",
    icon: "🚕",
  },
];

export default function RecentTransactions() {
  const transactionIconStyle: Record<string, string> = {
    orange: "bg-[#FFF3E8] text-[#FF8A00]",
    purple: "bg-[#F3EDFF] text-[#8555E8]",
    blue: "bg-[#EEF4FF] text-[#2F6BEB]",
  };

  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#1F2937]">
          최근 거래내역
        </h2>

        <button className="flex items-center gap-1 text-sm font-medium text-[#7B8798] transition-colors hover:text-[#2F6BEB]">
          전체 보기
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="divide-y divide-[#EEF1F5]">
        {recentTransactions.map((transaction) => (
          <button
            key={transaction.title}
            className="flex w-full items-center gap-3.5 py-4 text-left transition-colors hover:bg-[#FAFBFC]"
          >
            <div
              className={`
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                ${transactionIconStyle[transaction.tone]}
              `}
            >
              {transaction.icon}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <strong className="truncate text-sm font-semibold text-[#374151]">
                {transaction.title}
              </strong>

              <span className="mt-1 text-xs text-[#9AA5B5]">
                {transaction.meta}
              </span>
            </div>

            <strong className="text-sm font-bold text-[#1F2937]">
              {transaction.amount}
            </strong>
          </button>
        ))}
      </div>
    </section>
  );
}