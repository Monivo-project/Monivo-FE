import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

const CATEGORY_OPTIONS: Category[] = [
  {
    id: 1,
    name: "식비",
  },
  {
    id: 2,
    name: "쇼핑/생활",
  },
  {
    id: 3,
    name: "교통",
  },
  {
    id: 4,
    name: "주거/통신",
  },
  {
    id: 5,
    name: "여가/문화",
  },
  {
    id: 6,
    name: "의료/건강",
  },
  {
    id: 7,
    name: "교육",
  },
  {
    id: 8,
    name: "여행",
  },
  {
    id: 9,
    name: "금융",
  },
  {
    id: 10,
    name: "선물/경조사",
  },
  {
    id: 11,
    name: "반려동물",
  },
  {
    id: 12,
    name: "기타",
  },
];

type CategoryDropdownProps = {
  transactionId: number;
  onCategorySelect: (
    categoryId: number,
    categoryName: string
  ) => void;
};

export default function CategoryDropdown({
  transactionId,
  onCategorySelect,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleCategorySelect = (
    category: Category
  ) => {
    console.log(
      "카테고리 선택:",
      transactionId,
      category.id,
      category.name
    );

    onCategorySelect(
      category.id,
      category.name
    );

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
            w-44 overflow-hidden
            rounded-xl border border-gray-100
            bg-white shadow-lg
          "
        >
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                handleCategorySelect(category)
              }
              className="
                block w-full px-4 py-2.5
                text-left text-sm text-gray-700
                hover:bg-gray-50
              "
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}