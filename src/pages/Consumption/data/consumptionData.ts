export type Category = {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
};

export type Transaction = {
  title: string;
  category: string;
  categoryColor: string;
  categoryIcon: string;
  amount: number;
  isRule?: boolean;
  iconBg: string;
  iconColor: string;
  icon: string;
};

export type TransactionGroup = {
  date: string;
  total: number;
  transactions: Transaction[];
};

export const categoryData: Category[] = [
  {
    name: "쇼핑",
    amount: 1464000,
    percentage: 42,
    color: "#8555E8",
    icon: "shopping-cart",
  },
  {
    name: "교육",
    amount: 783000,
    percentage: 22,
    color: "#F59E0B",
    icon: "book-open",
  },
  {
    name: "엔터테인먼트",
    amount: 507000,
    percentage: 14,
    color: "#E83D91",
    icon: "file-text",
  },
  {
    name: "주거",
    amount: 245000,
    percentage: 7,
    color: "#13B98A",
    icon: "home",
  },
  {
    name: "식비",
    amount: 225000,
    percentage: 6,
    color: "#FF8A00",
    icon: "utensils",
  },
];

export const transactionGroups: TransactionGroup[] = [
  {
    date: "8월 23일 (일)",
    total: 21800,
    transactions: [
      {
        title: "스타벅스 강남점",
        category: "식비",
        categoryColor: "#FF8A00",
        categoryIcon: "utensils",
        amount: 6800,
        isRule: true,
        iconBg: "#FFF4E8",
        iconColor: "#FF8A00",
        icon: "utensils",
      },
      {
        title: "카카오T 택시",
        category: "교통",
        categoryColor: "#2F6BEB",
        categoryIcon: "car",
        amount: 15000,
        isRule: true,
        iconBg: "#EEF4FF",
        iconColor: "#2F6BEB",
        icon: "car",
      },
    ],
  },
  {
    date: "8월 22일 (토)",
    total: 121500,
    transactions: [
      {
        title: "무신사",
        category: "쇼핑",
        categoryColor: "#8555E8",
        categoryIcon: "shopping-cart",
        amount: 89000,
        isRule: true,
        iconBg: "#F3EDFF",
        iconColor: "#8555E8",
        icon: "shopping-cart",
      },
      {
        title: "쿠팡",
        category: "쇼핑",
        categoryColor: "#8555E8",
        categoryIcon: "shopping-cart",
        amount: 32500,
        iconBg: "#F3EDFF",
        iconColor: "#8555E8",
        icon: "shopping-cart",
      },
    ],
  },
  {
    date: "8월 21일 (금)",
    total: 48000,
    transactions: [
      {
        title: "CGV 강남",
        category: "엔터테인먼트",
        categoryColor: "#E83D91",
        categoryIcon: "file-text",
        amount: 28000,
        isRule: true,
        iconBg: "#FFF0F7",
        iconColor: "#E83D91",
        icon: "file-text",
      },
      {
        title: "올리브영",
        category: "쇼핑",
        categoryColor: "#8555E8",
        categoryIcon: "shopping-cart",
        amount: 20000,
        iconBg: "#F3EDFF",
        iconColor: "#8555E8",
        icon: "shopping-cart",
      },
    ],
  },
];