import { useEffect, useState } from "react";
import {
    CalendarDays,
    ChevronRight,
    CreditCard,
    Check,
    X,
    Loader2,
    CircleAlert,
} from "lucide-react";

import api from "../../../api/api";

/* ============================================================
   API Response Type
============================================================ */

type BillingCycle = "MONTHLY" | "YEARLY";

interface Candidate {
    candidateId: number;
    merchant: string;
    transactionCount: number;
    averageAmount: number;
    billingCycle: BillingCycle;
    nextPaymentDate: string;
}

interface CandidateDetailTransaction {
    transactionId: number;
    date: string;
    amount: number;
}

interface CandidateDetail {
    candidateId: number;
    merchant: string;
    transactionCount: number;
    averageAmount: number;
    billingCycle: BillingCycle;
    nextPaymentDate: string;
    transactions: CandidateDetailTransaction[];
}

/* ============================================================
   Backend DTO
============================================================ */

interface GetCandidatesResponse {
    candidates: Candidate[];
}

/* ============================================================
   API Response Wrapper
============================================================ */

interface ApiResponse<T> {
    isSuccess: boolean;
    result: T;
    message?: string;
}

/* ============================================================
   Modal Type
============================================================ */

type SubscriptionModalType =
    | "CANDIDATE"
    | "CONFIRMED"
    | "DISMISSED";

/* ============================================================
   Component
============================================================ */

export default function SubscriptionSection() {
    /* ============================================================
       State
    ============================================================ */

    // 정기결제 후보
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    // 현재 정기결제
    const [confirmedSubscriptions, setConfirmedSubscriptions] =
        useState<Candidate[]>([]);

    // 정기결제로 등록하지 않은 결제
    const [dismissedSubscriptions, setDismissedSubscriptions] =
        useState<Candidate[]>([]);

    // 상세 모달
    const [selectedCandidate, setSelectedCandidate] =
        useState<CandidateDetail | null>(null);

    // 현재 어떤 리스트에서 모달을 열었는지
    const [modalType, setModalType] =
        useState<SubscriptionModalType>("CANDIDATE");

    // 전체 초기 로딩
    const [loading, setLoading] = useState(true);

    // 상세 조회 로딩
    const [detailLoading, setDetailLoading] = useState(false);

    // 등록 / 미등록 처리 로딩
    const [actionLoading, setActionLoading] = useState(false);

    /* ============================================================
       정기결제 후보 조회

       GET /api/settings/candidates
    ============================================================ */

    const fetchCandidates = async () => {
        try {
            const response =
                await api.get<ApiResponse<GetCandidatesResponse>>(
                    "/api/settings/candidates"
                );

            console.log(
                "정기결제 후보 조회:",
                response.data
            );

            if (response.data.isSuccess) {
                setCandidates(
                    response.data.result?.candidates ?? []
                );
            } else {
                setCandidates([]);
            }
        } catch (error) {
            console.error(
                "정기결제 후보 조회 실패:",
                error
            );

            setCandidates([]);
        }
    };

    /* ============================================================
       현재 정기결제 조회

       GET /api/settings/subscriptions
    ============================================================ */

    const fetchConfirmedSubscriptions = async () => {
        try {
            const response =
                await api.get<ApiResponse<GetCandidatesResponse>>(
                    "/api/settings/subscriptions"
                );

            console.log(
                "현재 정기결제 조회:",
                response.data
            );

            if (response.data.isSuccess) {
                setConfirmedSubscriptions(
                    response.data.result?.candidates ?? []
                );
            } else {
                setConfirmedSubscriptions([]);
            }
        } catch (error) {
            console.error(
                "현재 정기결제 조회 실패:",
                error
            );

            setConfirmedSubscriptions([]);
        }
    };

    /* ============================================================
       정기결제 미등록 조회

       GET /api/settings/subscriptions/dismissed
    ============================================================ */

    const fetchDismissedSubscriptions = async () => {
        try {
            const response =
                await api.get<ApiResponse<GetCandidatesResponse>>(
                    "/api/settings/subscriptions/dismissed"
                );

            console.log(
                "정기결제 미등록 조회:",
                response.data
            );

            if (response.data.isSuccess) {
                setDismissedSubscriptions(
                    response.data.result?.candidates ?? []
                );
            } else {
                setDismissedSubscriptions([]);
            }
        } catch (error) {
            console.error(
                "정기결제 미등록 조회 실패:",
                error
            );

            setDismissedSubscriptions([]);
        }
    };

    /* ============================================================
       정기결제 관련 전체 데이터 조회
    ============================================================ */

    const refreshSubscriptionData = async () => {
        try {
            setLoading(true);

            await Promise.all([
                fetchCandidates(),
                fetchConfirmedSubscriptions(),
                fetchDismissedSubscriptions(),
            ]);
        } catch (error) {
            console.error(
                "정기결제 데이터 조회 실패:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /* ============================================================
       최초 조회
    ============================================================ */

    useEffect(() => {
        refreshSubscriptionData();
    }, []);

    /* ============================================================
       상세 조회

       후보 / 현재 정기결제 / 미등록 결제
       모두 동일한 상세 API 사용

       GET /api/settings/candidates/{candidateId}/transactions

       ※ 백엔드에서 PENDING / CONFIRMED / DISMISSED
          모두 허용해야 함
    ============================================================ */

    const handleSubscriptionClick = async (
        candidateId: number,
        type: SubscriptionModalType
    ) => {
        try {
            setDetailLoading(true);

            setModalType(type);

            const response =
                await api.get<ApiResponse<CandidateDetail>>(
                    `/api/settings/candidates/${candidateId}/transactions`
                );

            console.log(
                "정기결제 상세 조회:",
                response.data
            );

            if (response.data.isSuccess) {
                setSelectedCandidate(
                    response.data.result
                );
            } else {
                console.error(
                    "정기결제 상세 조회 실패:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error(
                "정기결제 상세 조회 실패:",
                error
            );
        } finally {
            setDetailLoading(false);
        }
    };

    /* ============================================================
       Modal 닫기
    ============================================================ */

    const handleCloseModal = () => {
        if (actionLoading) {
            return;
        }

        setSelectedCandidate(null);
    };

    /* ============================================================
       정기결제로 등록

       PENDING -> CONFIRMED
       DISMISSED -> CONFIRMED

       PATCH /api/settings/candidates/{candidateId}
    ============================================================ */

    const handleConfirm = async () => {
        if (!selectedCandidate) {
            return;
        }

        try {
            setActionLoading(true);

            const candidateId =
                selectedCandidate.candidateId;

            const response =
                await api.patch<ApiResponse<unknown>>(
                    `/api/settings/candidates/${candidateId}`
                );

            console.log(
                "정기결제 등록:",
                response.data
            );

            if (response.data.isSuccess) {
                setSelectedCandidate(null);

                // 상태 변경 후 모든 리스트 새로 조회
                await Promise.all([
                    fetchCandidates(),
                    fetchConfirmedSubscriptions(),
                    fetchDismissedSubscriptions(),
                ]);
            } else {
                console.error(
                    "정기결제 등록 실패:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error(
                "정기결제 등록 실패:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ============================================================
       정기결제로 등록하지 않음

       PENDING -> DISMISSED
       CONFIRMED -> DISMISSED

       PATCH /api/settings/candidates/{candidateId}/dismiss
    ============================================================ */

    const handleDismiss = async () => {
        if (!selectedCandidate) {
            return;
        }

        try {
            setActionLoading(true);

            const candidateId =
                selectedCandidate.candidateId;

            const response =
                await api.patch<ApiResponse<unknown>>(
                    `/api/settings/candidates/${candidateId}/dismiss`
                );

            console.log(
                "정기결제 미등록:",
                response.data
            );

            if (response.data.isSuccess) {
                setSelectedCandidate(null);

                // 상태 변경 후 모든 리스트 새로 조회
                await Promise.all([
                    fetchCandidates(),
                    fetchConfirmedSubscriptions(),
                    fetchDismissedSubscriptions(),
                ]);
            } else {
                console.error(
                    "정기결제 미등록 실패:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error(
                "정기결제 미등록 처리 실패:",
                error
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* ============================================================
       Billing Cycle 표시
    ============================================================ */

    const getBillingCycleText = (
        billingCycle: BillingCycle
    ) => {
        if (billingCycle === "MONTHLY") {
            return "월간";
        }

        return "연간";
    };

    /* ============================================================
       날짜 표시
    ============================================================ */

    const formatDate = (date: string) => {
        if (!date) {
            return "-";
        }

        const [year, month, day] =
            date.split("-");

        return `${year}년 ${Number(month)}월 ${Number(day)}일`;
    };

    /* ============================================================
       후보 월 예상 금액
    ============================================================ */

    const candidateMonthlyAmount = candidates
        .filter(
            (candidate) =>
                candidate.billingCycle === "MONTHLY"
        )
        .reduce(
            (total, candidate) =>
                total + candidate.averageAmount,
            0
        );

    /* ============================================================
       현재 정기결제 월 예상 금액
    ============================================================ */

    const confirmedMonthlyAmount =
        confirmedSubscriptions
            .filter(
                (subscription) =>
                    subscription.billingCycle === "MONTHLY"
            )
            .reduce(
                (total, subscription) =>
                    total + subscription.averageAmount,
                0
            );

    /* ============================================================
       Loading
    ============================================================ */

    if (loading) {
        return (
            <section className="rounded-2xl border border-[#E9EDF3] bg-white">
                <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-2 text-sm text-[#7B8494]">
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        정기결제 후보 정보를 불러오는 중...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* ======================================================
                Subscription Candidate Section
            ====================================================== */}

            <section className="rounded-2xl border border-[#E9EDF3] bg-white">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <CreditCard
                                size={20}
                                className="text-[#2161F5]"
                            />

                            <h2 className="text-[17px] font-bold text-[#172033]">
                                정기결제 후보
                            </h2>
                        </div>

                        <p className="mt-1 text-[13px] text-[#9AA5B5]">
                            반복적으로 발생하는 결제를 확인하고
                            정기결제로 관리하세요.
                        </p>
                    </div>
                </div>

                {/* Summary */}

                <div className="grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-2">

                    <div className="rounded-xl bg-[#F5F8FF] px-4 py-4">
                        <p className="text-xs font-medium text-[#7B8494]">
                            정기결제 후보
                        </p>

                        <p className="mt-1 text-[20px] font-bold text-[#2161F5]">
                            {candidates.length}건
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#F8FAFC] px-4 py-4">
                        <p className="text-xs font-medium text-[#7B8494]">
                            월 예상 결제금액
                        </p>

                        <p className="mt-1 text-[20px] font-bold text-[#172033]">
                            ₩
                            {candidateMonthlyAmount.toLocaleString()}
                        </p>
                    </div>

                </div>

                {/* Candidate Description */}

                {candidates.length > 0 && (
                    <div className="mx-6 mb-4 flex items-start gap-2 rounded-xl bg-[#F8FAFC] px-4 py-3">
                        <CircleAlert
                            size={16}
                            className="mt-0.5 shrink-0 text-[#7B8494]"
                        />

                        <p className="text-xs leading-5 text-[#7B8494]">
                            최근 거래내역에서 반복적인 결제 패턴이
                            발견된 항목입니다.
                            <br />
                            실제 정기결제인지 확인한 후 등록할 수 있습니다.
                        </p>
                    </div>
                )}

                {/* Candidate List */}

                <div className="px-6 pb-6">
                    <div className="flex flex-col gap-3">

                        {candidates.length > 0 ? (
                            candidates.map(
                                (candidate) => (
                                    <button
                                        key={
                                            candidate.candidateId
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSubscriptionClick(
                                                candidate.candidateId,
                                                "CANDIDATE"
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-xl
                                            border
                                            border-[#E9EDF3]
                                            bg-white
                                            px-4
                                            py-4
                                            text-left
                                            transition-colors
                                            hover:bg-[#FAFBFC]
                                        "
                                    >
                                        <div className="flex items-center gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-[#F1F6FF]
                                                "
                                            >
                                                <CreditCard
                                                    size={20}
                                                    className="text-[#2161F5]"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">

                                                    <h3 className="text-[15px] font-semibold text-[#1F2937]">
                                                        {
                                                            candidate.merchant
                                                        }
                                                    </h3>

                                                    <span
                                                        className="
                                                            rounded-md
                                                            bg-[#FFF7ED]
                                                            px-2
                                                            py-1
                                                            text-[11px]
                                                            font-medium
                                                            text-[#EA580C]
                                                        "
                                                    >
                                                        확인 필요
                                                    </span>

                                                </div>

                                                <p className="mt-1 text-xs text-[#9AA5B5]">
                                                    최근{" "}
                                                    {
                                                        candidate.transactionCount
                                                    }
                                                    회 결제 ·{" "}
                                                    {getBillingCycleText(
                                                        candidate.billingCycle
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">

                                            <div className="hidden text-right sm:block">
                                                <p className="text-[15px] font-bold text-[#172033]">
                                                    ₩
                                                    {candidate.averageAmount.toLocaleString()}
                                                </p>

                                                <p className="mt-1 text-xs text-[#9AA5B5]">
                                                    평균 결제금액
                                                </p>
                                            </div>

                                            <div className="hidden items-center gap-1 text-right md:flex">
                                                <CalendarDays
                                                    size={14}
                                                    className="text-[#9AA5B5]"
                                                />

                                                <span className="text-xs text-[#7B8494]">
                                                    다음{" "}
                                                    {formatDate(
                                                        candidate.nextPaymentDate
                                                    )}
                                                </span>
                                            </div>

                                            <ChevronRight
                                                size={18}
                                                className="text-[#CBD1DA]"
                                            />

                                        </div>
                                    </button>
                                )
                            )
                        ) : (
                            <div className="rounded-xl border border-dashed border-[#DDE3EA] py-12 text-center">

                                <CreditCard
                                    size={30}
                                    className="mx-auto text-[#CBD1DA]"
                                />

                                <p className="mt-3 text-sm font-medium text-[#64748B]">
                                    정기결제 후보가 없습니다.
                                </p>

                                <p className="mt-1 text-xs text-[#9AA5B5]">
                                    반복적인 결제 내역이 발견되면
                                    이곳에 표시됩니다.
                                </p>

                            </div>
                        )}

                    </div>
                </div>
            </section>


            {/* ======================================================
                Registered + Dismissed Subscriptions
            ====================================================== */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* ======================================================
                    Registered Subscriptions
                ====================================================== */}

                <section className="rounded-2xl border border-[#E9EDF3] bg-white">

                    <div className="border-b border-[#EEF1F5] px-6 py-5">

                        <div className="flex items-center gap-2">

                            <Check
                                size={20}
                                className="text-[#16A34A]"
                            />

                            <h2 className="text-[17px] font-bold text-[#172033]">
                                현재 정기결제
                            </h2>

                        </div>

                        <p className="mt-1 text-[13px] text-[#9AA5B5]">
                            정기결제로 등록한 결제 내역입니다.
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3 px-6 py-5">

                        <div className="rounded-xl bg-[#F5F8FF] px-4 py-4">

                            <p className="text-xs font-medium text-[#7B8494]">
                                정기결제
                            </p>

                            <p className="mt-1 text-[20px] font-bold text-[#2161F5]">
                                {confirmedSubscriptions.length}건
                            </p>

                        </div>

                        <div className="rounded-xl bg-[#F8FAFC] px-4 py-4">

                            <p className="text-xs font-medium text-[#7B8494]">
                                월 예상 결제금액
                            </p>

                            <p className="mt-1 text-[20px] font-bold text-[#172033]">
                                ₩
                                {confirmedMonthlyAmount.toLocaleString()}
                            </p>

                        </div>

                    </div>

                    <div className="px-6 pb-6">

                        {confirmedSubscriptions.length > 0 ? (

                            <div className="flex flex-col gap-3">

                                {confirmedSubscriptions.map(
                                    (subscription) => (

                                        <button
                                            key={
                                                subscription.candidateId
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSubscriptionClick(
                                                    subscription.candidateId,
                                                    "CONFIRMED"
                                                )
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-[#E9EDF3]
                                                bg-white
                                                px-4
                                                py-4
                                                text-left
                                                transition-colors
                                                hover:bg-[#FAFBFC]
                                            "
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#ECFDF3]
                                                    "
                                                >

                                                    <CreditCard
                                                        size={20}
                                                        className="text-[#16A34A]"
                                                    />

                                                </div>

                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <h3 className="text-[15px] font-semibold text-[#1F2937]">
                                                            {
                                                                subscription.merchant
                                                            }
                                                        </h3>

                                                        <span
                                                            className="
                                                                rounded-md
                                                                bg-[#ECFDF3]
                                                                px-2
                                                                py-1
                                                                text-[11px]
                                                                font-medium
                                                                text-[#16A34A]
                                                            "
                                                        >
                                                            정기결제
                                                        </span>

                                                    </div>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-[#9AA5B5]
                                                        "
                                                    >
                                                        {getBillingCycleText(
                                                            subscription.billingCycle
                                                        )}

                                                        {" · "}

                                                        평균 ₩
                                                        {subscription.averageAmount.toLocaleString()}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <div className="hidden text-right sm:block">

                                                    <p
                                                        className="
                                                            text-[15px]
                                                            font-bold
                                                            text-[#172033]
                                                        "
                                                    >
                                                        ₩
                                                        {subscription.averageAmount.toLocaleString()}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-[#9AA5B5]
                                                        "
                                                    >
                                                        다음 결제{" "}
                                                        {formatDate(
                                                            subscription.nextPaymentDate
                                                        )}
                                                    </p>

                                                </div>

                                                <ChevronRight
                                                    size={18}
                                                    className="text-[#CBD1DA]"
                                                />

                                            </div>

                                        </button>
                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-[#DDE3EA]
                                    py-10
                                    text-center
                                "
                            >

                                <CreditCard
                                    size={28}
                                    className="mx-auto text-[#CBD1DA]"
                                />

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        font-medium
                                        text-[#64748B]
                                    "
                                >
                                    등록된 정기결제가 없습니다.
                                </p>

                            </div>

                        )}

                    </div>

                </section>


                {/* ======================================================
                    Dismissed Subscriptions
                ====================================================== */}

                <section className="rounded-2xl border border-[#E9EDF3] bg-white">

                    <div className="border-b border-[#EEF1F5] px-6 py-5">

                        <div className="flex items-center gap-2">

                            <X
                                size={20}
                                className="text-[#94A3B8]"
                            />

                            <h2 className="text-[17px] font-bold text-[#172033]">
                                등록하지 않은 결제
                            </h2>

                        </div>

                        <p className="mt-1 text-[13px] text-[#9AA5B5]">
                            정기결제가 아니라고 판단한 결제 내역입니다.
                        </p>

                    </div>

                    <div className="px-6 py-5">

                        {dismissedSubscriptions.length > 0 ? (

                            <div className="flex flex-col gap-3">

                                {dismissedSubscriptions.map(
                                    (subscription) => (

                                        <button
                                            key={
                                                subscription.candidateId
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSubscriptionClick(
                                                    subscription.candidateId,
                                                    "DISMISSED"
                                                )
                                            }
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-[#E9EDF3]
                                                bg-[#FAFBFC]
                                                px-4
                                                py-4
                                                text-left
                                                transition-colors
                                                hover:bg-[#F5F7FA]
                                            "
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        flex
                                                        h-11
                                                        w-11
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#F1F3F5]
                                                    "
                                                >

                                                    <X
                                                        size={20}
                                                        className="text-[#94A3B8]"
                                                    />

                                                </div>

                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <h3
                                                            className="
                                                                text-[15px]
                                                                font-semibold
                                                                text-[#374151]
                                                            "
                                                        >
                                                            {
                                                                subscription.merchant
                                                            }
                                                        </h3>

                                                        <span
                                                            className="
                                                                rounded-md
                                                                bg-[#F1F5F9]
                                                                px-2
                                                                py-1
                                                                text-[11px]
                                                                font-medium
                                                                text-[#64748B]
                                                            "
                                                        >
                                                            미등록
                                                        </span>

                                                    </div>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-[#9AA5B5]
                                                        "
                                                    >
                                                        최근{" "}
                                                        {
                                                            subscription.transactionCount
                                                        }
                                                        회 결제
                                                        {" · "}
                                                        평균 ₩
                                                        {subscription.averageAmount.toLocaleString()}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-3">

                                                <div className="hidden text-right sm:block">

                                                    <p
                                                        className="
                                                            text-[14px]
                                                            font-semibold
                                                            text-[#64748B]
                                                        "
                                                    >
                                                        {getBillingCycleText(
                                                            subscription.billingCycle
                                                        )}
                                                    </p>

                                                </div>

                                                <ChevronRight
                                                    size={18}
                                                    className="text-[#CBD1DA]"
                                                />

                                            </div>

                                        </button>

                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-[#DDE3EA]
                                    py-10
                                    text-center
                                "
                            >

                                <X
                                    size={28}
                                    className="mx-auto text-[#CBD1DA]"
                                />

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        font-medium
                                        text-[#64748B]
                                    "
                                >
                                    등록하지 않은 결제가 없습니다.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            </div>


            {/* ======================================================
                Subscription Detail Modal
            ====================================================== */}

            {selectedCandidate && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/35
                        px-4
                        backdrop-blur-[5px]
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseModal();
                        }

                    }}
                >

                    <div
                        className="
                            w-full
                            max-w-[500px]
                            overflow-hidden
                            rounded-[18px]
                            bg-white
                            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                        "
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* ==================================================
                            Modal Header
                        ================================================== */}

                        <div
                            className="
                                flex
                                h-[78px]
                                items-center
                                justify-between
                                border-b
                                border-[#EEF1F5]
                                px-6
                            "
                        >

                            <div>

                                <div className="flex items-center gap-2">

                                    <h2 className="text-[18px] font-bold text-[#172033]">
                                        {
                                            selectedCandidate.merchant
                                        }
                                    </h2>

                                    {/* 후보 */}

                                    {modalType === "CANDIDATE" && (
                                        <span
                                            className="
                                                rounded-md
                                                bg-[#FFF7ED]
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-[#EA580C]
                                            "
                                        >
                                            확인 필요
                                        </span>
                                    )}

                                    {/* 현재 정기결제 */}

                                    {modalType === "CONFIRMED" && (
                                        <span
                                            className="
                                                rounded-md
                                                bg-[#ECFDF3]
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-[#16A34A]
                                            "
                                        >
                                            정기결제
                                        </span>
                                    )}

                                    {/* 미등록 */}

                                    {modalType === "DISMISSED" && (
                                        <span
                                            className="
                                                rounded-md
                                                bg-[#F1F5F9]
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-[#64748B]
                                            "
                                        >
                                            미등록
                                        </span>
                                    )}

                                </div>

                                <p className="mt-1 text-xs text-[#9AA5B5]">

                                    {modalType === "CANDIDATE" &&
                                        "정기결제 여부를 확인해주세요."
                                    }

                                    {modalType === "CONFIRMED" &&
                                        "현재 정기결제로 등록된 결제입니다."
                                    }

                                    {modalType === "DISMISSED" &&
                                        "정기결제로 등록하지 않은 결제입니다."
                                    }

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                                disabled={actionLoading}
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-[#7B8494]
                                    transition-colors
                                    hover:bg-[#F5F7FA]
                                    hover:text-[#172033]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <X size={19} />
                            </button>

                        </div>


                        {/* ==================================================
                            Candidate Info
                        ================================================== */}

                        <div className="px-6 py-5">

                            <div className="grid grid-cols-2 gap-3">

                                {/* 평균 금액 */}

                                <div className="rounded-xl bg-[#F5F8FF] px-4 py-3">

                                    <p className="text-xs text-[#7B8494]">
                                        평균 결제금액
                                    </p>

                                    <p className="mt-1 text-[17px] font-bold text-[#2161F5]">
                                        ₩
                                        {selectedCandidate.averageAmount.toLocaleString()}
                                    </p>

                                </div>


                                {/* 결제 주기 */}

                                <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">

                                    <p className="text-xs text-[#7B8494]">
                                        예상 결제 주기
                                    </p>

                                    <p className="mt-1 text-[15px] font-bold text-[#172033]">
                                        {getBillingCycleText(
                                            selectedCandidate.billingCycle
                                        )}
                                    </p>

                                </div>


                                {/* 거래 횟수 */}

                                <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">

                                    <p className="text-xs text-[#7B8494]">
                                        반복 결제 횟수
                                    </p>

                                    <p className="mt-1 text-[15px] font-bold text-[#172033]">
                                        {
                                            selectedCandidate.transactionCount
                                        }
                                        회
                                    </p>

                                </div>


                                {/* 다음 결제일 */}

                                <div className="rounded-xl bg-[#F8FAFC] px-4 py-3">

                                    <p className="text-xs text-[#7B8494]">
                                        예상 다음 결제일
                                    </p>

                                    <p className="mt-1 text-[13px] font-bold text-[#172033]">
                                        {formatDate(
                                            selectedCandidate.nextPaymentDate
                                        )}
                                    </p>

                                </div>

                            </div>


                            {/* ==================================================
                                Payment History
                            ================================================== */}

                            <div className="mt-6">

                                <div className="mb-3 flex items-center justify-between">

                                    <h3 className="text-[14px] font-bold text-[#172033]">
                                        반복 결제 내역
                                    </h3>

                                    <span className="text-xs text-[#9AA5B5]">
                                        최근{" "}
                                        {
                                            selectedCandidate
                                                .transactions
                                                .length
                                        }
                                        건
                                    </span>

                                </div>

                                <div className="max-h-[280px] overflow-y-auto rounded-xl border border-[#EEF1F5] px-4">

                                    <div className="flex flex-col">

                                        {selectedCandidate.transactions.length >
                                            0 ? (

                                            selectedCandidate.transactions.map(
                                                (
                                                    transaction,
                                                    index
                                                ) => (

                                                    <div
                                                        key={
                                                            transaction.transactionId
                                                        }
                                                        className={`
                                                            flex
                                                            items-center
                                                            justify-between
                                                            py-3
                                                            ${index !==
                                                                selectedCandidate
                                                                    .transactions
                                                                    .length -
                                                                1
                                                                ? "border-b border-[#EEF1F5]"
                                                                : ""
                                                            }
                                                        `}
                                                    >

                                                        <div className="flex items-center gap-3">

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    bg-[#F5F8FF]
                                                                "
                                                            >

                                                                <CalendarDays
                                                                    size={16}
                                                                    className="text-[#2161F5]"
                                                                />

                                                            </div>

                                                            <div>

                                                                <p className="text-[13px] font-medium text-[#374151]">
                                                                    {formatDate(
                                                                        transaction.date
                                                                    )}
                                                                </p>

                                                                <p className="mt-0.5 text-[11px] text-[#9AA5B5]">
                                                                    거래내역
                                                                </p>

                                                            </div>

                                                        </div>

                                                        <p className="text-[14px] font-bold text-[#172033]">
                                                            ₩
                                                            {transaction.amount.toLocaleString()}
                                                        </p>

                                                    </div>

                                                )
                                            )

                                        ) : (

                                            <div className="py-8 text-center">

                                                <p className="text-sm text-[#9AA5B5]">
                                                    반복 결제 내역이 없습니다.
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* ==================================================
                                상태별 안내
                            ================================================== */}

                            {modalType === "CANDIDATE" && (
                                <div className="mt-4 rounded-xl bg-[#F5F8FF] px-4 py-3">

                                    <p className="text-xs leading-5 text-[#64748B]">

                                        위 거래내역을 기준으로{" "}

                                        <span className="font-semibold text-[#2161F5]">
                                            {
                                                selectedCandidate.merchant
                                            }
                                        </span>

                                        의 결제가{" "}

                                        <span className="font-semibold">
                                            {getBillingCycleText(
                                                selectedCandidate.billingCycle
                                            )}
                                        </span>

                                        으로 반복되고 있습니다.

                                        <br />

                                        실제 정기결제라면 등록해주세요.

                                    </p>

                                </div>
                            )}

                            {modalType === "CONFIRMED" && (
                                <div className="mt-4 rounded-xl bg-[#ECFDF3] px-4 py-3">

                                    <p className="text-xs leading-5 text-[#64748B]">

                                        <span className="font-semibold text-[#16A34A]">
                                            {
                                                selectedCandidate.merchant
                                            }
                                        </span>

                                        은 현재 정기결제로 등록되어 있습니다.

                                        <br />

                                        {getBillingCycleText(
                                            selectedCandidate.billingCycle
                                        )}
                                        결제로 관리되고 있습니다.

                                    </p>

                                </div>
                            )}

                            {modalType === "DISMISSED" && (
                                <div className="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-3">

                                    <p className="text-xs leading-5 text-[#64748B]">

                                        <span className="font-semibold text-[#64748B]">
                                            {
                                                selectedCandidate.merchant
                                            }
                                        </span>

                                        은 정기결제로 등록하지 않은 결제입니다.

                                        <br />

                                        필요하다면 정기결제로 등록할 수 있습니다.

                                    </p>

                                </div>
                            )}

                        </div>


                        {/* ==================================================
                            Modal Footer
                        ================================================== */}

                        <div className="border-t border-[#EEF1F5] px-6 py-4">

                            {/* ==================================================
                                후보
                            ================================================== */}

                            {modalType === "CANDIDATE" && (

                                <div className="grid grid-cols-2 gap-3">

                                    {/* 미등록 */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleDismiss
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        className="
                                            flex
                                            h-[46px]
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-[#E1E5EB]
                                            bg-white
                                            text-[14px]
                                            font-semibold
                                            text-[#64748B]
                                            transition-colors
                                            hover:bg-[#F8FAFC]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {actionLoading ? (

                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <X size={17} />

                                        )}

                                        정기결제 아님

                                    </button>


                                    {/* 등록 */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleConfirm
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        className="
                                            flex
                                            h-[46px]
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            bg-[#2161F5]
                                            text-[14px]
                                            font-semibold
                                            text-white
                                            transition-colors
                                            hover:bg-[#1553DE]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {actionLoading ? (

                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <Check size={17} />

                                        )}

                                        정기결제로 등록

                                    </button>

                                </div>

                            )}


                            {/* ==================================================
                                현재 정기결제

                                기존에는 "현재 정기결제로 등록됨"만 있었지만
                                이제 "정기결제 아님"으로 변경 가능
                            ================================================== */}

                            {modalType === "CONFIRMED" && (

                                <div className="grid grid-cols-2 gap-3">

                                    {/* 닫기 */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseModal
                                        }
                                        disabled={actionLoading}
                                        className="
                                            flex
                                            h-[46px]
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-[#E1E5EB]
                                            bg-white
                                            text-[14px]
                                            font-semibold
                                            text-[#64748B]
                                            transition-colors
                                            hover:bg-[#F8FAFC]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        닫기

                                    </button>


                                    {/* 정기결제 해제 */}

                                    <button
                                        type="button"
                                        onClick={
                                            handleDismiss
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                        className="
                                            flex
                                            h-[46px]
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            bg-[#64748B]
                                            text-[14px]
                                            font-semibold
                                            text-white
                                            transition-colors
                                            hover:bg-[#475569]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {actionLoading ? (

                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <X size={17} />

                                        )}

                                        정기결제 아님

                                    </button>

                                </div>

                            )}


                            {/* ==================================================
                                미등록

                                DISMISSED -> CONFIRMED
                            ================================================== */}

                            {modalType === "DISMISSED" && (

                                <button
                                    type="button"
                                    onClick={
                                        handleConfirm
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        flex
                                        h-[46px]
                                        w-full
                                        items-center
                                        justify-center
                                        gap-1.5
                                        rounded-xl
                                        bg-[#2161F5]
                                        text-[14px]
                                        font-semibold
                                        text-white
                                        transition-colors
                                        hover:bg-[#1553DE]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {actionLoading ? (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Check size={17} />

                                    )}

                                    정기결제로 등록

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ======================================================
                Detail Loading Modal
            ====================================================== */}

            {detailLoading && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[110]
                        flex
                        items-center
                        justify-center
                        bg-black/20
                        backdrop-blur-[2px]
                    "
                >

                    <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-4 shadow-lg">

                        <Loader2
                            size={18}
                            className="animate-spin text-[#2161F5]"
                        />

                        <span className="text-sm font-medium text-[#64748B]">
                            결제 내역을 불러오는 중...
                        </span>

                    </div>

                </div>

            )}

        </>
    );
}