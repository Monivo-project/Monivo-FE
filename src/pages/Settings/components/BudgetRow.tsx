import {
  Utensils,
  Car,
  ShoppingCart,
  Heart,
  Film,
  Home,
  BookOpen,
  Package,
} from "lucide-react";

import {
  CATEGORY_META,
  type CategoryKey,
} from "../data/settingsData";

const ICONS = {
  Utensils,
  Car,
  ShoppingCart,
  Heart,
  Film,
  Home,
  BookOpen,
  Package,
};

type BudgetRowProps = {
  category: CategoryKey;
  amount: number;
  onChange: (value: number) => void;
};

export default function BudgetRow({
  category,
  amount,
  onChange,
}: BudgetRowProps) {
  const meta = CATEGORY_META[category];

  const Icon = ICONS[meta.icon as keyof typeof ICONS];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");

    onChange(
      digitsOnly ? parseInt(digitsOnly, 10) : 0,
    );
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.text}`}
      >
        <Icon size={18} />
      </div>

      <span className="w-24 shrink-0 font-medium text-gray-700">
        {meta.label}
      </span>

      <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-4 py-3">
        <span className="text-gray-400">₩</span>

        <input
          type="text"
          inputMode="numeric"
          value={amount.toLocaleString()}
          onChange={handleChange}
          className="w-full bg-transparent font-mono font-semibold text-gray-900 outline-none"
        />
      </div>
    </div>
  );
}