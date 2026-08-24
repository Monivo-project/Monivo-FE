import { User } from "lucide-react";

import CategoryDropdown from "./CategoryDropdown";
import type { ManualTransaction } from "../data/uncategorizedData";

type ManualCardProps = {
  transaction: ManualTransaction;
};

export default function ManualCard({
  transaction,
}: ManualCardProps) {
  return (
    <div
      className="
        rounded-2xl border border-gray-100
        bg-white p-6 shadow-sm
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-full
              bg-amber-50 text-amber-500
            "
          >
            <User size={20} />
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

      <div className="mt-5">
        <CategoryDropdown
          transactionId={transaction.id}
        />
      </div>
    </div>
  );
}