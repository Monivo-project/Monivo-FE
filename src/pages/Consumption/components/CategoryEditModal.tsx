import {
    BookOpen,
    Car,
    Film,
    Gift,
    Heart,
    House,
    Landmark,
    Package,
    PawPrint,
    ShoppingCart,
    Utensils,
} from "lucide-react";
import type { ReactNode } from "react";

// ============================================================
// 카테고리 목록
// ============================================================

const CATEGORIES = [
    "식비",
    "쇼핑/생활",
    "교통",
    "주거/통신",
    "여가/문화",
    "의료/건강",
    "교육",
    "여행",
    "금융",
    "선물/경조사",
    "반려동물",
    "기타",
];

// ============================================================
// 카테고리 아이콘
// ============================================================

const CATEGORY_ICONS: Record<string, ReactNode> = {
    식비: <Utensils size={18} />,
    "쇼핑/생활": <ShoppingCart size={18} />,
    교통: <Car size={18} />,
    "주거/통신": <House size={18} />,
    "여가/문화": <Film size={18} />,
    "의료/건강": <Heart size={18} />,
    교육: <BookOpen size={18} />,
    여행: <PlaneIcon />,
    금융: <Landmark size={18} />,
    "선물/경조사": <Gift size={18} />,
    반려동물: <PawPrint size={18} />,
    기타: <Package size={18} />,
};

// ============================================================
// 여행 아이콘
// ============================================================

function PlaneIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.7 7 4-4 4-2.5-.5-1 1 4 2.5 2.5 4 1-1-.5-2.5 4-4 4 7 .7-.7c.4-.3.6-.8.5-1.3Z" />
        </svg>
    );
}

// ============================================================
// 카테고리 아이콘 색상
// ============================================================

const CATEGORY_ICON_COLORS: Record<string, string> = {
    식비: "#F97316",
    "쇼핑/생활": "#2161F5",
    교통: "#3B82F6",
    "주거/통신": "#10B981",
    "여가/문화": "#EC4899",
    "의료/건강": "#EF4444",
    교육: "#F59E0B",
    여행: "#14B8A6",
    금융: "#8B5CF6",
    "선물/경조사": "#A855F7",
    반려동물: "#84CC16",
    기타: "#64748B",
};

// ============================================================
// 거래 타입
// ============================================================

interface ConsumptionTransaction {
    transactionId: number;
    merchant: string;
    amount: number;
    date: string;
    categoryId: number | null;
    categoryName: string | null;
    classificationType:
    | "UNCLASSIFIED"
    | "KEYWORD"
    | "USER"
    | "LLM"
    | "UNCONFIRMED"
    | "MERCHANT";
    isAbnormal: boolean;
}

// ============================================================
// Props
// ============================================================

interface CategoryEditModalProps {
    isOpen: boolean;

    transaction: ConsumptionTransaction | null;

    category: string;

    onCategoryChange: (category: string) => void;

    onClose: () => void;

    onSave: () => void;
}

// ============================================================
// Component
// ============================================================

export default function CategoryEditModal({
    isOpen,
    transaction,
    category,
    onCategoryChange,
    onClose,
    onSave,
}: CategoryEditModalProps) {
    if (!isOpen || !transaction) {
        return null;
    }

    return (
        <div
            className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/35
        px-4
        backdrop-blur-[5px]
      "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* ==================================================
          Modal
      ================================================== */}

            <div
                className="
          w-full
          max-w-[420px]
          overflow-hidden
          rounded-[18px]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        "
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* ==================================================
            Header
        ================================================== */}

                <div
                    className="
            flex
            h-[78px]
            items-center
            justify-between
            border-b
            border-[#EEF1F5]
            px-6
          "
                >
                    <h2
                        className="
              text-[18px]
              font-bold
              text-[#172033]
            "
                    >
                        카테고리 수정
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#7B8494]
              transition-colors
              hover:bg-[#F5F7FA]
              hover:text-[#172033]
            "
                    >
                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* ==================================================
            Content
        ================================================== */}

                <div className="px-6 py-6">
                    {/* 거래 정보 */}

                    <div
                        className="
              rounded-xl
              bg-[#F7F8FA]
              px-4
              py-4
            "
                    >
                        <p
                            className="
                text-[15px]
                font-bold
                text-[#1F2937]
              "
                        >
                            {transaction.merchant}
                        </p>

                        <p
                            className="
                mt-1
                text-[14px]
                font-medium
                text-[#7B8494]
              "
                        >
                            ₩{transaction.amount.toLocaleString()}
                        </p>
                    </div>

                    {/* 카테고리 선택 제목 */}

                    <p
                        className="
              mb-3
              mt-5
              text-[13px]
              font-semibold
              text-[#64748B]
            "
                    >
                        카테고리 선택
                    </p>

                    {/* ==================================================
              카테고리 2열
          ================================================== */}

                    <div
                        className="
              grid
              grid-cols-2
              gap-2
            "
                    >
                        {CATEGORIES.map((item) => {
                            const isSelected = category === item;

                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => onCategoryChange(item)}
                                    className={`
                    flex
                    h-[48px]
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-3
                    text-left
                    transition-all

                    ${isSelected
                                            ? "border-[#2161F5] bg-[#F1F6FF] text-[#2161F5]"
                                            : "border-[#E2E6EC] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#FAFBFC]"
                                        }
                  `}
                                >
                                    <span
                                        className="
                      flex
                      shrink-0
                      items-center
                      justify-center
                    "
                                        style={{
                                            color: isSelected
                                                ? "#2161F5"
                                                : CATEGORY_ICON_COLORS[item],
                                        }}
                                    >
                                        {CATEGORY_ICONS[item]}
                                    </span>

                                    <span
                                        className={`
                      text-[14px]
                      ${isSelected
                                                ? "font-semibold"
                                                : "font-medium"
                                            }
                    `}
                                    >
                                        {item}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ==================================================
            Footer
        ================================================== */}

                <div
                    className="
            flex
            gap-3
            px-6
            pb-6
          "
                >
                    {/* 취소 */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="
              flex
              h-[48px]
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              border-[#E2E6EC]
              bg-white
              text-[14px]
              font-semibold
              text-[#475569]
              transition-colors
              hover:bg-[#F8FAFC]
            "
                    >
                        취소
                    </button>

                    {/* 저장 */}

                    <button
                        type="button"
                        onClick={onSave}
                        className="
              flex
              h-[48px]
              flex-1
              items-center
              justify-center
              rounded-xl
              bg-[#2161F5]
              text-[14px]
              font-semibold
              text-white
              shadow-[0_3px_10px_rgba(33,97,245,0.18)]
              transition-colors
              hover:bg-[#1553DE]
            "
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}