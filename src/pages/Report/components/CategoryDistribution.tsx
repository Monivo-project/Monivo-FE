import {
  categories,
} from "../data/reportData";

const formatAmount = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

export default function CategoryDistribution() {
  const gradient = (() => {
    let current = 0;

    return categories
      .map((category) => {
        const start = current;
        const end =
          current + category.percentage;

        current = end;

        return `${category.color} ${start}% ${end}%`;
      })
      .join(", ");
  })();

  return (
    <div className="flex items-center gap-10">
      {/* Donut */}
      <div className="relative flex h-[180px] w-[180px] shrink-0 items-center justify-center">
        <div
          className="h-[180px] w-[180px] rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        />

        <div className="absolute h-[102px] w-[102px] rounded-full bg-white" />
      </div>

      {/* Category List */}
      <div className="flex flex-1 flex-col gap-[13px]">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center gap-2"
          >
            <span
              className="h-[9px] w-[9px] rounded-full"
              style={{
                backgroundColor: category.color,
              }}
            />

            <span className="flex-1 text-[14px] font-medium text-[#475569]">
              {category.name}
            </span>

            <span className="text-[14px] text-[#64748B]">
              {formatAmount(category.amount)}
            </span>

            <span className="w-[42px] text-right text-[14px] text-[#94A3B8]">
              ({category.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}