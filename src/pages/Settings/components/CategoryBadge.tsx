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

type CategoryBadgeProps = {
  category: CategoryKey;
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  const meta = CATEGORY_META[category];

  const Icon = ICONS[meta.icon as keyof typeof ICONS];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${meta.bg} ${meta.text}`}
    >
      <Icon size={18} />
      {meta.label}
    </span>
  );
}