import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type FilterButtonProps = {
  children: ReactNode;
};

export default function FilterButton({
  children,
}: FilterButtonProps) {
  return (
    <button
      className="
        flex h-11 min-w-[158px] items-center justify-between
        rounded-xl border border-[#E5EAF0]
        bg-white px-4
        text-sm font-medium text-[#4B5563]
        transition-colors
        hover:bg-[#F8FAFC]
      "
    >
      <span>{children}</span>

      <ChevronDown
        size={18}
        className="text-[#64748B]"
      />
    </button>
  );
}