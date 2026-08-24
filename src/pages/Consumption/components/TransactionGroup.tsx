import type {
  TransactionGroup as TransactionGroupType,
} from "../data/consumptionData";

import TransactionRow from "./TransactionRow";

type TransactionGroupProps = {
  group: TransactionGroupType;
};

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function TransactionGroup({
  group,
}: TransactionGroupProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-[#E9EDF3]
        bg-white
      "
    >
      {/* 날짜 */}
      <div
        className="
          flex items-center justify-between
          border-b border-[#EEF1F5]
          bg-[#FBFCFD]
          px-5 py-3.5
        "
      >
        <span className="text-sm font-bold text-[#697586]">
          {group.date}
        </span>

        <span className="text-sm font-semibold text-[#697586]">
          {formatWon(group.total)}
        </span>
      </div>

      {/* 거래 */}
      <div className="divide-y divide-[#EEF1F5]">
        {group.transactions.map((transaction) => (
          <TransactionRow
            key={transaction.title}
            transaction={transaction}
          />
        ))}
      </div>
    </section>
  );
}