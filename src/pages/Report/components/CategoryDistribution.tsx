import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";

interface CategoryExpense {
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
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
    budgetComparisons: unknown[];
  };
}

// ============================================================
// 카테고리 색상
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  식비: "#3B82F6",
  "쇼핑/생활": "#8B5CF6",
  교통: "#10B981",
  "주거/통신": "#F59E0B",
  "여가/문화": "#EF4444",
  "의료/건강": "#EC4899",
  교육: "#6366F1",
  여행: "#14B8A6",
  금융: "#F97316",
  "선물/경조사": "#A855F7",
  반려동물: "#84CC16",
  기타: "#94A3B8",
};

// ============================================================
// 12개 카테고리 순서
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
  return `₩${Number(amount ?? 0).toLocaleString("ko-KR")}`;
};

// ============================================================
// Component
// ============================================================

export default function CategoryDistribution() {
  const [categories, setCategories] = useState<CategoryExpense[]>([]);

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
    const fetchCategoryExpenses = async () => {
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
          "카테고리별 지출:",
          response.data
        );

        setCategories(
          response.data.result?.categoryExpenses ?? []
        );
      } catch (error: any) {
        console.error(
          "카테고리별 지출 조회 실패:",
          error
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryExpenses();
  }, [year, month]);

  // ============================================================
  // 12개 카테고리 정규화
  // ============================================================

  const normalizedCategories = useMemo(() => {
    return CATEGORY_ORDER.map(
      (categoryName) => {
        const existing = categories.find(
          (category) =>
            category.categoryName === categoryName
        );

        return {
          categoryId:
            existing?.categoryId ?? 0,

          categoryName,

          amount:
            Number(existing?.amount) || 0,

          percentage:
            Number(existing?.percentage) || 0,

          color:
            CATEGORY_COLORS[categoryName] ??
            "#94A3B8",
        };
      }
    );
  }, [categories]);

  // ============================================================
  // Donut Gradient
  // ============================================================

  const gradient = useMemo(() => {
    let current = 0;

    return normalizedCategories
      .map((category) => {
        const start = current;

        const end =
          current + category.percentage;

        current = end;

        return `${category.color} ${start}% ${end}%`;
      })
      .join(", ");
  }, [normalizedCategories]);

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[380px] items-center justify-center">
        <p className="text-sm text-[#9AA5B5]">
          카테고리별 지출을 불러오는 중...
        </p>
      </div>
    );
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="flex flex-col items-center">

      {/* ======================================================
          Donut Chart
      ====================================================== */}

      <div
        className="
          relative
          flex
          h-[250px]
          w-[250px]
          items-center
          justify-center
        "
      >
        {/* 도넛 */}
        <div
          className="
            h-[250px]
            w-[250px]
            rounded-full
          "
          style={{
            background:
              `conic-gradient(${gradient})`,
          }}
        />

        {/* 가운데 구멍 */}
        <div
          className="
            absolute
            h-[150px]
            w-[150px]
            rounded-full
            bg-white
          "
        />
      </div>

      {/* ======================================================
          Category List
          3열 Grid
      ====================================================== */}

      <div
        className="
          mt-20
          grid
          w-full
          grid-cols-2
          gap-x-8
          gap-y-5
        "
      >
        {normalizedCategories.map(
          (category) => (
            <div
              key={category.categoryName}
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >
              {/* ==================================================
                  색상
              ================================================== */}

              <span
                className="
                  h-[10px]
                  w-[10px]
                  shrink-0
                  rounded-full
                "
                style={{
                  backgroundColor:
                    category.color,
                }}
              />

              {/* ==================================================
                  카테고리명
              ================================================== */}

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
                {category.categoryName}
              </span>

              {/* ==================================================
                  금액
              ================================================== */}

              <span
                className="
                  shrink-0
                  text-[14px]
                  font-medium
                  text-[#64748B]
                "
              >
                {formatAmount(
                  category.amount
                )}
              </span>

              {/* ==================================================
                  비율
              ================================================== */}

              <span
                className="
                  w-[46px]
                  shrink-0
                  text-right
                  text-[14px]
                  text-[#94A3B8]
                "
              >
                (
                {category.percentage.toFixed(1)}
                %)
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}