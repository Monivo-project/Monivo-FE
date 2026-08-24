import {
  BookOpen,
  Film,
  ShoppingCart,
} from "lucide-react";

import type { ReactNode } from "react";

export type AbnormalSpendingItem = {
  id: number;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  type: "AI" | "RULE";
  reason: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  categoryBg: string;
  categoryColor: string;
};

export const abnormalSpending: AbnormalSpendingItem[] = [
  {
    id: 1,
    merchant: "루이비통 코리아",
    date: "8월 18일",
    amount: 1250000,
    category: "쇼핑",
    type: "AI",
    reason: "평균 쇼핑 지출 대비 890% 초과",
    icon: <ShoppingCart size={25} />,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    categoryBg: "bg-purple-50",
    categoryColor: "text-purple-500",
  },
  {
    id: 2,
    merchant: "강원랜드 카지노",
    date: "8월 15일",
    amount: 350000,
    category: "엔터테인먼트",
    type: "AI",
    reason: "새벽 2:37 비정상적 결제 시간대",
    icon: <Film size={25} />,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    categoryBg: "bg-pink-50",
    categoryColor: "text-pink-500",
  },
  {
    id: 3,
    merchant: "연세대 수강료",
    date: "8월 11일",
    amount: 720000,
    category: "교육",
    type: "RULE",
    reason: "교육 예산 350% 초과",
    icon: <BookOpen size={25} />,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    categoryBg: "bg-amber-50",
    categoryColor: "text-amber-500",
  },
];

export const formatAmount = (amount: number) => {
  return `₩${amount.toLocaleString("ko-KR")}`;
};