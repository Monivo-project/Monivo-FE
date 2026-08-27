import { useState } from "react";

import {
  AlertCircle,
  Brain,
  Check,
  Zap,
  Loader2,
} from "lucide-react";

import type {
  AbnormalSpendingItem,
} from "../AbnormalSpendingPage";

import api from "../../../api/api";

/* ============================================================
   Props
============================================================ */

type AbnormalSpendingCardProps = {
  item: AbnormalSpendingItem;

  // 확인 완료 후 부모에게 transactionId 전달
  onConfirm: (transactionId: number) => void;
};

/* ============================================================
   Card
============================================================ */

export default function AbnormalSpendingCard({
  item,
  onConfirm,
}: AbnormalSpendingCardProps) {
  /* ==========================================================
     Confirm
  ========================================================== */

  const [isConfirming, setIsConfirming] =
    useState(false);

  /* ==========================================================
     Confirm Abnormal

     PATCH /api/abnormal/{transactionId}
  ========================================================== */

  const handleConfirmAbnormal = async () => {
    try {
      setIsConfirming(true);

      /* ==============================================
         서버에 이상 지출 확인 완료 요청
      ============================================== */

      await api.patch(
        `/api/abnormal/${item.transactionId}`
      );

      /* ==============================================
         API 성공 후 팝업
      ============================================== */

      alert(
        "이상 지출 확인이 완료되었습니다."
      );

      /* ==============================================
         부모 Page에서 리스트 제거
      ============================================== */

      onConfirm(
        item.transactionId
      );
    } catch (error: any) {
      console.error(
        "이상 지출 확인 처리 실패:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ??
        "이상 지출 확인 처리에 실패했습니다."
      );
    } finally {
      setIsConfirming(false);
    }
  };

  /* ==========================================================
     Render
  ========================================================== */

  return (
    <>
      {/* ======================================================
          Card
      ====================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-red-100
          bg-white
          px-6
          py-6
          shadow-[0_1px_3px_rgba(0,0,0,0.02)]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          {/* ==================================================
              Left
          ================================================== */}

          <div
            className="
              flex
              min-w-0
              items-start
              gap-5
            "
          >
            {/* ==================================================
                Icon
            ================================================== */}

            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-500
              "
            >
              <AlertCircle size={22} />
            </div>

            {/* ==================================================
                Information
            ================================================== */}

            <div className="min-w-0">
              {/* ================================================
                  Merchant / Category / Type
              ================================================= */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {/* Merchant */}

                <h2
                  className="
                    text-[19px]
                    font-bold
                    text-[#172033]
                  "
                >
                  {item.merchant}
                </h2>

                {/* Category */}

                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-gray-100
                    px-3
                    py-1
                    text-[13px]
                    font-medium
                    text-gray-600
                  "
                >
                  {item.category}
                </span>

                {/* Detection Type */}

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    px-3
                    py-1
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

              {/* ================================================
                  Date
              ================================================= */}

              <p
                className="
                  mt-1
                  text-[14px]
                  text-[#a3adbd]
                "
              >
                {formatDate(item.date)}
              </p>

              {/* ================================================
                  Score
              ================================================= */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-[13px]
                    font-medium
                    text-gray-400
                  "
                >
                  이상 지출 점수
                </span>

                <span
                  className="
                    text-[14px]
                    font-bold
                    text-red-500
                  "
                >
                  {item.score}점
                </span>
              </div>

              {/* ================================================
                  Reason
              ================================================= */}

              <div
                className="
                  mt-3
                  inline-flex
                  max-w-full
                  items-start
                  gap-2
                  rounded-xl
                  bg-[#fff2f2]
                  px-3
                  py-2
                "
              >
                <AlertCircle
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-500
                  "
                />

                <span
                  className="
                    text-[15px]
                    font-medium
                    leading-6
                    text-red-500
                  "
                >
                  {item.reason}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              Right
          ================================================== */}

          <div
            className="
              ml-8
              flex
              shrink-0
              flex-col
              items-end
            "
          >
            {/* Amount */}

            <p
              className="
                font-mono
                text-[24px]
                font-bold
                tracking-tight
                text-[#172033]
              "
            >
              {formatAmount(item.amount)}
            </p>

            {/* Buttons */}

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
              "
            >
              {/* ================================================
                  Confirm
              ================================================= */}

              <button
                type="button"
                onClick={
                  handleConfirmAbnormal
                }
                disabled={
                  isConfirming
                }
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-[#f1f3f6]
                  px-4
                  py-2
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
          Confirming
      ====================================================== */}

      {isConfirming && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-[200]
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#172033]
            px-4
            py-3
            text-sm
            font-medium
            text-white
            shadow-lg
          "
        >
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

/* ============================================================
   금액 포맷
============================================================ */

function formatAmount(
  amount: number
) {
  return `${amount.toLocaleString(
    "ko-KR"
  )}원`;
}

/* ============================================================
   날짜 포맷
============================================================ */

function formatDate(
  date: string
) {
  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
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