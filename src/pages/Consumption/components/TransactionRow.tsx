import {
  BookOpen,
  Car,
  FileText,
  Home,
  ShoppingCart,
  Utensils,
  Zap,
} from "lucide-react";

import type {
  Transaction,
} from "../data/consumptionData";

type TransactionRowProps = {
  transaction: Transaction;
};

function getIcon(icon: string, size: number) {
  switch (icon) {
    case "utensils":
      return <Utensils size={size} />;

    case "car":
      return <Car size={size} />;

    case "shopping-cart":
      return <ShoppingCart size={size} />;

    case "file-text":
      return <FileText size={size} />;

    case "book-open":
      return <BookOpen size={size} />;

    case "home":
      return <Home size={size} />;

    default:
      return null;
  }
}

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function TransactionRow({
  transaction,
}: TransactionRowProps) {
  return (
    <button
      className="
        flex w-full items-center
        gap-4 px-5 py-4
        text-left
        transition-colors
        hover:bg-[#FAFBFD]
      "
    >
      {/* 아이콘 */}
      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl
        "
        style={{
          backgroundColor: transaction.iconBg,
          color: transaction.iconColor,
        }}
      >
        {getIcon(transaction.icon, 21)}
      </div>

      {/* 거래 정보 */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-[#273244]">
          {transaction.title}
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          {/* 카테고리 */}
          <span
            className="
              inline-flex items-center gap-1
              rounded-full px-2 py-0.5
              text-xs font-medium
            "
            style={{
              color: transaction.categoryColor,
              backgroundColor: `${transaction.categoryColor}12`,
            }}
          >
            {getIcon(transaction.categoryIcon, 16)}
            {transaction.category}
          </span>

          {/* 규칙 */}
          {transaction.isRule && (
            <span
              className="
                inline-flex items-center gap-1
                rounded-full
                bg-[#EEF4FF]
                px-2 py-0.5
                text-xs font-medium
                text-[#2F6BEB]
              "
            >
              <Zap size={13} />
              규칙
            </span>
          )}
        </div>
      </div>

      {/* 금액 */}
      <strong className="shrink-0 text-[15px] font-bold text-[#202938]">
        {formatWon(transaction.amount)}
      </strong>
    </button>
  );
}