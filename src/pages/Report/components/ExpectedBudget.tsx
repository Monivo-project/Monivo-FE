import { useEffect, useState } from "react";
import { Brain, CalendarDays, TrendingDown, Wallet } from "lucide-react";
import api from "../../../api/api";

// ============================================================
// API Response Interface
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
// 금액 포맷
// ============================================================

const formatAmount = (amount: number) => {
    return `₩${Number(amount ?? 0).toLocaleString("ko-KR")}`;
};

// ============================================================
// Component
// ============================================================

export default function ExpectedBudget() {
    const [data, setData] =
        useState<ExpectedBudgetResponse["result"] | null>(null);

    const [loading, setLoading] = useState(true);

    // ============================================================
    // 현재 연 / 월
    // ============================================================

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // ============================================================
    // API 조회
    // ============================================================

    useEffect(() => {
        const fetchExpectedBudget = async () => {
            setLoading(true);

            try {
                const response =
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
                    "AI 예상 예산:",
                    response.data
                );

                setData(
                    response.data.result ?? null
                );
            } catch (error: any) {
                console.error(
                    "AI 예상 예산 조회 실패:",
                    error
                );

                console.error(
                    "Response:",
                    error.response?.data
                );

                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchExpectedBudget();
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
    // 현재 사용 비율
    // ============================================================

    const usagePercentage =
        data.expectedAmount > 0
            ? Math.min(
                (data.currentAmount /
                    data.expectedAmount) *
                100,
                100
            )
            : 0;

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
          현재 사용 / 남은 예상 지출
      ====================================================== */}

            <div className="rounded-[14px] border border-[#EEF0F3] p-5">

                <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FFF7ED]">
                            <CalendarDays
                                size={17}
                                className="text-[#F97316]"
                            />
                        </div>

                        <span className="text-[13px] font-medium text-[#64748B]">
                            현재까지 사용
                        </span>
                    </div>

                    <span className="text-[14px] font-semibold text-[#475569]">
                        {formatAmount(
                            data.currentAmount
                        )}
                    </span>

                </div>

                {/* 게이지 */}

                <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#EEF0F3]">
                    <div
                        className="h-full rounded-full bg-[#6366F1] transition-all duration-700"
                        style={{
                            width: `${usagePercentage}%`,
                        }}
                    />
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#A5AEBB]">
                        예상 지출 대비
                    </span>

                    <span className="text-[11px] font-medium text-[#64748B]">
                        {usagePercentage.toFixed(1)}%
                    </span>
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
                            data.remainingExpectedAmount
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