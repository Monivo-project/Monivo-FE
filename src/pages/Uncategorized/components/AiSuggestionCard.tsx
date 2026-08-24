import {
  Brain,
  Check,
  Sparkles,
} from "lucide-react";

import CategoryDropdown from "./CategoryDropdown";
import type { AiTransaction } from "../data/uncategorizedData";

type AiSuggestionCardProps = {
  transaction: AiTransaction;
};

export default function AiSuggestionCard({
  transaction,
}: AiSuggestionCardProps) {
  return (
    <div
      className="
        rounded-2xl border border-gray-100
        bg-white p-6 shadow-sm
      "
    >
      {/* 거래 정보 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-full
              bg-violet-50 text-violet-500
            "
          >
            <Brain size={20} />
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {transaction.title}
            </p>

            <p className="text-sm text-gray-400">
              {transaction.date}
            </p>
          </div>
        </div>

        <span
          className="
            font-mono text-lg
            font-bold text-gray-900
          "
        >
          ₩{transaction.amount.toLocaleString()}
        </span>
      </div>

      {/* AI 추천 */}
      <div
        className="
          mt-5 flex items-center gap-2
          rounded-xl bg-violet-50/70
          px-4 py-3
        "
      >
        <Sparkles
          size={16}
          className="text-violet-500"
        />

        <span className="text-sm text-violet-600">
          AI 추천 카테고리:{" "}
          <span className="font-bold">
            {transaction.aiCategory}
          </span>
        </span>
      </div>

      {/* 버튼 */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="
            inline-flex items-center gap-2
            rounded-xl bg-blue-600
            px-5 py-2.5
            text-sm font-semibold text-white
            hover:bg-blue-700
          "
        >
          <Check size={16} />

          {transaction.aiCategory}(으)로 승인
        </button>

        <CategoryDropdown
          transactionId={transaction.id}
        />
      </div>
    </div>
  );
}