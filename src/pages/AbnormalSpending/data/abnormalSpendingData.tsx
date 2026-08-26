import type { ReactNode } from "react";

export type AbnormalSpendingItem = {
  transactionId: number;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  score: number;
  type: "AI" | "RULE";
  reason: string;

  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  categoryBg: string;
  categoryColor: string;
};

export const formatAmount = (amount: number) => {
  return `${amount.toLocaleString("ko-KR")}원`;
};