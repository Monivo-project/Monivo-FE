export type AiTransaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  aiCategory: string;
};

export type ManualTransaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
};

export const AI_SUGGESTED: AiTransaction[] = [
  {
    id: "tx-1",
    title: "위워크 멤버십",
    date: "8월 16일",
    amount: 450000,
    aiCategory: "교육",
  },
  {
    id: "tx-2",
    title: "당근마켓 직거래",
    date: "8월 15일",
    amount: 85000,
    aiCategory: "쇼핑",
  },
];

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