import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

interface RecentTransaction {
  transactionId: number;
  merchant: string;
  amount: number;
  date: string;
  categoryId: number | null;
  categoryName: string | null;
  classificationType: string;
  isAbnormal: boolean;
}

interface RecentTransactionsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    transactions: RecentTransaction[];
  };
}

export default function RecentTransactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response =
          await api.get<RecentTransactionsResponse>(
            "/api/home/recent-transactions"
          );

        console.log(
          "최근 거래내역 API 응답:",
          response.data
        );

        // 상위 3개만 표시
        setTransactions(
          response.data.result.transactions.slice(0, 3)
        );
      } catch (error: any) {
        console.error(
          "최근 거래내역 조회 실패:",
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
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  /**
   * 날짜 표시
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const target = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffTime =
      today.getTime() - target.getTime();

    const diffDays =
      Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );

    if (diffDays === 0) {
      return "오늘";
    }

    if (diffDays === 1) {
      return "어제";
    }

    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  /**
   * 금액 표시
   */
  const formatAmount = (amount: number) => {
    return `-₩${Math.abs(amount).toLocaleString()}`;
  };

  /**
   * 카테고리별 아이콘
   */
  const getCategoryIcon = (
    categoryName: string | null
  ) => {
    if (!categoryName) {
      return "💳";
    }

    if (
      categoryName.includes("식비") ||
      categoryName.includes("음식") ||
      categoryName.includes("카페")
    ) {
      return "☕";
    }

    if (
      categoryName.includes("쇼핑") ||
      categoryName.includes("의류")
    ) {
      return "🛍️";
    }

    if (
      categoryName.includes("교통") ||
      categoryName.includes("택시")
    ) {
      return "🚕";
    }

    if (categoryName.includes("여행")) {
      return "✈️";
    }

    if (categoryName.includes("건강")) {
      return "💊";
    }

    if (categoryName.includes("문화")) {
      return "🎬";
    }

    return "💳";
  };

  /**
   * 카테고리별 아이콘 배경
   */
  const getCategoryTone = (
    categoryName: string | null
  ) => {
    if (!categoryName) {
      return "gray";
    }

    if (
      categoryName.includes("식비") ||
      categoryName.includes("음식") ||
      categoryName.includes("카페")
    ) {
      return "orange";
    }

    if (
      categoryName.includes("쇼핑") ||
      categoryName.includes("의류")
    ) {
      return "purple";
    }

    if (
      categoryName.includes("교통") ||
      categoryName.includes("택시")
    ) {
      return "blue";
    }

    return "gray";
  };

  const transactionIconStyle: Record<
    string,
    string
  > = {
    orange:
      "bg-[#FFF3E8] text-[#FF8A00]",

    purple:
      "bg-[#F3EDFF] text-[#8555E8]",

    blue:
      "bg-[#EEF4FF] text-[#2F6BEB]",

    gray:
      "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#1F2937]">
          최근 거래내역
        </h2>

        <button
          onClick={() => navigate("/consumption")}
          className="
            flex items-center gap-1
            text-sm font-medium
            text-[#7B8798]
            transition-colors
            hover:text-[#2F6BEB]
          "
        >
          전체 보기
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 거래 목록 */}
      <div className="divide-y divide-[#EEF1F5]">

        {loading ? (
          <div className="py-8 text-center text-sm text-[#9AA5B5]">
            거래내역을 불러오는 중...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#9AA5B5]">
            최근 거래내역이 없습니다.
          </div>
        ) : (
          transactions.map((transaction) => {

            const tone =
              getCategoryTone(
                transaction.categoryName
              );

            const icon =
              getCategoryIcon(
                transaction.categoryName
              );

            return (
              <button
                key={transaction.transactionId}
                className="
                  flex w-full items-center gap-3.5
                  py-4 text-left
                  transition-colors
                  hover:bg-[#FAFBFC]
                "
              >

                {/* 아이콘 */}
                <div
                  className={`
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    ${transactionIconStyle[tone]}
                  `}
                >
                  {icon}
                </div>

                {/* 거래 정보 */}
                <div className="flex min-w-0 flex-1 flex-col">

                  <strong
                    className="
                      truncate
                      text-sm font-semibold
                      text-[#374151]
                    "
                  >
                    {transaction.merchant}
                  </strong>

                  <span
                    className="
                      mt-1
                      text-xs
                      text-[#9AA5B5]
                    "
                  >
                    {transaction.categoryName ??
                      "미분류"}
                    {" · "}
                    {formatDate(
                      transaction.date
                    )}
                  </span>

                </div>

                {/* 금액 */}
                <strong
                  className="
                    text-sm font-bold
                    text-[#1F2937]
                  "
                >
                  {formatAmount(
                    transaction.amount
                  )}
                </strong>

              </button>
            );
          })
        )}

      </div>
    </section>
  );
}