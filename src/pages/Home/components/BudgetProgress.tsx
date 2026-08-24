export default function BudgetProgress() {
  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#1F2937]">
          예산 사용률
        </h2>

        <span className="text-sm font-medium text-[#6B7280]">
          ₩3,505,500&nbsp; / &nbsp;₩2,250,000
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-[#EEF1F5]">
        <div
          className="h-full rounded-full bg-[#F04444]"
          style={{ width: "100%" }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#9AA5B5]">
        <span>0%</span>

        <strong className="font-semibold text-[#F04444]">
          100.0% 사용
        </strong>

        <span>100%</span>
      </div>
    </section>
  );
}