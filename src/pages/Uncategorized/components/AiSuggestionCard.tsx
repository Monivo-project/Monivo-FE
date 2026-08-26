import { useState } from "react";
import {
  Brain,
  Check,
  Sparkles,
} from "lucide-react";

import CategoryDropdown from "./CategoryDropdown";
import type { AiTransaction } from "../data/uncategorizedData";

import api from "../../../api/api";

type AiSuggestionCardProps = {
  transaction: AiTransaction;
  onApproved?: (transactionId: number) => void;
};

export default function AiSuggestionCard({
  transaction,
  onApproved,
}: AiSuggestionCardProps) {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string | null>(null);

  const [approving, setApproving] =
    useState(false);

  // AI 추천 카테고리 승인
  const handleApprove = async () => {
    if (transaction.candidateCategoryId === null) {
      alert("추천 카테고리가 없습니다.");
      return;
    }

    try {
      setApproving(true);

      await api.patch(
        `/api/consumption/${transaction.transactionId}/category/${transaction.candidateCategoryId}`
      );

      onApproved?.(transaction.transactionId);
    } catch (error) {
      console.error(
        "카테고리 승인 실패:",
        error
      );

      alert("카테고리 분류에 실패했습니다.");
    } finally {
      setApproving(false);
    }
  };

  // 다른 카테고리 선택
  const handleCategorySelect = (
    categoryId: number,
    categoryName: string
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
  };

  // 선택한 카테고리 승인
  const handleSelectedCategoryApprove =
    async () => {
      if (selectedCategoryId === null) {
        return;
      }

      try {
        setApproving(true);

        await api.patch(
          `/api/consumption/${transaction.transactionId}/category/${selectedCategoryId}`
        );

        onApproved?.(transaction.transactionId);
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
              bg-violet-50 text-violet-500
            "
          >
            <Brain size={20} />
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {transaction.merchant}
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
          mt-5 flex items-center justify-between
          rounded-xl bg-violet-50/70
          px-4 py-3
        "
      >
        <div className="flex items-center gap-2">
          <Sparkles
            size={16}
            className="text-violet-500"
          />

          <span className="text-sm text-violet-600">
            AI 추천 카테고리:{" "}
            <span className="font-bold">
              {transaction.candidateCategoryName}
            </span>
          </span>
        </div>

        {/* 신뢰도 */}
        {transaction.confidence !== null &&
          transaction.confidence !== undefined && (
            <span className="text-xs font-medium text-violet-400">
              신뢰도{" "}
              {Math.round(
                transaction.confidence * 100
              )}
              %
            </span>
          )}
      </div>

      {/* 버튼 영역 */}
      <div className="mt-4 flex items-center justify-between">

        {/* 왼쪽 */}
        <div className="flex items-center gap-3">
          {/* AI 추천 승인 */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={
              transaction.candidateCategoryId === null ||
              approving
            }
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
              : `${transaction.candidateCategoryName}(으)로 승인`}
          </button>

          {/* 다른 카테고리 선택 */}
          <CategoryDropdown
            transactionId={transaction.transactionId}
            onCategorySelect={
              handleCategorySelect
            }
          />
        </div>

        {/* 오른쪽 - 선택한 카테고리 승인 */}
        {selectedCategoryId !== null &&
          selectedCategoryName !== null && (
            <button
              type="button"
              onClick={
                handleSelectedCategoryApprove
              }
              disabled={approving}
              className="
                inline-flex items-center gap-2
                rounded-xl bg-violet-600
                px-5 py-2.5
                text-sm font-semibold text-white
                hover:bg-violet-700
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