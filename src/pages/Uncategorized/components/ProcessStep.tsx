import type { ReactNode } from "react";

type ProcessStepProps = {
  icon: ReactNode;
  label: string;
  color: "blue" | "violet" | "amber";
};

export default function ProcessStep({
  icon,
  label,
  color,
}: ProcessStepProps) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  }[color];

  return (
    <span
      className={`
        inline-flex items-center gap-2
        rounded-full px-4 py-2
        text-sm font-semibold
        ${styles}
      `}
    >
      {icon}
      {label}
    </span>
  );
}