import type { ReactNode } from "react";

type Tone = "blue" | "green" | "red" | "yellow";

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  subText: React.ReactNode; // 수정
  tone: Tone;
  active?: boolean;
  onClick?: () => void;
};

export default function SummaryCard({
  icon,
  label,
  value,
  subText,
  tone,
  active = false,
  onClick,
}: SummaryCardProps) {
  const iconStyle: Record<Tone, string> = {
    blue: "bg-[#EEF4FF] text-[#2F6BEB]",
    green: "bg-[#EAFBF5] text-[#13B98A]",
    red: "bg-[#FFF0F0] text-[#F04444]",
    yellow: "bg-[#FFF8E8] text-[#F59E0B]",
  };

  const subTextStyle: Record<Tone, string> = {
    blue: "text-[#2F6BEB]",
    green: "text-[#13B98A]",
    red: "text-[#F04444]",
    yellow: "text-[#F59E0B]",
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex min-h-[150px] items-center gap-4
        rounded-2xl border bg-white p-5
        transition-all
        ${onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          : ""
        }
        ${active
          ? "border-[#2F6BEB] shadow-[0_4px_20px_rgba(47,107,235,0.10)]"
          : "border-[#E9EDF3]"
        }
      `}
    >
      <div
        className={`
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-xl
          ${iconStyle[tone]}
        `}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-[#8A95A5]">
          {label}
        </span>

        <strong className="mt-1 text-[24px] font-bold tracking-tight text-[#1F2937]">
          {value}
        </strong>

        <span
          className={`
            mt-1 text-xs font-medium
            ${subTextStyle[tone]}
          `}
        >
          {subText}
        </span>
      </div>
    </div>
  );
}