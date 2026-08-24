import {
  budgetData,
} from "../data/reportData";

const formatAmount = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};

export default function BudgetComparison() {
  return (
    <div className="flex flex-col gap-[13px]">
      {budgetData.map((item) => {
        const percentage =
          item.budget === 0
            ? 0
            : Math.min(
                (item.amount / item.budget) * 100,
                100
              );

        return (
          <div key={item.name}>
            <div className="mb-[6px] flex items-center justify-between">
              <span className="text-[14px] font-medium text-[#475569]">
                {item.name}
              </span>

              <span
                className={`text-[14px] ${
                  item.overBudget
                    ? "font-semibold text-[#EF4444]"
                    : "text-[#64748B]"
                }`}
              >
                {formatAmount(item.amount)}

                {item.overBudget && (
                  <span className="ml-1">
                    ↑
                  </span>
                )}
              </span>
            </div>

            <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#EEF0F3]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.overBudget
                    ? "#EF4444"
                    : item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}