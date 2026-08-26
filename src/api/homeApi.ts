import api from "./api";

// =========================
// Enum
// =========================

export type ClassificationType =
  | "EXPENSE"
  | "INCOME"
  | "TRANSFER"
  | string;


// =========================
// 대시보드 상단 요약
// =========================

export interface HomeSummary {
  year: number;
  month: number;

  totalExpense: number;
  budget: number;
  remainingBudget: number;
  budgetUsageRate: number;

  abnormalCount: number;
  uncategorizedCount: number;
  
  // 지난달 같은 기간 대비
  changeFromLastMonth: number;
  changeRateFromLastMonth: number;
}


// =========================
// 예상 지출
// =========================

export interface ExpectedBudget {
  targetYear: number;
  targetMonth: number;

  expectedAmount: number;
  recommendedBudget: number;

  currentAmount: number;
  remainingExpectedAmount: number;

  reason: string;
  confidence: number;

  analyzedMonths: number;
}


// =========================
// 일별 지출
// =========================

export interface DailyExpense {
  date: string;
  dayOfWeek: string;
  amount: number;
}


// =========================
// 이번 주 지출
// =========================

export interface WeeklyExpense {
  startDate: string;
  endDate: string;
  dailyExpenses: DailyExpense[];
}


// =========================
// 최근 거래
// =========================

export interface RecentTransaction {
  transactionId: number;
  merchant: string;
  amount: number;
  date: string;

  categoryId: number | null;
  categoryName: string | null;

  classificationType: ClassificationType;

  isAbnormal: boolean;
}


// =========================
// 최근 거래 전체
// =========================

export interface RecentTransactions {
  transactions: RecentTransaction[];
}


// =========================
// API
// =========================

/**
 * 대시보드 상단 요약
 *
 * GET /api/home?year=2026&month=8
 */
export const getHomeSummary = async (
  year: number,
  month: number
): Promise<HomeSummary> => {

  const response = await api.get("/api/home", {
    params: {
      year,
      month,
    },
  });

  return response.data.result;
};


/**
 * 예상 지출
 *
 * GET /api/home/expected-budget?year=2026&month=8
 */
export const getExpectedBudget = async (
  year: number,
  month: number
): Promise<ExpectedBudget> => {

  const response = await api.get(
    "/api/home/expected-budget",
    {
      params: {
        year,
        month,
      },
    }
  );

  return response.data.result;
};


/**
 * 이번 주 일별 지출
 *
 * GET /api/home/weekly?date=2026-08-25
 */
export const getWeeklyExpense = async (
  date: string
): Promise<WeeklyExpense> => {

  const response = await api.get(
    "/api/home/weekly",
    {
      params: {
        date,
      },
    }
  );

  return response.data.result;
};


/**
 * 최근 거래
 *
 * GET /api/home/recent-transactions
 */
export const getRecentTransactions =
  async (): Promise<RecentTransactions> => {

    const response = await api.get(
      "/api/home/recent-transactions"
    );

    return response.data.result;
  };