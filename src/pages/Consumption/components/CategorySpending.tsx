import {
  BookOpen,
  FileText,
  Home,
  ShoppingCart,
  Utensils,
} from "lucide-react";

import {
  categoryData,
} from "../data/consumptionData";

function getCategoryIcon(icon: string) {
  switch (icon) {
    case "shopping-cart":
      return <ShoppingCart size={18} />;

    case "book-open":
      return <BookOpen size={18} />;

    case "file-text":
      return <FileText size={18} />;

    case "home":
      return <Home size={18} />;

    case "utensils":
      return <Utensils size={18} />;

    default:
      return null;
  }
}

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function CategorySpending() {
  return (
    <section
      className="
        rounded-2xl border border-[#E9EDF3]
        bg-white px-6 py-5
      "
    >
      <h2 className="mb-4 text-[15px] font-bold text-[#697586]">
        카테고리별 지출
      </h2>

      <div className="flex flex-col gap-3.5">
        {categoryData.map((category) => (
          <div
            key={category.name}
            className="flex items-center gap-4"
          >
            {/* 카테고리 */}
            <div className="flex w-[100px] shrink-0 items-center gap-2">
              <span
                style={{
                  color: category.color,
                }}
              >
                {getCategoryIcon(category.icon)}
              </span>

              <span className="text-sm font-medium text-[#5F6B7A]">
                {category.name}
              </span>
            </div>

            {/* Progress */}
            <div className="flex-1">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F0F2F5]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>

            {/* 금액 */}
            <span className="w-[100px] shrink-0 text-right text-sm font-medium text-[#7B8798]">
              {formatWon(category.amount)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}