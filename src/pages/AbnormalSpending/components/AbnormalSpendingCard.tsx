import {
  AlertCircle,
  Brain,
  Check,
  Zap,
} from "lucide-react";

import type { AbnormalSpendingItem } from "../data/abnormalSpendingData";
import { formatAmount } from "../data/abnormalSpendingData";

type AbnormalSpendingCardProps = {
  item: AbnormalSpendingItem;
};

export default function AbnormalSpendingCard({
  item,
}: AbnormalSpendingCardProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex min-w-0 items-start gap-5">

          {/* Icon */}
          <div
            className={`
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-xl
              ${item.iconBg}
              ${item.iconColor}
            `}
          >
            {item.icon}
          </div>

          {/* Information */}
          <div className="min-w-0">

            {/* Merchant + Category + Detection Type */}
            <div className="flex items-center gap-2">

              <h2 className="text-[19px] font-bold text-[#172033]">
                {item.merchant}
              </h2>

              {/* Category */}
              <span
                className={`
                  inline-flex items-center
                  rounded-full
                  px-3 py-1
                  text-[13px] font-medium
                  ${item.categoryBg}
                  ${item.categoryColor}
                `}
              >
                {item.category}
              </span>

              {/* Detection type */}
              <span
                className={`
                  inline-flex items-center gap-1
                  rounded-full
                  px-3 py-1
                  text-[13px] font-medium
                  ${
                    item.type === "AI"
                      ? "bg-purple-50 text-purple-500"
                      : "bg-blue-50 text-blue-500"
                  }
                `}
              >
                {item.type === "AI" ? (
                  <Brain size={14} />
                ) : (
                  <Zap size={14} />
                )}

                {item.type === "AI"
                  ? "AI"
                  : "규칙"}
              </span>
            </div>

            {/* Date */}
            <p className="mt-1 text-[14px] text-[#a3adbd]">
              {item.date}
            </p>

            {/* Reason */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#fff2f2] px-3 py-2">
              <AlertCircle
                size={18}
                className="text-red-500"
              />

              <span className="text-[15px] font-medium text-red-500">
                {item.reason}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="ml-8 flex shrink-0 flex-col items-end">

          {/* Amount */}
          <p className="font-mono text-[24px] font-bold tracking-tight text-[#172033]">
            {formatAmount(item.amount)}
          </p>

          {/* Buttons */}
          <div className="mt-3 flex items-center gap-2">

            <button
              type="button"
              className="
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-2
                text-[14px] font-medium
                text-[#596579]
                transition
                hover:bg-gray-50
              "
            >
              카테고리 수정
            </button>

            <button
              type="button"
              className="
                flex items-center gap-1.5
                rounded-xl
                bg-[#f1f3f6]
                px-4 py-2
                text-[14px] font-medium
                text-[#596579]
                transition
                hover:bg-gray-200
              "
            >
              <Check size={15} />
              확인 완료
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}