import {
  ChevronRight,
  Plus,
  Zap,
} from "lucide-react";

import SectionCard from "./SectionCard";
import CategoryBadge from "./CategoryBadge";

import { AUTO_RULES } from "../data/settingsData";

export default function AutoRuleSection() {
  return (
    <SectionCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">
          자동 분류 규칙
        </h2>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          규칙 추가
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {AUTO_RULES.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Zap
                size={16}
                className="shrink-0 text-blue-500"
              />

              <span className="truncate text-gray-600">
                {rule.keywords.join(", ")}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <CategoryBadge
                category={rule.category}
              />

              <ChevronRight
                size={16}
                className="text-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}