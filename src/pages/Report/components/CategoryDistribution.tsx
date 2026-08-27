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
// 화면에서 사용할 데이터
// ============================================================

interface NormalizedCategory {
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
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
  //
  // API에서 받은 percentage는 사용하지 않고
  // 실제 amount를 기준으로 다시 계산한다.
  // ============================================================

  const normalizedCategories = useMemo<
    NormalizedCategory[]
  >(() => {
    // ----------------------------------------------------------
    // 1. 12개 카테고리 생성
    // ----------------------------------------------------------

    const normalized = CATEGORY_ORDER.map(
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

          // 아래에서 다시 계산
          percentage: 0,

          color:
            CATEGORY_COLORS[categoryName] ??
            "#94A3B8",
        };
      }
    );

    // ----------------------------------------------------------
    // 2. 전체 지출 금액 계산
    // ----------------------------------------------------------

    const totalAmount = normalized.reduce(
      (sum, category) =>
        sum + category.amount,
      0
    );

    console.log(
      "전체 카테고리 지출:",
      totalAmount
    );

    // ----------------------------------------------------------
    // 3. 실제 금액을 기준으로 퍼센트 계산
    //
    // 예:
    //
    // 식비       100,000
    // 쇼핑       200,000
    // 교통       100,000
    //
    // 전체       400,000
    //
    // 식비       25%
    // 쇼핑       50%
    // 교통       25%
    // ----------------------------------------------------------

    if (totalAmount <= 0) {
      return normalized;
    }

    return normalized.map(
      (category) => ({
        ...category,

        percentage:
          (category.amount /
            totalAmount) *
          100,
      })
    );
  }, [categories]);

  // ============================================================
  // Donut Gradient
  //
  // 실제 계산된 percentage를 사용한다.
  // ============================================================

  const gradient = useMemo(() => {
    let current = 0;

    const segments =
      normalizedCategories
        .filter(
          (category) =>
            category.percentage > 0
        )
        .map((category) => {
          const start = current;

          const end =
            current +
            category.percentage;

          current = end;

          return `${category.color} ${start}% ${end}%`;
        });

    // ----------------------------------------------------------
    // 마지막 구간이 100%가 안 되는 부동소수점 오차 방지
    // ----------------------------------------------------------

    if (segments.length > 0 && current < 100) {
      const lastCategory =
        normalizedCategories
          .filter(
            (category) =>
              category.percentage > 0
          )
          .at(-1);

      if (lastCategory) {
        // 마지막 색상으로 남은 아주 작은 영역 보정
        segments[
          segments.length - 1
        ] =
          `${lastCategory.color} ${100 -
          lastCategory.percentage
          }% 100%`;
      }
    }

    // ----------------------------------------------------------
    // 지출 데이터가 없는 경우
    // ----------------------------------------------------------

    if (segments.length === 0) {
      return "#EEF0F3 0% 100%";
    }

    return segments.join(", ");
  }, [normalizedCategories]);

  // ============================================================
  // 전체 지출
  // ============================================================

  const totalAmount = useMemo(() => {
    return normalizedCategories.reduce(
      (sum, category) =>
        sum + category.amount,
      0
    );
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

        {/* ====================================================
            도넛
        ==================================================== */}

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

        {/* ====================================================
            가운데 구멍
        ==================================================== */}

        <div
          className="
            absolute
            h-[150px]
            w-[150px]
            rounded-full
            bg-white
          "
        />

        {/* ====================================================
            가운데 전체 지출 금액
        ==================================================== */}

        <div
          className="
            absolute
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <span
            className="
              text-[11px]
              font-medium
              text-[#94A3B8]
            "
          >
            총 지출
          </span>

          <span
            className="
              mt-1
              text-[16px]
              font-bold
              text-[#172033]
            "
          >
            {formatAmount(totalAmount)}
          </span>
        </div>
      </div>

      {/* ======================================================
          Category List
          2열 Grid
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
                  실제 계산된 비율
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
                {category.percentage.toFixed(
                  1
                )}
                %)
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}