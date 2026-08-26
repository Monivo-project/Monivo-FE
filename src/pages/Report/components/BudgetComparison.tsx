import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";

// ============================================================
// API Response Interface
// ============================================================

interface CategoryExpense {
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
}

interface CategoryBudgetComparison {
  categoryId: number;
  categoryName: string;
  budget: number;
  actualAmount: number;
  usageRate: number;
  overBudget: boolean;
}

interface ReportResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    year: number;
    month: number;
    monthlyExpenses: unknown[];
    categoryExpenses: CategoryExpense[];
    budgetComparisons: CategoryBudgetComparison[];
  };
}

// ============================================================
// 화면에서 사용할 데이터
// ============================================================

interface BudgetItem {
  categoryId: number;
  categoryName: string;

  // 실제 소비
  amount: number;
  percentage: number;

  // 예산
  budget: number;

  // 예산 대비 실제 지출률
  usageRate: number;

  // 예산 초과 여부
  overBudget: boolean;

  // 카테고리 색상
  color: string;
}

// ============================================================
// 카테고리 색상
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  식비: "#3B82F6",
  "쇼핑/생활": "#8B5CF6",
  교통: "#10B981",
  "주거/통신": "#F59E0B",
  "여가/문화": "#EC4899",
  "의료/건강": "#EF4444",
  교육: "#6366F1",
  여행: "#14B8A6",
  금융: "#F97316",
  "선물/경조사": "#A855F7",
  반려동물: "#22C55E",
  기타: "#94A3B8",
};

// ============================================================
// 카테고리 순서
// ============================================================

const CATEGORY_ORDER = [
  "식비",
  "쇼핑/생활",
  "교통",
  "주거/통신",
  "여가/문화",
  "의료/건강",
  "교육",
  "여행",
  "금융",
  "선물/경조사",
  "반려동물",
  "기타",
];

// ============================================================
// 금액 포맷
// ============================================================

const formatAmount = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

// ============================================================
// 카테고리 색상
// ============================================================

const getCategoryColor = (categoryName: string) => {
  return CATEGORY_COLORS[categoryName] ?? "#94A3B8";
};

// ============================================================
// Component
// ============================================================

export default function BudgetComparison() {
  const [categoryExpenses, setCategoryExpenses] =
    useState<CategoryExpense[]>([]);

  const [budgetComparisons, setBudgetComparisons] =
    useState<CategoryBudgetComparison[]>([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // 현재 연 / 월
  // ============================================================

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // ============================================================
  // API 조회
  // ============================================================

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);

      try {
        const response = await api.get<ReportResponse>(
          "/api/report",
          {
            params: {
              year,
              month,
            },
          }
        );

        console.log(
          "소비 리포트 전체:",
          response.data
        );

        const result = response.data.result;

        // ======================================================
        // 카테고리별 실제 지출
        // ======================================================

        const expenses =
          result?.categoryExpenses ?? [];

        console.log(
          "카테고리별 실제 지출:",
          expenses
        );

        setCategoryExpenses(expenses);

        // ======================================================
        // 카테고리별 예산
        // ======================================================

        const budgets =
          result?.budgetComparisons ?? [];

        console.log(
          "카테고리별 예산:",
          budgets
        );

        setBudgetComparisons(budgets);
      } catch (error: any) {
        console.error(
          "소비 리포트 조회 실패:",
          error
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setCategoryExpenses([]);
        setBudgetComparisons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [year, month]);

  // ============================================================
  // 카테고리별 실제 지출 + 예산 합치기
  // ============================================================

  const normalizedBudgetData =
    useMemo<BudgetItem[]>(() => {
      return CATEGORY_ORDER.map(
        (categoryName) => {
          // ----------------------------------------------------
          // 실제 지출 찾기
          // ----------------------------------------------------

          const expense =
            categoryExpenses.find(
              (item) =>
                item.categoryName ===
                categoryName
            );

          // ----------------------------------------------------
          // 예산 찾기
          // ----------------------------------------------------

          const budgetData =
            budgetComparisons.find(
              (item) =>
                item.categoryName ===
                categoryName
            );

          // ----------------------------------------------------
          // 실제 지출 금액
          // ----------------------------------------------------

          const amount =
            Number(expense?.amount) || 0;

          // ----------------------------------------------------
          // 예산
          // ----------------------------------------------------

          const budget =
            Number(budgetData?.budget) || 0;

          // ----------------------------------------------------
          // ⭐ 예산 대비 실제 지출률 직접 계산
          //
          // 실제 지출 / 예산 * 100
          //
          // 예:
          // 110,700 / 300,000 * 100
          // = 36.9
          // ----------------------------------------------------

          const calculatedUsageRate =
            budget > 0
              ? (amount / budget) * 100
              : 0;

          // ----------------------------------------------------
          // 예산 초과 여부도 직접 계산
          // ----------------------------------------------------

          const calculatedOverBudget =
            budget > 0 &&
            amount > budget;

          return {
            categoryId:
              expense?.categoryId ??
              budgetData?.categoryId ??
              0,

            categoryName,

            // 실제 지출
            amount,

            // 전체 지출 중 비율
            percentage:
              Number(
                expense?.percentage
              ) || 0,

            // 예산
            budget,

            // ⭐ 계산한 사용률
            usageRate:
              calculatedUsageRate,

            // ⭐ 계산한 초과 여부
            overBudget:
              calculatedOverBudget,

            // 색상
            color:
              getCategoryColor(
                categoryName
              ),
          };
        }
      );
    }, [
      categoryExpenses,
      budgetComparisons,
    ]);

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="flex h-[360px] items-center justify-center">
        <p className="text-sm text-[#9AA5B5]">
          예산 데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="flex flex-col gap-[13px]">
      {normalizedBudgetData.map(
        (item) => {
          // ====================================================
          // 사용률
          // ====================================================

          const usageRate =
            Math.max(
              Number(item.usageRate) || 0,
              0
            );

          // ====================================================
          // ⭐ 게이지 너비
          //
          // 17.5 → 17.5%
          // 36.9 → 36.9%
          // 80 → 80%
          // 100 → 100%
          // 120 → 100%
          //
          // 예산을 초과하더라도 게이지 자체는 100%까지만
          // ====================================================

          const gaugePercentage =
            Math.min(
              usageRate,
              100
            );

          return (
            <div
              key={
                item.categoryName
              }
            >
              {/* ==================================================
                  카테고리 / 실제 지출
              ================================================== */}

              <div className="mb-[6px] flex items-center justify-between">
                {/* 카테고리명 */}

                <span
                  className="
                    min-w-0
                    flex-1
                    truncate
                    text-[14px]
                    font-medium
                    text-[#475569]
                  "
                >
                  {item.categoryName}
                </span>

                {/* 실제 지출 + 전체 지출 비율 */}

                <span
                  className={`
                    shrink-0
                    text-[14px]
                    ${item.overBudget
                      ? "font-semibold text-[#EF4444]"
                      : "text-[#64748B]"
                    }
                  `}
                >
                  {formatAmount(
                    item.amount
                  )}

                  <span className="ml-1 text-[#94A3B8]">
                    (
                    {item.percentage.toFixed(
                      1
                    )}
                    %)
                  </span>

                  {item.overBudget && (
                    <span className="ml-1 text-[#EF4444]">
                      ↑
                    </span>
                  )}
                </span>
              </div>

              {/* ==================================================
                  게이지 배경
              ================================================== */}

              <div
                className="
                  h-[7px]
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-[#EEF0F3]
                "
              >
                {/* ==================================================
                    ⭐ 실제 게이지
                ================================================== */}

                <div
                  className="
                    h-full
                    rounded-full
                    transition-[width]
                    duration-700
                    ease-out
                  "
                  style={{
                    width: `${gaugePercentage}%`,

                    backgroundColor:
                      item.overBudget
                        ? "#EF4444"
                        : item.color,
                  }}
                />
              </div>

              {/* ==================================================
                  예산 / 사용률
              ================================================== */}

              <div className="mt-1 flex items-center justify-between">
                {/* 예산 */}

                <span className="text-[11px] text-[#A5AEBB]">
                  예산{" "}
                  {formatAmount(
                    item.budget
                  )}
                </span>

                {/* 예산 사용률 */}

                <span
                  className={`
                    text-[11px]
                    ${item.overBudget
                      ? "font-medium text-[#EF4444]"
                      : "text-[#A5AEBB]"
                    }
                  `}
                >
                  {usageRate.toFixed(1)}
                  %
                </span>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}