type StatCardProps = {
  value: number;
  label: string;
  variant: "purple" | "amber" | "blue";
};

export default function StatCard({
  value,
  label,
  variant,
}: StatCardProps) {
  const styles = {
    purple: {
      bg: "bg-gradient-to-br from-violet-50 to-fuchsia-50",
      value: "text-violet-700",
      label: "text-violet-600",
    },
    amber: {
      bg: "bg-amber-50",
      value: "text-orange-600",
      label: "text-orange-500",
    },
    blue: {
      bg: "bg-blue-50",
      value: "text-blue-700",
      label: "text-blue-600",
    },
  }[variant];

  return (
    <div
      className={`
        flex flex-1 flex-col items-center justify-center
        gap-2 rounded-2xl ${styles.bg}
        px-6 py-8
      `}
    >
      <span
        className={`
          text-4xl font-bold tabular-nums
          ${styles.value}
        `}
      >
        {value}
      </span>

      <span
        className={`text-sm font-medium ${styles.label}`}
      >
        {label}
      </span>
    </div>
  );
}