import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

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

interface CategorySpendingProps {
  year: number;
  month: number;
}

/**
 * =========================
 * 카테고리 색상
 * =========================
 */
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

/**
 * =========================
 * 카테고리 순서
 * =========================
 */
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

/**
 * =========================
 * 금액 포맷
 * =========================
 */
const formatAmount = (amount: number) => {
  return `₩${Number(
    amount ?? 0
  ).toLocaleString("ko-KR")}`;
};


/**
 * =========================
 * Component
 * =========================
 */
export default function CategorySpending({
  year,
  month,
}: CategorySpendingProps) {

  const [categories, setCategories] =
    useState<CategoryExpense[]>([]);

  const [loading, setLoading] =
    useState(true);


  /**
   * =========================
   * API 조회
   * =========================
   */
  useEffect(() => {

    const fetchCategoryExpenses =
      async () => {

        setLoading(true);

        try {

          const response =
            await api.get<ReportResponse>(
              "/api/report",
              {
                params: {
                  year,
                  month,
                },
              }
            );

          console.log(
            "카테고리별 지출 API 응답:",
            response.data
          );

          setCategories(
            response.data.result
              ?.categoryExpenses ?? []
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


  /**
   * =========================
   * 12개 카테고리 정규화
   * =========================
   */
  const normalizedCategories =
    useMemo(() => {

      return CATEGORY_ORDER.map(
        (categoryName) => {

          const existing =
            categories.find(
              (category) =>
                category.categoryName ===
                categoryName
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
              CATEGORY_COLORS[
              categoryName
              ] ?? "#94A3B8",
          };
        }
      );

    }, [categories]);


  /**
   * =========================
   * 차트용 데이터
   *
   * 지출이 0인 카테고리는
   * 차트에서 제외
   * =========================
   */
  const chartCategories =
    useMemo(() => {

      return normalizedCategories.filter(
        (category) =>
          category.amount > 0 &&
          category.percentage > 0
      );

    }, [normalizedCategories]);


  /**
   * =========================
   * Loading
   * =========================
   */
  if (loading) {

    return (
      <section
        className="
          rounded-2xl
          border
          border-[#E9EDF3]
          bg-white
          p-6
        "
      >
        <h2
          className="
            mb-5
            text-[17px]
            font-bold
            text-[#1F2937]
          "
        >
          카테고리별 지출
        </h2>

        <div
          className="
            flex
            h-[250px]
            items-center
            justify-center
          "
        >
          <p
            className="
              text-sm
              text-[#9AA5B5]
            "
          >
            카테고리별 지출을 불러오는 중...
          </p>
        </div>
      </section>
    );
  }


  /**
   * =========================
   * Render
   * =========================
   */
  return (
    <section
      className="
        rounded-2xl
        border
        border-[#E9EDF3]
        bg-white
        p-6
      "
    >

      <h2
        className="
          mb-5
          text-[17px]
          font-bold
          text-[#1F2937]
        "
      >
        카테고리별 지출
      </h2>


      {/* =========================
          Donut Chart
      ========================= */}
      <div className="h-[250px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={chartCategories}
              dataKey="percentage"
              nameKey="categoryName"
              innerRadius={73}
              outerRadius={104}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={3}
            >

              {chartCategories.map(
                (item) => (
                  <Cell
                    key={
                      item.categoryName
                    }
                    fill={item.color}
                  />
                )
              )}

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>


      {/* =========================
          Category List
      ========================= */}
      <div
        className="
          mt-2
          flex
          flex-col
          gap-3
        "
      >

        {normalizedCategories
          .filter(
            (category) =>
              category.amount > 0
          )
          .slice(0, 5)
          .map(
            (category) => (

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
                key={
                  category.categoryName
                }
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                    "
                    style={{
                      backgroundColor:
                        category.color,
                    }}
                  />

                  <span
                    className="
                      text-sm
                      text-[#5F6B7A]
                    "
                  >
                    {category.categoryName}
                  </span>

                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[#374151]
                    "
                  >
                    {formatAmount(
                      category.amount
                    )}
                  </span>

                  <span
                    className="
                      text-sm
                      text-[#9AA5B5]
                    "
                  >
                    (
                    {category.percentage.toFixed(
                      1
                    )}
                    %)
                  </span>

                </div>

              </div>

            )
          )}

      </div>

    </section>
  );
}