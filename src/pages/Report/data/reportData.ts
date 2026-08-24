export type Category = {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  overBudget?: boolean;
};

export type MonthlyExpense = {
  month: string;
  amount: number;
};

export type BudgetData = {
  name: string;
  amount: number;
  budget: number;
  color: string;
  overBudget: boolean;
};

export const categories: Category[] = [
  {
    name: "식비",
    amount: 225000,
    percentage: 6,
    color: "#F97316",
  },
  {
    name: "교통",
    amount: 117500,
    percentage: 3,
    color: "#2563EB",
  },
  {
    name: "쇼핑",
    amount: 1464000,
    percentage: 42,
    color: "#8B5CF6",
    overBudget: true,
  },
  {
    name: "의료/건강",
    amount: 164000,
    percentage: 5,
    color: "#EF4444",
  },
  {
    name: "엔터테인먼트",
    amount: 507000,
    percentage: 14,
    color: "#EC4899",
    overBudget: true,
  },
  {
    name: "주거",
    amount: 245000,
    percentage: 7,
    color: "#10B981",
  },
  {
    name: "교육",
    amount: 783000,
    percentage: 22,
    color: "#F59E0B",
    overBudget: true,
  },
];

export const monthlyExpenses: MonthlyExpense[] = [
  { month: "3월", amount: 2250000 },
  { month: "4월", amount: 2250000 },
  { month: "5월", amount: 2250000 },
  { month: "6월", amount: 2250000 },
  { month: "7월", amount: 2250000 },
  { month: "8월", amount: 2250000 },
];

export const budgetData: BudgetData[] = [
  {
    name: "식비",
    amount: 225000,
    budget: 500000,
    color: "#F97316",
    overBudget: false,
  },
  {
    name: "교통",
    amount: 117500,
    budget: 300000,
    color: "#2563EB",
    overBudget: false,
  },
  {
    name: "쇼핑",
    amount: 1464000,
    budget: 1000000,
    color: "#EF4444",
    overBudget: true,
  },
  {
    name: "의료/건강",
    amount: 164000,
    budget: 500000,
    color: "#EF4444",
    overBudget: false,
  },
  {
    name: "엔터테인먼트",
    amount: 507000,
    budget: 300000,
    color: "#EF4444",
    overBudget: true,
  },
  {
    name: "주거",
    amount: 245000,
    budget: 500000,
    color: "#10B981",
    overBudget: false,
  },
  {
    name: "교육",
    amount: 783000,
    budget: 500000,
    color: "#EF4444",
    overBudget: true,
  },
  {
    name: "기타",
    amount: 0,
    budget: 300000,
    color: "#CBD5E1",
    overBudget: false,
  },
];