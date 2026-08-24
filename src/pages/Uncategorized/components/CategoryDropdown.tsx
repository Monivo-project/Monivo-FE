import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { CATEGORY_OPTIONS } from "../data/uncategorizedData";

type CategoryDropdownProps = {
  transactionId: string;
};

export default function CategoryDropdown({
  transactionId,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    console.log(
      "카테고리 변경:",
      transactionId,
      category
    );

    // TODO:
    // transactionId를 이용해서
    // 카테고리 변경 API 연결

    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          inline-flex items-center gap-2
          rounded-xl border border-gray-200
          bg-white px-4 py-2.5
          text-sm font-medium text-gray-600
          hover:bg-gray-50
        "
      >
        다른 카테고리 선택

        <ChevronDown
          size={16}
          className="text-gray-400"
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 z-10 mt-2
            w-40 overflow-hidden
            rounded-xl border border-gray-100
            bg-white shadow-lg
          "
        >
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                handleCategorySelect(category)
              }
              className="
                block w-full px-4 py-2
                text-left text-sm text-gray-700
                hover:bg-gray-50
              "
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}