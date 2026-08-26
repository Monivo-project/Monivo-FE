interface BudgetProgressProps {
  expectedAmount: number;
  currentAmount: number;
}

export default function BudgetProgress({
  expectedAmount,
  currentAmount,
}: BudgetProgressProps) {

  // 현재 지출 금액은 Summary API의 totalExpense를 사용
  const currentExpense = currentAmount ?? 0;

  // 예상 지출이 없는 경우
  if (expectedAmount <= 0) {
    return (
      <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-[17px] font-bold text-[#1F2937]">
            예상 지출 사용률
          </h2>

          <span className="text-sm font-medium text-[#6B7280]">
            ₩{currentExpense.toLocaleString()}
            &nbsp;/&nbsp;
            ₩0
          </span>

        </div>

        {/* Progress */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#EEF1F5]" />

        {/* Bottom Info */}
        <div className="mt-3 flex items-center justify-between text-xs">

          <span className="text-[#9AA5B5]">
            예상 지출 없음
          </span>

          {currentExpense > 0 && (
            <strong className="font-semibold text-[#F04444]">
              예상 지출보다 ₩
              {currentExpense.toLocaleString()}
              {" "}초과
            </strong>
          )}

        </div>

      </section>
    );
  }

  // 현재 지출 / 예상 지출 비율
  const usageRate =
    (currentExpense / expectedAmount) * 100;

  // 게이지는 최대 100%
  const gaugeWidth =
    Math.min(usageRate, 100);

  // 예상 지출 초과 여부
  const isExceeded =
    currentExpense > expectedAmount;

  // 초과 금액
  const exceededAmount =
    Math.max(
      currentExpense - expectedAmount,
      0
    );

  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-[17px] font-bold text-[#1F2937]">
          예상 지출 사용률
        </h2>

        <span className="text-sm font-medium text-[#6B7280]">
          ₩{currentExpense.toLocaleString()}
          &nbsp;/&nbsp;
          ₩{expectedAmount.toLocaleString()}
        </span>

      </div>

      {/* Progress */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#EEF1F5]">

        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-500
            ${isExceeded
              ? "bg-[#F04444]"
              : "bg-[#2F6BEB]"
            }
          `}
          style={{
            width: `${gaugeWidth}%`,
          }}
        />

      </div>

      {/* Bottom Info */}
      <div className="mt-3 flex items-center justify-between text-xs">

        <span className="text-[#9AA5B5]">
          0원
        </span>

        {!isExceeded ? (

          <strong className="font-semibold text-[#2F6BEB]">
            {usageRate.toFixed(1)}% 사용
          </strong>

        ) : (

          <strong className="font-semibold text-[#F04444]">
            예상 지출보다 ₩
            {exceededAmount.toLocaleString()}
            {" "}초과
            {" "}
            ({usageRate.toFixed(1)}%)
          </strong>

        )}

        <span className="text-[#9AA5B5]">
          ₩{expectedAmount.toLocaleString()}
        </span>

      </div>

    </section>
  );
}