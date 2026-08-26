import { useState } from "react";
import {
  AlertCircle,
  Brain,
  Check,
  Zap,
  Loader2,
} from "lucide-react";

import type { AbnormalSpendingItem } from "../AbnormalSpendingPage";
import CategoryEditModal from "../../Consumption/components/CategoryEditModal";

import api from "../../../api/api";

type AbnormalSpendingCardProps = {
  item: AbnormalSpendingItem;
};

// ============================================================
// 카테고리 ID
// 실제 DB의 category.id와 반드시 동일해야 함
// ============================================================

const CATEGORY_IDS: Record<string, number> = {
  식비: 1,
  "쇼핑/생활": 2,
  교통: 3,
  "주거/통신": 4,
  "여가/문화": 5,
  "의료/건강": 6,
  교육: 7,
  여행: 8,
  금융: 9,
  "선물/경조사": 10,
  반려동물: 11,
  기타: 12,
};

export default function AbnormalSpendingCard({
  item,
}: AbnormalSpendingCardProps) {
  // ============================================================
  // 카테고리 수정 모달
  // ============================================================

  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(item.category);

  const [currentCategory, setCurrentCategory] =
    useState(item.category);

  const [isSaving, setIsSaving] =
    useState(false);

  // ============================================================
  // 이상 지출 확인 완료 처리 중
  // ============================================================

  const [isConfirming, setIsConfirming] =
    useState(false);

  // ============================================================
  // 카테고리 수정
  // ============================================================

  const handleCategorySave = async () => {
    const categoryId =
      CATEGORY_IDS[selectedCategory];

    if (!categoryId) {
      alert("올바른 카테고리를 선택해주세요.");
      return;
    }

    try {
      setIsSaving(true);

      await api.patch(
        `/api/consumption/${item.transactionId}/category/${categoryId}`
      );

      // 화면의 카테고리 변경
      setCurrentCategory(selectedCategory);

      // 모달 닫기
      setIsCategoryModalOpen(false);

    } catch (error) {
      console.error(
        "카테고리 수정 실패:",
        error
      );

      alert(
        "카테고리 수정에 실패했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // 이상 지출 확인 완료
  // PATCH /api/consumption/{transactionId}
  // ============================================================

  const handleConfirmAbnormal = async () => {
    try {
      setIsConfirming(true);

      await api.patch(
        `/api/consumption/${item.transactionId}`
      );

      alert("이상 지출 확인이 완료되었습니다.");

    } catch (error) {
      console.error(
        "이상 지출 확인 처리 실패:",
        error
      );

      alert(
        "이상 지출 확인 처리에 실패했습니다."
      );
    } finally {
      setIsConfirming(false);
    }
  };

  // ============================================================
  // 모달 열기
  // ============================================================

  const handleOpenCategoryModal = () => {
    setSelectedCategory(currentCategory);
    setIsCategoryModalOpen(true);
  };

  // ============================================================
  // 거래 데이터
  // CategoryEditModal에서 요구하는 형태
  // ============================================================

  const transactionForModal = {
    transactionId: item.transactionId,
    merchant: item.merchant,
    amount: item.amount,
    date: item.date,

    categoryId:
      CATEGORY_IDS[currentCategory] ?? null,

    categoryName: currentCategory,

    classificationType: "UNCLASSIFIED" as const,

    isAbnormal: true,
  };

  return (
    <>
      {/* ======================================================
          이상 지출 카드
      ====================================================== */}

      <div className="rounded-2xl border border-red-100 bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">

        <div className="flex items-center justify-between">

          {/* Left */}
          <div className="flex min-w-0 items-start gap-5">

            {/* Icon */}
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-xl
                bg-red-50
                text-red-500
              "
            >
              <AlertCircle size={22} />
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
                  className="
                    inline-flex items-center
                    rounded-full
                    bg-gray-100
                    px-3 py-1
                    text-[13px]
                    font-medium
                    text-gray-600
                  "
                >
                  {currentCategory}
                </span>

                {/* Detection type */}
                <span
                  className={`
                    inline-flex items-center
                    gap-1
                    rounded-full
                    px-3 py-1
                    text-[13px]
                    font-medium
                    ${item.type === "AI"
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
                {formatDate(item.date)}
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

              {/* 카테고리 수정 */}
              <button
                type="button"
                onClick={handleOpenCategoryModal}
                disabled={isSaving || isConfirming}
                className="
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-2
                  text-[14px]
                  font-medium
                  text-[#596579]
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                카테고리 수정
              </button>

              {/* 확인 완료 */}
              <button
                type="button"
                onClick={handleConfirmAbnormal}
                disabled={isConfirming || isSaving}
                className="
                  flex items-center
                  gap-1.5
                  rounded-xl
                  bg-[#f1f3f6]
                  px-4 py-2
                  text-[14px]
                  font-medium
                  text-[#596579]
                  transition
                  hover:bg-gray-200
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isConfirming ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={15} />
                )}

                {isConfirming
                  ? "처리 중..."
                  : "확인 완료"}
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ======================================================
          카테고리 수정 모달
      ====================================================== */}

      <CategoryEditModal
        isOpen={isCategoryModalOpen}
        transaction={transactionForModal}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onClose={() => {
          setSelectedCategory(currentCategory);
          setIsCategoryModalOpen(false);
        }}
        onSave={handleCategorySave}
      />

      {/* ======================================================
          카테고리 수정 중
      ====================================================== */}

      {isSaving && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-xl bg-[#172033] px-4 py-3 text-sm font-medium text-white shadow-lg">
          <Loader2
            size={16}
            className="animate-spin"
          />
          카테고리 수정 중...
        </div>
      )}

      {/* ======================================================
          이상 지출 확인 처리 중
      ====================================================== */}

      {isConfirming && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-xl bg-[#172033] px-4 py-3 text-sm font-medium text-white shadow-lg">
          <Loader2
            size={16}
            className="animate-spin"
          />
          이상 지출 확인 처리 중...
        </div>
      )}
    </>
  );
}

/**
 * 금액 포맷
 */
function formatAmount(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 날짜 포맷
 */
function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString(
    "ko-KR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}