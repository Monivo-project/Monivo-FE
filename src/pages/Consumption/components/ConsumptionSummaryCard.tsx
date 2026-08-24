type ConsumptionSummaryCardProps = {
  label: string;
  value: string;
  tone?: "normal" | "red" | "yellow";
};

export default function ConsumptionSummaryCard({
  label,
  value,
  tone = "normal",
}: ConsumptionSummaryCardProps) {
  const styles = {
    normal: {
      container: "border-[#E9EDF3] bg-white",
      label: "text-[#7B8798]",
      value: "text-[#1F2937]",
    },
    red: {
      container: "border-[#FFD8D8] bg-[#FFF5F5]",
      label: "text-[#F04444]",
      value: "text-[#E32929]",
    },
    yellow: {
      container: "border-[#FFE7A8] bg-[#FFF9E9]",
      label: "text-[#F59E0B]",
      value: "text-[#C76A00]",
    },
  };

  return (
    <div
      className={`
        flex min-h-[96px] flex-col justify-center
        rounded-2xl border px-5
        ${styles[tone].container}
      `}
    >
      <span
        className={`text-sm font-medium ${styles[tone].label}`}
      >
        {label}
      </span>

      <strong
        className={`
          mt-2 text-[24px] font-bold tracking-tight
          ${styles[tone].value}
        `}
      >
        {value}
      </strong>
    </div>
  );
}