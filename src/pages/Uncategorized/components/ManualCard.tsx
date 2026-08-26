import { useState } from "react";
import { User, Check } from "lucide-react";

import CategoryDropdown from "./CategoryDropdown";
import type { ManualTransaction } from "../data/uncategorizedData";

import api from "../../../api/api";

type ManualCardProps = {
  transaction: ManualTransaction;
  onApproved?: (transactionId: number) => void;
};

export default function ManualCard({
  transaction,
  onApproved,
}: ManualCardProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string | null>(null);

  const [approving, setApproving] =
    useState(false);

  // 카테고리 선택
  const handleCategorySelect = (
    categoryId: number,
    categoryName: string
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
  };

  // 선택한 카테고리 승인
  const handleApprove = async () => {
    if (selectedCategoryId === null) {
      return;
    }

    const transactionId = Number(transaction.id);

    try {
      setApproving(true);

      await api.patch(
        `/api/consumption/${transactionId}/category/${selectedCategoryId}`
      );

      // 부모에게 승인 완료 전달
      onApproved?.(transactionId);

    } catch (error) {
      console.error(
        "카테고리 변경 실패:",
        error
      );

      alert("카테고리 변경에 실패했습니다.");
    } finally {
      setApproving(false);
    }
  };

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

      {/* 카테고리 선택 + 승인 */}
      <div className="mt-5 flex items-center justify-between">

        {/* 카테고리 드롭다운 */}
        <CategoryDropdown
          transactionId={Number(transaction.id)}
          onCategorySelect={handleCategorySelect}
        />

        {/* 선택한 카테고리 승인 */}
        {selectedCategoryId !== null &&
          selectedCategoryName !== null && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving}
              className="
                inline-flex items-center gap-2
                rounded-xl bg-blue-600
                px-5 py-2.5
                text-sm font-semibold text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              <Check size={16} />

              {approving
                ? "처리 중..."
                : `${selectedCategoryName}(으)로 승인`}
            </button>
          )}
      </div>
    </div>
  );
}