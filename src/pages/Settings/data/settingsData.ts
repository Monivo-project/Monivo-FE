/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type CategoryKey =
  | "food"
  | "transport"
  | "shopping"
  | "health"
  | "entertainment"
  | "housing"
  | "education"
  | "etc";

export type NotificationKey =
  | "anomaly"
  | "uncategorized"
  | "budgetOver";

export type AutoRule = {
  id: string;
  keywords: string[];
  category: CategoryKey;
};

/* ------------------------------------------------------------------ */
/* Category */
/* ------------------------------------------------------------------ */

export const CATEGORY_META: Record<
  CategoryKey,
  {
    label: string;
    icon: string;
    bg: string;
    text: string;
  }
> = {
  food: {
    label: "식비",
    icon: "Utensils",
    bg: "bg-orange-50",
    text: "text-orange-500",
  },

  transport: {
    label: "교통",
    icon: "Car",
    bg: "bg-blue-50",
    text: "text-blue-500",
  },

  shopping: {
    label: "쇼핑",
    icon: "ShoppingCart",
    bg: "bg-violet-50",
    text: "text-violet-500",
  },

  health: {
    label: "의료/건강",
    icon: "Heart",
    bg: "bg-rose-50",
    text: "text-rose-500",
  },

  entertainment: {
    label: "엔터테인먼트",
    icon: "Film",
    bg: "bg-pink-50",
    text: "text-pink-500",
  },

  housing: {
    label: "주거",
    icon: "Home",
    bg: "bg-emerald-50",
    text: "text-emerald-500",
  },

  education: {
    label: "교육",
    icon: "BookOpen",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },

  etc: {
    label: "기타",
    icon: "Package",
    bg: "bg-gray-100",
    text: "text-gray-500",
  },
};

/* ------------------------------------------------------------------ */
/* Budget */
/* ------------------------------------------------------------------ */

export const INITIAL_BUDGETS: {
  category: CategoryKey;
  amount: number;
}[] = [
  {
    category: "food",
    amount: 500000,
  },
  {
    category: "transport",
    amount: 150000,
  },
  {
    category: "shopping",
    amount: 300000,
  },
  {
    category: "health",
    amount: 200000,
  },
  {
    category: "entertainment",
    amount: 200000,
  },
  {
    category: "housing",
    amount: 500000,
  },
  {
    category: "education",
    amount: 300000,
  },
  {
    category: "etc",
    amount: 100000,
  },
];

/* ------------------------------------------------------------------ */
/* Notifications */
/* ------------------------------------------------------------------ */

export const INITIAL_NOTIFICATIONS: {
  key: NotificationKey;
  title: string;
  description: string;
  enabled: boolean;
}[] = [
  {
    key: "anomaly",
    title: "이상 지출 감지 알림",
    description: "비정상적인 지출이 감지될 때 알립니다",
    enabled: true,
  },
  {
    key: "uncategorized",
    title: "미분류 항목 알림",
    description: "분류되지 않은 거래가 있을 때 알립니다",
    enabled: true,
  },
  {
    key: "budgetOver",
    title: "예산 초과 경고",
    description: "카테고리 예산의 80%를 넘으면 알립니다",
    enabled: false,
  },
];

/* ------------------------------------------------------------------ */
/* Auto Rules */
/* ------------------------------------------------------------------ */

export const AUTO_RULES: AutoRule[] = [
  {
    id: "rule-1",
    keywords: [
      "스타벅스",
      "이디야",
      "투썸",
      "파리바게뜨",
    ],
    category: "food",
  },

  {
    id: "rule-2",
    keywords: [
      "카카오T",
      "지하철",
      "KTX",
      "우버",
    ],
    category: "transport",
  },

  {
    id: "rule-3",
    keywords: [
      "쿠팡",
      "11번가",
      "G마켓",
      "무신사",
    ],
    category: "shopping",
  },

  {
    id: "rule-4",
    keywords: [
      "병원",
      "약국",
      "올리브영",
      "세브란스",
    ],
    category: "health",
  },

  {
    id: "rule-5",
    keywords: [
      "Netflix",
      "CGV",
      "롯데시네마",
      "인터파크",
    ],
    category: "entertainment",
  },

  {
    id: "rule-6",
    keywords: [
      "관리비",
      "통신요금",
      "전기세",
      "SK텔레콤",
    ],
    category: "housing",
  },
];