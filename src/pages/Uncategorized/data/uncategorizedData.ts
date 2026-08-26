export interface AiTransaction {
  transactionId: number;
  merchant: string;
  candidateCategoryId: number | null;
  candidateCategoryName: string | null;
  date: string;
  amount: number;
  confidence: number | null;
}

export type ManualTransaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
};


export const MANUAL_NEEDED: ManualTransaction[] = [
  {
    id: "tx-3",
    title: "알 수 없는 이체",
    date: "8월 14일",
    amount: 120000,
  },
];

export const CATEGORY_OPTIONS = [
  "식비",
  "교통",
  "쇼핑",
  "교육",
  "문화/여가",
  "의료/건강",
  "기타",
];