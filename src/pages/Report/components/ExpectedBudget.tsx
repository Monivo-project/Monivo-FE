import { useEffect, useState } from "react";
import {
    Brain,
    TrendingDown,
    Wallet,
} from "lucide-react";

import api from "../../../api/api";
import BudgetProgress from "../../Home/components/BudgetProgress";


// ============================================================
// 예상 지출 API Response
// ============================================================

interface ExpectedBudgetResponse {
    isSuccess: boolean;
    code: string;
    message: string;

    result: {
        expectedAmount: number;
        recommendedBudget: number;
        currentAmount: number;
        remainingExpectedAmount: number;
        reason: string;
        confidence: number;
        analyzedMonths: number;
    };
}


// ============================================================
// Report API Response
// ============================================================

interface ReportResponse {
    isSuccess: boolean;
    code: string;
    message: string;

    result: {
        year: number;
        month: number;

        monthlyExpenses: {
            year: number;
            month: number;
            label: string;
            amount: number;
        }[];

        categoryExpenses: {
            categoryId: number | null;
            categoryName: string;
            amount: number;
            percentage: number;
        }[];

        budgetComparisons: unknown[];
    };
}


// ============================================================
// 금액 포맷
// ============================================================

const formatAmount = (amount: number) => {
    return `₩${Number(amount ?? 0).toLocaleString("ko-KR")}`;
};


// ============================================================
// Component
// ============================================================

export default function ExpectedBudget() {

    // ========================================================
    // AI 예상 지출 데이터
    // ========================================================

    const [data, setData] =
        useState<ExpectedBudgetResponse["result"] | null>(null);


    // ========================================================
    // Report API에서 가져온 실제 현재 지출
    // ========================================================

    const [currentAmount, setCurrentAmount] =
        useState(0);


    // ========================================================
    // Loading
    // ========================================================

    const [loading, setLoading] =
        useState(true);


    // ========================================================
    // 현재 연 / 월
    // ========================================================

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;


    // ========================================================
    // API 조회
    // ========================================================

    useEffect(() => {

        const fetchData = async () => {

            setLoading(true);


            // ==================================================
            // 1. AI 예상 지출 API
            // ==================================================

            try {

                const expectedBudgetResponse =
                    await api.get<ExpectedBudgetResponse>(
                        "/api/home/expected-budget",
                        {
                            params: {
                                year,
                                month,
                            },
                        }
                    );


                console.log(
                    "[ExpectedBudget] AI 예상 지출:",
                    expectedBudgetResponse.data
                );


                setData(
                    expectedBudgetResponse.data.result ?? null
                );

            } catch (error: any) {

                console.error(
                    "[ExpectedBudget] 예상 지출 조회 실패:",
                    error
                );

                console.error(
                    "[ExpectedBudget] Response:",
                    error.response?.data
                );

                setData(null);
            }


            // ==================================================
            // 2. Report API 조회
            //
            // /api/transactions 사용하지 않음
            // ==================================================

            try {

                const reportResponse =
                    await api.get<ReportResponse>(
                        "/api/report",
                        {
                            params: {
                                year,
                                month,
                            },
                        }
                    );


                console.log(
                    "[ExpectedBudget] Report:",
                    reportResponse.data
                );


                const monthlyExpenses =
                    reportResponse.data.result
                        ?.monthlyExpenses ?? [];


                // ==================================================
                // 3. 현재 선택한 월 찾기
                //
                // 예:
                //
                // year = 2026
                // month = 8
                //
                // → year: 2026
                // → month: 8
                // → amount: 200634052
                // ==================================================

                const currentMonthExpense =
                    monthlyExpenses.find(
                        expense =>
                            expense.year === year &&
                            expense.month === month
                    );


                // ==================================================
                // 4. 현재 지출 설정
                // ==================================================

                const expenseAmount =
                    Number(
                        currentMonthExpense?.amount ?? 0
                    );


                console.log(
                    "[ExpectedBudget] 현재 월 지출:",
                    expenseAmount
                );


                setCurrentAmount(
                    expenseAmount
                );

            } catch (error: any) {

                console.error(
                    "[ExpectedBudget] Report 조회 실패:",
                    error
                );

                console.error(
                    "[ExpectedBudget] Report Response:",
                    error.response?.data
                );

                setCurrentAmount(0);
            }


            setLoading(false);
        };


        fetchData();

    }, [year, month]);


    // ============================================================
    // Loading
    // ============================================================

    if (loading) {

        return (
            <div className="flex min-h-[360px] items-center justify-center">

                <p className="text-sm text-[#9AA5B5]">
                    예상 지출 데이터를 불러오는 중...
                </p>

            </div>
        );
    }


    // ============================================================
    // 데이터 없음
    // ============================================================

    if (!data) {

        return (
            <div className="flex min-h-[360px] items-center justify-center">

                <p className="text-sm text-[#9AA5B5]">
                    예상 지출 데이터가 없습니다.
                </p>

            </div>
        );
    }


    // ============================================================
    // 남은 예상 지출
    //
    // AI 예상 지출 - Report의 실제 지출
    // ============================================================

    const remainingExpectedAmount =
        Math.max(
            Number(data.expectedAmount) -
            currentAmount,
            0
        );


    // ============================================================
    // Render
    // ============================================================

    return (

        <div className="flex flex-col gap-5">

            {/* ======================================================
                주요 예상 지출
            ====================================================== */}

            <div className="grid grid-cols-2 gap-4">

                {/* 예상 지출 */}

                <div className="rounded-[14px] bg-[#F8FAFC] p-5">

                    <div className="mb-3 flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF2FF]">

                            <TrendingDown
                                size={17}
                                className="text-[#6366F1]"
                            />

                        </div>

                        <span className="text-[13px] font-medium text-[#64748B]">
                            이번 달 예상 지출
                        </span>

                    </div>


                    <p className="text-[22px] font-bold text-[#172033]">

                        {formatAmount(
                            data.expectedAmount
                        )}

                    </p>

                </div>


                {/* 권장 예산 */}

                <div className="rounded-[14px] bg-[#F8FAFC] p-5">

                    <div className="mb-3 flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#ECFDF5]">

                            <Wallet
                                size={17}
                                className="text-[#10B981]"
                            />

                        </div>

                        <span className="text-[13px] font-medium text-[#64748B]">
                            권장 예산
                        </span>

                    </div>


                    <p className="text-[22px] font-bold text-[#172033]">

                        {formatAmount(
                            data.recommendedBudget
                        )}

                    </p>

                </div>

            </div>


            {/* ======================================================
                예상 지출 사용률
                Report API의 monthlyExpenses.amount 사용
            ====================================================== */}

            <BudgetProgress
                currentAmount={currentAmount}
                expectedAmount={
                    Number(data.expectedAmount) || 0
                }
            />


            {/* ======================================================
                현재 실제 지출
            ====================================================== */}

            <div className="flex items-center justify-between rounded-[14px] bg-[#F8FAFC] px-5 py-4">

                <div>

                    <p className="text-[12px] text-[#94A3B8]">
                        이번 달 현재 지출
                    </p>

                    <p className="mt-1 text-[18px] font-bold text-[#172033]">

                        {formatAmount(
                            currentAmount
                        )}

                    </p>

                </div>


                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">

                    <Wallet
                        size={17}
                        className="text-[#6366F1]"
                    />

                </div>

            </div>


            {/* ======================================================
                남은 예상 지출
            ====================================================== */}

            <div className="flex items-center justify-between rounded-[14px] bg-[#F8FAFC] px-5 py-4">

                <div>

                    <p className="text-[12px] text-[#94A3B8]">
                        이번 달 남은 예상 지출
                    </p>

                    <p className="mt-1 text-[18px] font-bold text-[#172033]">

                        {formatAmount(
                            remainingExpectedAmount
                        )}

                    </p>

                </div>


                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">

                    <Wallet
                        size={17}
                        className="text-[#6366F1]"
                    />

                </div>

            </div>


            {/* ======================================================
                AI 예측 정보
            ====================================================== */}

            <div className="rounded-[14px] border border-[#E8EAFD] bg-[#F8F9FF] p-5">

                <div className="mb-3 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDE9FE]">

                        <Brain
                            size={17}
                            className="text-[#7C3AED]"
                        />

                    </div>

                    <span className="text-[13px] font-semibold text-[#475569]">
                        AI 예측 근거
                    </span>

                </div>


                <p className="text-[13px] leading-5 text-[#64748B]">
                    {data.reason}
                </p>


                <div className="mt-4 flex items-center justify-between border-t border-[#E8EAFD] pt-3">

                    <span className="text-[11px] text-[#94A3B8]">
                        최근 {data.analyzedMonths}개월 소비 패턴 분석
                    </span>

                    <span className="text-[12px] font-semibold text-[#6366F1]">
                        신뢰도 {data.confidence}%
                    </span>

                </div>

            </div>

        </div>
    );
}