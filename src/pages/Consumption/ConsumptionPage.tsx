import { useEffect, useState } from "react";
import {
  BookOpen,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Film,
  Gift,
  Heart,
  House,
  Landmark,
  Package,
  PawPrint,
  Search,
  ShoppingCart,
  Utensils,
  Wallet,
  X,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/api";

import SummaryCard from "../Home/components/SummaryCard";

// ============================================================
// 카테고리 타입
// ============================================================

interface Category {
  id: number;
  name: string;
}

// ============================================================
// 카테고리 목록
// ============================================================

const CATEGORIES: Category[] = [
  { id: 1, name: "식비" },
  { id: 2, name: "쇼핑/생활" },
  { id: 3, name: "교통" },
  { id: 4, name: "주거/통신" },
  { id: 5, name: "여가/문화" },
  { id: 6, name: "의료/건강" },
  { id: 7, name: "교육" },
  { id: 8, name: "여행" },
  { id: 9, name: "금융" },
  { id: 10, name: "선물/경조사" },
  { id: 11, name: "반려동물" },
  { id: 12, name: "기타" },
];

// ============================================================
// 카테고리 아이콘
// ============================================================

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  식비: <Utensils size={18} />,
  "쇼핑/생활": <ShoppingCart size={18} />,
  교통: <Car size={18} />,
  "주거/통신": <House size={18} />,
  "여가/문화": <Film size={18} />,
  "의료/건강": <Heart size={18} />,
  교육: <BookOpen size={18} />,
  여행: <PlaneIcon />,
  금융: <Landmark size={18} />,
  "선물/경조사": <Gift size={18} />,
  반려동물: <PawPrint size={18} />,
  기타: <Package size={18} />,
};

// ============================================================
// 여행 아이콘
// ============================================================

function PlaneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.7 7 4-4 4-2.5-.5-1 1 4 2.5 2.5 4 1-1-.5-2.5 4-4 4 7 .7-.7c.4-.3.6-.8.5-1.3Z" />
    </svg>
  );
}

// ============================================================
// 카테고리 아이콘 색상
// ============================================================

const CATEGORY_ICON_COLORS: Record<string, string> = {
  식비: "#F97316",
  "쇼핑/생활": "#2161F5",
  교통: "#3B82F6",
  "주거/통신": "#10B981",
  "여가/문화": "#EC4899",
  "의료/건강": "#EF4444",
  교육: "#F59E0B",
  여행: "#14B8A6",
  금융: "#8B5CF6",
  "선물/경조사": "#A855F7",
  반려동물: "#84CC16",
  기타: "#64748B",
};

// ============================================================
// 백엔드 classificationType
// ============================================================

type ClassificationType =
  | "UNCLASSIFIED"
  | "KEYWORD"
  | "USER"
  | "LLM"
  | "UNCONFIRMED"
  | "MERCHANT";

// ============================================================
// 거래 타입
// ============================================================

interface ConsumptionTransaction {
  transactionId: number;

  merchant: string;

  amount: number;

  date: string;

  categoryId: number | null;

  categoryName: string | null;

  classificationType: ClassificationType;

  isAbnormal: boolean;
}

// ============================================================
// Consumption API Response
// ============================================================

interface ConsumptionResponse {
  year: number;
  month: number;

  totalAmount: number;
  transactionCount: number;

  abnormalCount?: number;
  uncategorizedCount?: number;

  transactions: ConsumptionTransaction[];

  // 페이징
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================
// Home Summary
// ============================================================

interface HomeSummary {
  year: number;
  month: number;

  totalExpense: number;

  budget: number;

  remainingBudget: number;

  budgetUsageRate: number;

  abnormalCount: number;

  uncategorizedCount: number;

  changeFromLastMonth: number;
}

// ============================================================
// API 공통 Response
// ============================================================

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// ============================================================
// Component
// ============================================================

export default function ConsumptionPage() {
  // ============================================================
  // 검색
  // ============================================================

  const [search, setSearch] = useState("");

  // ============================================================
  // 카테고리 필터
  // ============================================================

  const [selectedCategory, setSelectedCategory] =
    useState<string>("전체 카테고리");

  const [isCategoryOpen, setIsCategoryOpen] =
    useState(false);

  // ============================================================
  // 현재 선택된 월
  // ============================================================

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  // ============================================================
  // 페이징
  // ============================================================

  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 10;

  // ============================================================
  // Consumption Summary
  // ============================================================

  const [consumptionSummary, setConsumptionSummary] =
    useState<ConsumptionResponse | null>(null);

  const [transactionLoading, setTransactionLoading] =
    useState(false);

  // ============================================================
  // Home Summary
  //
  // 상단 SummaryCard는 이 값을 사용한다.
  // 검색 / 카테고리 필터와 관계없이
  // 해당 월 전체 기준이다.
  // ============================================================

  const [homeSummary, setHomeSummary] =
    useState<HomeSummary | null>(null);

  const [homeSummaryLoading, setHomeSummaryLoading] =
    useState(false);

  // ============================================================
  // 월 전체 거래 건수
  //
  // 필터와 관계없이 해당 월 전체 거래 건수
  // ============================================================

  const [totalTransactionCount, setTotalTransactionCount] =
    useState(0);

  const [
    totalTransactionCountLoading,
    setTotalTransactionCountLoading,
  ] = useState(false);

  // ============================================================
  // 거래 목록
  // ============================================================

  const [transactions, setTransactions] =
    useState<ConsumptionTransaction[]>([]);

  // ============================================================
  // 카테고리 수정 Modal
  // ============================================================

  const [selectedTransaction, setSelectedTransaction] =
    useState<ConsumptionTransaction | null>(null);

  const [modalCategoryId, setModalCategoryId] =
    useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================================
  // 카테고리 수정 저장 중
  // ============================================================

  const [categoryUpdating, setCategoryUpdating] =
    useState(false);

  // ============================================================
  // 현재 날짜에서 연 / 월 추출
  // ============================================================

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth() + 1;

  // ============================================================
  // Home Summary 조회
  //
  // /api/home
  // ============================================================

  useEffect(() => {
    const fetchHomeSummary = async () => {
      setHomeSummaryLoading(true);

      try {
        const response =
          await api.get<ApiResponse<HomeSummary>>(
            "/api/home",
            {
              params: {
                year,
                month,
              },
            }
          );

        console.log(
          `${year}년 ${month}월 홈 요약:`,
          response.data
        );

        if (!response.data.isSuccess) {
          throw new Error(
            response.data.message ||
            "홈 요약 조회에 실패했습니다."
          );
        }

        setHomeSummary(
          response.data.result
        );
      } catch (error: any) {
        console.error(
          "홈 요약 조회 실패:",
          error
        );

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setHomeSummary(null);
      } finally {
        setHomeSummaryLoading(false);
      }
    };

    fetchHomeSummary();
  }, [year, month]);

  // ============================================================
  // 월 전체 거래 건수 조회
  //
  // /api/consumption/search
  //
  // 검색 / 카테고리 필터를 적용하지 않고
  // 해당 월 전체 거래 건수만 조회한다.
  // ============================================================

  useEffect(() => {
    const fetchTotalTransactionCount = async () => {
      setTotalTransactionCountLoading(true);

      try {
        const response =
          await api.get<
            ApiResponse<ConsumptionResponse>
          >(
            "/api/consumption/search",
            {
              params: {
                year,
                month,

                // 필터 없음
                merchant: null,
                categoryId: null,

                // 첫 페이지
                page: 0,

                // 전체 건수만 필요하므로
                // 1건만 조회
                size: 1,
              },
            }
          );

        console.log(
          `${year}년 ${month}월 전체 거래 건수:`,
          response.data
        );

        if (!response.data.isSuccess) {
          throw new Error(
            response.data.message ||
            "전체 거래 건수 조회에 실패했습니다."
          );
        }

        setTotalTransactionCount(
          response.data.result.totalElements ?? 0
        );
      } catch (error: any) {
        console.error(
          "전체 거래 건수 조회 실패:",
          error
        );

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setTotalTransactionCount(0);
      } finally {
        setTotalTransactionCountLoading(false);
      }
    };

    fetchTotalTransactionCount();
  }, [year, month]);

  // ============================================================
  // Consumption 조회
  //
  // 검색 / 카테고리 필터를 적용한다.
  //
  // 분류 방식 필터는 제거됨.
  // ============================================================

  useEffect(() => {
    const fetchConsumption = async () => {
      setTransactionLoading(true);

      try {
        const selectedCategoryInfo =
          CATEGORIES.find(
            (category) =>
              category.name === selectedCategory
          );

        const categoryId =
          selectedCategoryInfo?.id ?? null;

        const response =
          await api.get<
            ApiResponse<ConsumptionResponse>
          >(
            "/api/consumption/search",
            {
              params: {
                year,
                month,

                merchant:
                  search.trim() || null,

                categoryId,

                page: currentPage,

                size: pageSize,
              },
            }
          );

        console.log(
          `${year}년 ${month}월 소비 검색:`,
          response.data
        );

        if (!response.data.isSuccess) {
          throw new Error(
            response.data.message ||
            "소비 내역 조회에 실패했습니다."
          );
        }

        const result =
          response.data.result;

        setConsumptionSummary(result);

        setTransactions(
          result.transactions ?? []
        );
      } catch (error: any) {
        console.error(
          "소비 내역 조회 실패:",
          error
        );

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        setConsumptionSummary(null);

        setTransactions([]);
      } finally {
        setTransactionLoading(false);
      }
    };

    fetchConsumption();
  }, [
    year,
    month,
    search,
    selectedCategory,
    currentPage,
  ]);

  // ============================================================
  // 검색어 변경
  // ============================================================

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);

    setCurrentPage(0);
  };

  // ============================================================
  // 이전 달
  // ============================================================

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const date = new Date(prev);

      date.setMonth(
        date.getMonth() - 1
      );

      return date;
    });

    setCurrentPage(0);

    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setIsCategoryOpen(false);
  };

  // ============================================================
  // 다음 달
  // ============================================================

  const handleNextMonth = () => {
    const today = new Date();

    const currentYear =
      today.getFullYear();

    const currentMonth =
      today.getMonth();

    setCurrentDate((prev) => {
      const nextDate = new Date(prev);

      nextDate.setMonth(
        nextDate.getMonth() + 1
      );

      if (
        nextDate.getFullYear() >
        currentYear ||
        (
          nextDate.getFullYear() ===
          currentYear &&
          nextDate.getMonth() >
          currentMonth
        )
      ) {
        return new Date(
          currentYear,
          currentMonth,
          1
        );
      }

      return nextDate;
    });

    setCurrentPage(0);

    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setIsCategoryOpen(false);
  };

  // ============================================================
  // 현재 달인지 확인
  // ============================================================

  const today = new Date();

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth() + 1;

  // ============================================================
  // 미분류 여부
  // ============================================================

  const isUnclassified = (
    type: ClassificationType
  ) => {
    return (
      type === "UNCLASSIFIED" ||
      type === "UNCONFIRMED"
    );
  };

  // ============================================================
  // 현재 페이지 거래
  // ============================================================

  const filteredTransactions =
    transactions;

  // ============================================================
  // 전체 거래 건수
  // ============================================================

  const transactionCount =
    totalTransactionCount;

  // ============================================================
  // 총 지출
  // ============================================================

  const totalExpense =
    homeSummary?.totalExpense ?? 0;

  // ============================================================
  // 이상 지출 건수
  // ============================================================

  const abnormalCount =
    homeSummary?.abnormalCount ?? 0;

  // ============================================================
  // 미분류 건수
  // ============================================================

  const uncategorizedCount =
    homeSummary?.uncategorizedCount ?? 0;

  // ============================================================
  // 날짜 포맷
  // ============================================================

  const formatDate = (
    date: string
  ) => {
    const transactionDate =
      new Date(date);

    return transactionDate.toLocaleDateString(
      "ko-KR",
      {
        month: "long",
        day: "numeric",
      }
    );
  };

  // ============================================================
  // 분류 방식 표시
  //
  // 필터는 제거했지만 거래별 분류 방식 표시는 유지한다.
  // ============================================================

  const getClassificationLabel = (
    type: ConsumptionTransaction[
      "classificationType"
    ]
  ) => {
    switch (type) {
      case "UNCLASSIFIED":
        return "미분류";

      case "UNCONFIRMED":
        return "미분류";

      case "KEYWORD":
        return "키워드 분류";

      case "USER":
        return "사용자 분류";

      case "LLM":
        return "AI 분류";

      case "MERCHANT":
        return "가맹점 분류";

      default:
        return "";
    }
  };

  // ============================================================
  // 카테고리 선택
  // ============================================================

  const handleCategorySelect = (
    category: string
  ) => {
    setSelectedCategory(category);

    setCurrentPage(0);

    setIsCategoryOpen(false);
  };

  // ============================================================
  // 활성 필터 여부
  // ============================================================

  const hasActiveFilter =
    selectedCategory !==
    "전체 카테고리" ||
    search.trim().length > 0;

  // ============================================================
  // 필터 초기화
  // ============================================================

  const handleResetFilters = () => {
    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setCurrentPage(0);
  };

  // ============================================================
  // 거래 클릭
  // ============================================================

  const handleTransactionClick = (
    transaction: ConsumptionTransaction
  ) => {
    setSelectedTransaction(
      transaction
    );

    setModalCategoryId(
      transaction.categoryId
    );

    setIsModalOpen(true);
  };

  // ============================================================
  // 모달 닫기
  // ============================================================

  const handleCloseModal = () => {
    if (categoryUpdating) {
      return;
    }

    setIsModalOpen(false);

    setSelectedTransaction(null);

    setModalCategoryId(null);
  };

  // ============================================================
  // 카테고리 수정 저장
  // ============================================================

  const handleSaveCategory = async () => {
    if (
      !selectedTransaction ||
      modalCategoryId === null
    ) {
      return;
    }

    setCategoryUpdating(true);

    try {
      console.log(
        "카테고리 수정 요청:",
        {
          transactionId:
            selectedTransaction.transactionId,

          categoryId:
            modalCategoryId,
        }
      );

      const response =
        await api.patch<
          ApiResponse<any>
        >(
          `/api/consumption/${selectedTransaction.transactionId}/category/${modalCategoryId}`
        );

      console.log(
        "카테고리 수정 응답:",
        response.data
      );

      if (
        response.data &&
        response.data.isSuccess === false
      ) {
        throw new Error(
          response.data.message ||
          "카테고리 수정에 실패했습니다."
        );
      }

      const selectedCategoryInfo =
        CATEGORIES.find(
          (category) =>
            category.id ===
            modalCategoryId
        );

      // ========================================================
      // 현재 화면 거래 수정
      // ========================================================

      setTransactions((prev) =>
        prev.map(
          (transaction) =>
            transaction.transactionId ===
              selectedTransaction.transactionId
              ? {
                ...transaction,

                categoryId:
                  modalCategoryId,

                categoryName:
                  selectedCategoryInfo?.name ??
                  transaction.categoryName,

                classificationType:
                  "USER",
              }
              : transaction
        )
      );

      // ========================================================
      // Consumption Summary 수정
      // ========================================================

      setConsumptionSummary(
        (prev) => {
          if (!prev) {
            return prev;
          }

          const wasUnclassified =
            isUnclassified(
              selectedTransaction.classificationType
            );

          return {
            ...prev,

            uncategorizedCount:
              wasUnclassified
                ? Math.max(
                  0,
                  (prev.uncategorizedCount ??
                    0) - 1
                )
                : prev.uncategorizedCount,

            transactions:
              prev.transactions?.map(
                (transaction) =>
                  transaction.transactionId ===
                    selectedTransaction.transactionId
                    ? {
                      ...transaction,

                      categoryId:
                        modalCategoryId,

                      categoryName:
                        selectedCategoryInfo?.name ??
                        transaction.categoryName,

                      classificationType:
                        "USER",
                    }
                    : transaction
              ),
          };
        }
      );

      // ========================================================
      // 홈 Summary 다시 조회
      // ========================================================

      try {
        const homeResponse =
          await api.get<
            ApiResponse<HomeSummary>
          >(
            "/api/home",
            {
              params: {
                year,
                month,
              },
            }
          );

        if (
          homeResponse.data.isSuccess
        ) {
          setHomeSummary(
            homeResponse.data.result
          );
        }
      } catch (homeError) {
        console.error(
          "홈 요약 갱신 실패:",
          homeError
        );
      }

      // ========================================================
      // 모달 닫기
      // ========================================================

      setIsModalOpen(false);

      setSelectedTransaction(null);

      setModalCategoryId(null);

      console.log(
        "카테고리 수정 성공"
      );
    } catch (error: any) {
      console.error(
        "카테고리 수정 실패:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ??
        error.message ??
        "카테고리 수정에 실패했습니다."
      );
    } finally {
      setCategoryUpdating(false);
    }
  };

  // ============================================================
  // 페이지 변경
  // ============================================================

  const handlePageChange = (
    page: number
  ) => {
    if (
      page < 0 ||
      page >=
      (consumptionSummary?.totalPages ??
        0)
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // 페이지 번호 생성
  // ============================================================

  const getPageNumbers = () => {
    const totalPages =
      consumptionSummary?.totalPages ?? 0;

    if (totalPages <= 0) {
      return [];
    }

    const pages: number[] = [];

    if (totalPages <= 7) {
      for (
        let i = 0;
        i < totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    let start = Math.max(
      0,
      currentPage - 2
    );

    let end = Math.min(
      totalPages - 1,
      currentPage + 2
    );

    if (currentPage <= 2) {
      start = 0;
      end = 4;
    }

    if (
      currentPage >=
      totalPages - 3
    ) {
      start = totalPages - 5;
      end = totalPages - 1;
    }

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <MainLayout activeMenu="소비 내역">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* ====================================================
            Header
        ==================================================== */}

        <header className="mb-7 flex items-start justify-between">
          <div>
            <h1
              className="
                text-[28px]
                font-bold
                tracking-tight
                text-[#172033]
              "
            >
              소비 내역
            </h1>

            <p
              className="
                mt-1
                text-[15px]
                text-[#9AA5B5]
              "
            >
              월별 거래 내역
            </p>
          </div>
        </header>

        {/* ====================================================
            Month Selector
        ==================================================== */}

        <section
          className="
            mb-6
            flex h-[104px]
            items-center
            justify-between
            rounded-2xl
            border border-[#E9EDF3]
            bg-white
            px-5
          "
        >
          <button
            type="button"
            onClick={handlePreviousMonth}
            className="
              flex h-11 w-11
              items-center
              justify-center
              rounded-xl
              border border-[#EEF1F5]
              text-[#CBD1DA]
              transition-colors
              hover:bg-[#F8FAFC]
              hover:text-[#2F6BEB]
            "
          >
            <ChevronLeft size={21} />
          </button>

          <div className="text-center">
            <h2
              className="
                text-[24px]
                font-bold
                text-[#182133]
              "
            >
              {year}년 {month}월
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-[#A1AAB8]
              "
            >
              {transactionLoading ||
                totalTransactionCountLoading
                ? "조회 중..."
                : `${transactionCount.toLocaleString()}건`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            className={`
              flex h-11 w-11
              items-center
              justify-center
              rounded-xl
              border border-[#EEF1F5]
              transition-colors

              ${isCurrentMonth
                ? "cursor-not-allowed text-[#E1E5EA]"
                : "text-[#CBD1DA] hover:bg-[#F8FAFC] hover:text-[#2F6BEB]"
              }
            `}
          >
            <ChevronRight size={21} />
          </button>
        </section>

        {/* ====================================================
            Summary Cards
        ==================================================== */}

        <section
          className="
            mb-6
            grid grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* 총 지출 */}

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="이 달 총 지출"
            value={
              homeSummaryLoading
                ? "조회 중..."
                : `₩${totalExpense.toLocaleString()}`
            }
            subText="전체 거래 기준"
            tone="blue"
          />

          {/* 거래 건수 */}

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="거래 건수"
            value={
              totalTransactionCountLoading
                ? "조회 중..."
                : `${transactionCount.toLocaleString()}건`
            }
            subText="전체 거래 기준"
            tone="green"
          />

          {/* 이상 지출 */}

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="이상 지출"
            value={
              homeSummaryLoading
                ? "조회 중..."
                : `${abnormalCount.toLocaleString()}건`
            }
            subText="전체 거래 기준"
            tone="red"
          />

          {/* 미분류 */}

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="미분류"
            value={
              homeSummaryLoading
                ? "조회 중..."
                : `${uncategorizedCount.toLocaleString()}건`
            }
            subText="전체 거래 기준"
            tone="yellow"
          />
        </section>

        {/* ====================================================
            Search / Filter
        ==================================================== */}

        <section
          className="
            relative
            z-20
            mb-6
            flex flex-col
            gap-3
            rounded-2xl
            border border-[#E9EDF3]
            bg-white
            p-4
            lg:flex-row
          "
        >
          {/* 검색 */}

          <div
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <Search
              size={20}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#A5AFBE]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder="가맹점 검색..."
              className="
                h-11
                w-full
                rounded-xl
                border border-[#E5EAF0]
                bg-white
                pl-11
                pr-4
                text-sm
                text-[#374151]
                outline-none
                placeholder:text-[#A5AFBE]
                focus:border-[#2F6BEB]
                focus:ring-2
                focus:ring-[#2F6BEB]/10
              "
            />
          </div>

          {/* ==================================================
              카테고리 필터
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen(
                  (prev) => !prev
                );
              }}
              className="
                flex h-11
                min-w-[160px]
                items-center
                justify-between
                gap-3
                rounded-xl
                border border-[#E5EAF0]
                bg-white
                px-4
                text-sm
                font-medium
                text-[#4B5563]
                transition-colors
                hover:bg-[#F8FAFC]
              "
            >
              <span>
                {selectedCategory}
              </span>

              <ChevronDown
                size={17}
                className={`
                  transition-transform
                  ${isCategoryOpen
                    ? "rotate-180"
                    : ""
                  }
                `}
              />
            </button>

            {isCategoryOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+8px)]
                  z-50
                  w-[190px]
                  max-h-[360px]
                  overflow-y-auto
                  rounded-xl
                  border border-[#E5EAF0]
                  bg-white
                  py-1
                  shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                "
              >
                {/* 전체 카테고리 */}

                <button
                  type="button"
                  onClick={() =>
                    handleCategorySelect(
                      "전체 카테고리"
                    )
                  }
                  className={`
                    w-full
                    px-4
                    py-2.5
                    text-left
                    text-sm
                    transition-colors
                    hover:bg-[#F8FAFC]

                    ${selectedCategory ===
                      "전체 카테고리"
                      ? "bg-[#F5F8FF] font-semibold text-[#2161F5]"
                      : "text-[#4B5563]"
                    }
                  `}
                >
                  전체 카테고리
                </button>

                {/* 카테고리 */}

                {CATEGORIES.map(
                  (category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        handleCategorySelect(
                          category.name
                        )
                      }
                      className={`
                        w-full
                        px-4
                        py-2.5
                        text-left
                        text-sm
                        transition-colors
                        hover:bg-[#F8FAFC]

                        ${selectedCategory ===
                          category.name
                          ? "bg-[#F5F8FF] font-semibold text-[#2161F5]"
                          : "text-[#4B5563]"
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* ====================================================
            선택된 필터
        ==================================================== */}

        {hasActiveFilter && (
          <div
            className="
              mb-4
              flex
              flex-wrap
              items-center
              gap-2
              text-sm
              text-[#6B7280]
            "
          >
            {/* 검색 필터 */}

            {search && (
              <span
                className="
                  rounded-lg
                  bg-[#F5F8FF]
                  px-3
                  py-1.5
                  font-medium
                  text-[#2161F5]
                "
              >
                검색: {search}
              </span>
            )}

            {/* 카테고리 필터 */}

            {selectedCategory !==
              "전체 카테고리" && (
                <span
                  className="
                  rounded-lg
                  bg-[#F0F5FF]
                  px-3
                  py-1.5
                  font-semibold
                  text-[#2161F5]
                "
                >
                  카테고리:{" "}
                  {selectedCategory}
                </span>
              )}

            {/* 전체 초기화 */}

            <button
              type="button"
              onClick={
                handleResetFilters
              }
              className="
                ml-1
                text-xs
                text-[#9AA5B5]
                hover:text-[#4B5563]
              "
            >
              전체 초기화
            </button>
          </div>
        )}

        {/* ====================================================
            Transactions
        ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-3
          "
        >
          {transactionLoading ? (
            <div
              className="
                rounded-2xl
                border border-[#E9EDF3]
                bg-white
                py-16
                text-center
              "
            >
              <p
                className="
                  text-sm
                  text-[#9AA5B5]
                "
              >
                거래 내역을 불러오는 중...
              </p>
            </div>
          ) : filteredTransactions.length >
            0 ? (
            filteredTransactions.map(
              (transaction) => (
                <button
                  key={
                    transaction.transactionId
                  }
                  type="button"
                  onClick={() =>
                    handleTransactionClick(
                      transaction
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-2xl
                    border border-[#E9EDF3]
                    bg-white
                    px-6
                    py-5
                    text-left
                    transition-colors
                    hover:bg-[#FAFBFC]
                  "
                >
                  {/* 왼쪽 */}

                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <h3
                        className="
                          font-semibold
                          text-[#1F2937]
                        "
                      >
                        {
                          transaction.merchant
                        }
                      </h3>

                      {transaction.isAbnormal && (
                        <span
                          className="
                            rounded-md
                            bg-[#FEF2F2]
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-[#F04444]
                          "
                        >
                          이상 지출
                        </span>
                      )}
                    </div>

                    <div
                      className="
                        mt-1
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          text-xs
                          text-[#9AA5B5]
                        "
                      >
                        {
                          transaction.categoryName ||
                          "미분류"
                        }
                      </span>

                      <span
                        className="
                          text-xs
                          text-[#D1D5DB]
                        "
                      >
                        •
                      </span>

                      <span
                        className="
                          text-xs
                          text-[#9AA5B5]
                        "
                      >
                        {formatDate(
                          transaction.date
                        )}
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽 */}

                  <div className="text-right">
                    <p
                      className="
                        text-[16px]
                        font-bold
                        text-[#172033]
                      "
                    >
                      ₩
                      {transaction.amount.toLocaleString()}
                    </p>

                    <p
                      className={`
                        mt-1
                        text-xs
                        ${isUnclassified(
                        transaction.classificationType
                      )
                          ? "font-medium text-[#F59E0B]"
                          : "text-[#9AA5B5]"
                        }
                      `}
                    >
                      {getClassificationLabel(
                        transaction.classificationType
                      )}
                    </p>
                  </div>
                </button>
              )
            )
          ) : (
            <div
              className="
                rounded-2xl
                border border-[#E9EDF3]
                bg-white
                py-16
                text-center
              "
            >
              <Search
                size={32}
                className="
                  mx-auto
                  text-[#CBD1DA]
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-[#9AA5B5]
                "
              >
                거래 내역이 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* ====================================================
            Pagination
        ==================================================== */}

        {!transactionLoading &&
          (consumptionSummary?.totalPages ??
            0) > 1 && (
            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {/* 이전 */}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
                disabled={
                  !consumptionSummary?.hasPrevious
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#E5EAF0]
                  bg-white
                  text-[#64748B]
                  transition-colors
                  hover:bg-[#F8FAFC]
                  disabled:cursor-not-allowed
                  disabled:text-[#D5DAE1]
                  disabled:hover:bg-white
                "
              >
                <ChevronLeft size={18} />
              </button>

              {/* 페이지 번호 */}

              {getPageNumbers().map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                    className={`
                      flex
                      h-10
                      min-w-10
                      items-center
                      justify-center
                      rounded-xl
                      px-3
                      text-sm
                      font-semibold
                      transition-colors

                      ${currentPage ===
                        page
                        ? "bg-[#2161F5] text-white shadow-[0_3px_10px_rgba(33,97,245,0.18)]"
                        : "border border-[#E5EAF0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                      }
                    `}
                  >
                    {page + 1}
                  </button>
                )
              )}

              {/* 다음 */}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
                disabled={
                  !consumptionSummary?.hasNext
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#E5EAF0]
                  bg-white
                  text-[#64748B]
                  transition-colors
                  hover:bg-[#F8FAFC]
                  disabled:cursor-not-allowed
                  disabled:text-[#D5DAE1]
                  disabled:hover:bg-white
                "
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

        {/* ====================================================
            현재 페이지 정보
        ==================================================== */}

        {!transactionLoading &&
          consumptionSummary &&
          consumptionSummary.totalPages >
          0 && (
            <p
              className="
                mt-3
                text-center
                text-xs
                text-[#9AA5B5]
              "
            >
              {currentPage + 1} /{" "}
              {
                consumptionSummary.totalPages
              }{" "}
              페이지
              {" · "}
              총{" "}
              {consumptionSummary.totalElements.toLocaleString()}
              건
            </p>
          )}
      </div>

      {/* ======================================================
          카테고리 수정 Modal
      ====================================================== */}

      {isModalOpen &&
        selectedTransaction && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/35
              backdrop-blur-[5px]
              px-4
            "
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                handleCloseModal();
              }
            }}
          >
            {/* Modal */}

            <div
              className="
                w-full
                max-w-[420px]
                overflow-hidden
                rounded-[18px]
                bg-white
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
              "
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              {/* Header */}

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
                <h2
                  className="
                    text-[18px]
                    font-bold
                    text-[#172033]
                  "
                >
                  카테고리 수정
                </h2>

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    categoryUpdating
                  }
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

              {/* Content */}

              <div className="px-6 py-6">
                {/* 거래 정보 */}

                <div
                  className="
                    rounded-xl
                    bg-[#F7F8FA]
                    px-4
                    py-4
                  "
                >
                  <p
                    className="
                      text-[15px]
                      font-bold
                      text-[#1F2937]
                    "
                  >
                    {
                      selectedTransaction.merchant
                    }
                  </p>

                  <p
                    className="
                      mt-1
                      text-[14px]
                      font-medium
                      text-[#7B8494]
                    "
                  >
                    ₩
                    {selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>

                {/* 카테고리 선택 */}

                <p
                  className="
                    mb-3
                    mt-5
                    text-[13px]
                    font-semibold
                    text-[#64748B]
                  "
                >
                  카테고리 선택
                </p>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  {CATEGORIES.map(
                    (category) => {
                      const isSelected =
                        modalCategoryId ===
                        category.id;

                      return (
                        <button
                          key={
                            category.id
                          }
                          type="button"
                          disabled={
                            categoryUpdating
                          }
                          onClick={() =>
                            setModalCategoryId(
                              category.id
                            )
                          }
                          className={`
                            flex
                            h-[48px]
                            items-center
                            gap-2
                            rounded-xl
                            border
                            px-3
                            text-left
                            transition-all
                            disabled:cursor-not-allowed
                            disabled:opacity-60

                            ${isSelected
                              ? "border-[#2161F5] bg-[#F1F6FF] text-[#2161F5]"
                              : "border-[#E2E6EC] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#FAFBFC]"
                            }
                          `}
                        >
                          <span
                            className="
                              flex
                              shrink-0
                              items-center
                              justify-center
                            "
                            style={{
                              color:
                                isSelected
                                  ? "#2161F5"
                                  : CATEGORY_ICON_COLORS[
                                  category.name
                                  ],
                            }}
                          >
                            {
                              CATEGORY_ICONS[
                              category.name
                              ]
                            }
                          </span>

                          <span
                            className={`
                              text-[14px]
                              ${isSelected
                                ? "font-semibold"
                                : "font-medium"
                              }
                            `}
                          >
                            {
                              category.name
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Footer */}

              <div
                className="
                  flex
                  gap-3
                  px-6
                  pb-6
                "
              >
                {/* 취소 */}

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    categoryUpdating
                  }
                  className="
                    flex
                    h-[48px]
                    flex-1
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E2E6EC]
                    bg-white
                    text-[14px]
                    font-semibold
                    text-[#475569]
                    transition-colors
                    hover:bg-[#F8FAFC]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  취소
                </button>

                {/* 저장 */}

                <button
                  type="button"
                  onClick={
                    handleSaveCategory
                  }
                  disabled={
                    categoryUpdating ||
                    modalCategoryId ===
                    null
                  }
                  className="
                    flex
                    h-[48px]
                    flex-1
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#2161F5]
                    text-[14px]
                    font-semibold
                    text-white
                    shadow-[0_3px_10px_rgba(33,97,245,0.18)]
                    transition-colors
                    hover:bg-[#1553DE]
                    disabled:cursor-not-allowed
                    disabled:bg-[#AFC4F8]
                    disabled:shadow-none
                  "
                >
                  {categoryUpdating
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </div>
          </div>
        )}
    </MainLayout>
  );
}