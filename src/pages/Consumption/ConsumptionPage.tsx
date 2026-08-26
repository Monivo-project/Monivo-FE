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
  Plus,
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
// ⚠️ id는 DB의 실제 category.id와 반드시 맞춰야 함
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

const CATEGORY_ICONS: Record<
  string,
  React.ReactNode
> = {
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

const CATEGORY_ICON_COLORS: Record<
  string,
  string
> = {
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
// 분류 방식 필터
// ============================================================

const CLASSIFICATION_TYPES = [
  "전체",
  "분류",
  "미분류",
] as const;

type ClassificationFilter =
  (typeof CLASSIFICATION_TYPES)[number];

// ============================================================
// 실제 백엔드 classificationType
// ============================================================

type ClassificationType =
  | "UNCLASSIFIED"
  | "KEYWORD"
  | "USER"
  | "LLM"
  | "UNCONFIRMED"
  | "MERCHANT";

// ============================================================
// Home Summary 타입
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

  abnormalCount: number;
  uncategorizedCount: number;

  transactions: ConsumptionTransaction[];

  page: number;
  size: number;

  totalPages: number;
  totalElements: number;

  hasNext: boolean;
  hasPrevious: boolean;
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
  // 분류 방식 필터
  // ============================================================

  const [selectedClassification, setSelectedClassification] =
    useState<ClassificationFilter>("전체");

  const [isClassificationOpen, setIsClassificationOpen] =
    useState(false);

  // ============================================================
  // 현재 선택된 월
  // ============================================================

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  // ============================================================
  // Summary
  // ============================================================

  const [summary, setSummary] =
    useState<HomeSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ============================================================
  // 거래 목록
  // ============================================================

  const [transactions, setTransactions] =
    useState<ConsumptionTransaction[]>([]);

  const [transactionLoading, setTransactionLoading] =
    useState(false);

  const [transactionCount, setTransactionCount] =
    useState(0);

  // ============================================================
  // Pagination
  // ============================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(0);

  const [hasNext, setHasNext] =
    useState(false);

  const [hasPrevious, setHasPrevious] =
    useState(false);

  // ============================================================
  // 카테고리 수정 Modal
  // ============================================================

  const [selectedTransaction, setSelectedTransaction] =
    useState<ConsumptionTransaction | null>(null);

  // ⭐ 기존 modalCategory(string) 대신 categoryId 사용
  const [modalCategoryId, setModalCategoryId] =
    useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // ============================================================
  // 카테고리 수정 저장 중
  // ============================================================

  const [categoryUpdating, setCategoryUpdating] =
    useState(false);

  // ============================================================
  // 현재 날짜에서 연 / 월 추출
  // ============================================================

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth() + 1;

  // ============================================================
  // Summary 조회
  // ============================================================

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);

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
          `${year}년 ${month}월 Summary:`,
          response.data
        );

        setSummary(
          response.data.result
        );
      } catch (error: any) {
        console.error(
          "소비 요약 조회 실패:",
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

        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [year, month]);

  // ============================================================
  // Consumption 조회
  // ============================================================

  useEffect(() => {
    const fetchConsumption = async () => {
      setTransactionLoading(true);

      try {
        const response =
          await api.get<
            ApiResponse<ConsumptionResponse>
          >(
            "/api/consumption",
            {
              params: {
                year,
                month,
                page: currentPage - 1,
                size: 10,
              },
            }
          );

        console.log(
          `${year}년 ${month}월 소비 내역:`,
          response.data
        );

        const result =
          response.data.result;

        setTransactions(
          result.transactions
        );

        setTransactionCount(
          result.transactionCount
        );

        setTotalPages(
          result.totalPages
        );

        setHasNext(
          result.hasNext
        );

        setHasPrevious(
          result.hasPrevious
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

        setTransactions([]);

        setTransactionCount(0);

        setTotalPages(0);

        setHasNext(false);

        setHasPrevious(false);
      } finally {
        setTransactionLoading(false);
      }
    };

    fetchConsumption();
  }, [
    year,
    month,
    currentPage,
  ]);

  // ============================================================
  // 이전 달
  // ============================================================

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const date =
        new Date(prev);

      date.setMonth(
        date.getMonth() - 1
      );

      return date;
    });

    setCurrentPage(1);

    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setSelectedClassification(
      "전체"
    );

    setIsCategoryOpen(false);

    setIsClassificationOpen(false);
  };

  // ============================================================
  // 다음 달
  // ============================================================

  const handleNextMonth = () => {
    const today =
      new Date();

    const currentYear =
      today.getFullYear();

    const currentMonth =
      today.getMonth();

    setCurrentDate((prev) => {
      const nextDate =
        new Date(prev);

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

    setCurrentPage(1);

    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setSelectedClassification(
      "전체"
    );

    setIsCategoryOpen(false);

    setIsClassificationOpen(false);
  };

  // ============================================================
  // 현재 달인지 확인
  // ============================================================

  const today =
    new Date();

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth() + 1;

  // ============================================================
  // 검색 + 카테고리 + 분류 방식 필터
  // ============================================================

  const filteredTransactions =
    transactions.filter(
      (transaction) => {
        const matchesSearch =
          transaction.merchant
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          selectedCategory ===
          "전체 카테고리" ||
          transaction.categoryName ===
          selectedCategory;

        let matchesClassification =
          true;

        if (
          selectedClassification ===
          "분류"
        ) {
          matchesClassification =
            transaction.classificationType !==
            "UNCLASSIFIED" &&
            transaction.classificationType !==
            "UNCONFIRMED";
        }

        if (
          selectedClassification ===
          "미분류"
        ) {
          matchesClassification =
            transaction.classificationType ===
            "UNCLASSIFIED" ||
            transaction.classificationType ===
            "UNCONFIRMED";
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesClassification
        );
      }
    );

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
  // 미분류인지 확인
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
  // 카테고리 선택
  // ============================================================

  const handleCategorySelect = (
    category: string
  ) => {
    setSelectedCategory(
      category
    );

    setIsCategoryOpen(false);

    setCurrentPage(1);
  };

  // ============================================================
  // 분류 방식 선택
  // ============================================================

  const handleClassificationSelect = (
    classification: ClassificationFilter
  ) => {
    setSelectedClassification(
      classification
    );

    setIsClassificationOpen(false);

    setCurrentPage(1);
  };

  // ============================================================
  // 활성 필터 여부
  // ============================================================

  const hasActiveFilter =
    selectedCategory !==
    "전체 카테고리" ||
    selectedClassification !==
    "전체" ||
    search.length > 0;

  // ============================================================
  // 필터 초기화
  // ============================================================

  const handleResetFilters = () => {
    setSearch("");

    setSelectedCategory(
      "전체 카테고리"
    );

    setSelectedClassification(
      "전체"
    );

    setCurrentPage(1);
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

    // ⭐ 기존 categoryName이 아니라 categoryId를 저장
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
      console.log("카테고리 수정 요청:", {
        transactionId: selectedTransaction.transactionId,
        categoryId: modalCategoryId,
      });

      await api.patch(
        `/api/consumption/${selectedTransaction.transactionId}/category/${modalCategoryId}`
      );

      const selectedCategoryInfo = CATEGORIES.find(
        (category) =>
          category.id === modalCategoryId
      );

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.transactionId ===
            selectedTransaction.transactionId
            ? {
              ...transaction,
              categoryId: modalCategoryId,
              categoryName:
                selectedCategoryInfo?.name ??
                transaction.categoryName,
              classificationType: "USER",
            }
            : transaction
        )
      );

      setIsModalOpen(false);
      setSelectedTransaction(null);
      setModalCategoryId(null);

      console.log("카테고리 수정 성공");
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
        "카테고리 수정에 실패했습니다."
      );
    } finally {
      setCategoryUpdating(false);
    }
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

          <button
            type="button"
            className="
              flex h-11
              items-center
              gap-2
              rounded-xl
              bg-[#2161F5]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-[0_3px_10px_rgba(33,97,245,0.18)]
              transition-colors
              hover:bg-[#1553DE]
            "
          >
            <Plus size={19} />
            거래 추가
          </button>

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
            onClick={
              handlePreviousMonth
            }
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
              {loading
                ? "조회 중..."
                : `${transactionCount.toLocaleString()}건`}
            </p>

          </div>

          <button
            type="button"
            onClick={
              handleNextMonth
            }
            disabled={
              isCurrentMonth
            }
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

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="이 달 총 지출"
            value={
              loading
                ? "조회 중..."
                : summary
                  ? `₩${summary.totalExpense.toLocaleString()}`
                  : "조회 실패"
            }
            subText={
              loading
                ? "데이터를 불러오는 중..."
                : summary
                  ? summary.changeFromLastMonth > 0
                    ? (
                      <span className="text-[#F04444]">
                        지난 달보다 ₩
                        {summary.changeFromLastMonth.toLocaleString()}
                        {" "}증가
                      </span>
                    )
                    : summary.changeFromLastMonth < 0
                      ? (
                        <span className="text-[#2F6BEB]">
                          지난 달보다 ₩
                          {Math.abs(
                            summary.changeFromLastMonth
                          ).toLocaleString()}
                          {" "}감소
                        </span>
                      )
                      : (
                        <span className="text-[#9AA5B5]">
                          지난 달과 동일
                        </span>
                      )
                  : "데이터를 불러오지 못했습니다."
            }
            tone="blue"
          />

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="거래 건수"
            value={
              transactionLoading
                ? "조회 중..."
                : `${transactionCount.toLocaleString()}건`
            }
            subText="전체 거래"
            tone="green"
          />

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="이상 지출"
            value={
              summary
                ? `${summary.abnormalCount}건`
                : "0건"
            }
            subText="이상 지출 확인"
            tone="red"
          />

          <SummaryCard
            icon={
              <Wallet size={22} />
            }
            label="미분류"
            value={
              summary
                ? `${summary.uncategorizedCount}건`
                : "0건"
            }
            subText="분류 필요"
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
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
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

          {/* 카테고리 필터 */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen(
                  (prev) => !prev
                );

                setIsClassificationOpen(
                  false
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

          {/* 분류 방식 */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setIsClassificationOpen(
                  (prev) => !prev
                );

                setIsCategoryOpen(
                  false
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
                {
                  selectedClassification ===
                    "전체"
                    ? "분류 방식 전체"
                    : selectedClassification
                }
              </span>

              <ChevronDown
                size={17}
                className={`
                  transition-transform
                  ${isClassificationOpen
                    ? "rotate-180"
                    : ""
                  }
                `}
              />
            </button>

            {isClassificationOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+8px)]
                  z-50
                  w-[160px]
                  rounded-xl
                  border border-[#E5EAF0]
                  bg-white
                  py-1
                  shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                "
              >

                {CLASSIFICATION_TYPES.map(
                  (classification) => (
                    <button
                      key={classification}
                      type="button"
                      onClick={() =>
                        handleClassificationSelect(
                          classification
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

                        ${selectedClassification ===
                          classification
                          ? "bg-[#F5F8FF] font-semibold text-[#2161F5]"
                          : "text-[#4B5563]"
                        }
                      `}
                    >
                      {
                        classification ===
                          "전체"
                          ? "분류 방식 전체"
                          : classification
                      }
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

            {selectedClassification !==
              "전체" && (
                <span
                  className="
                    rounded-lg
                    bg-[#F5F8FF]
                    px-3
                    py-1.5
                    font-semibold
                    text-[#2161F5]
                  "
                >
                  분류 방식:{" "}
                  {selectedClassification}
                </span>
              )}

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

          ) : filteredTransactions.length > 0 ? (

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
                        {
                          formatDate(
                            transaction.date
                          )
                        }
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
                      {
                        transaction.amount.toLocaleString()
                      }
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
                      {
                        getClassificationLabel(
                          transaction.classificationType
                        )
                      }
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

        {totalPages > 0 && (
          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <button
              type="button"
              disabled={!hasPrevious}
              onClick={() => {
                if (hasPrevious) {
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                  );
                }
              }}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border border-[#E5EAF0]
                transition-colors

                ${hasPrevious
                  ? "text-[#4B5563] hover:bg-[#F8FAFC]"
                  : "cursor-not-allowed text-[#D1D5DB]"
                }
              `}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  font-medium
                  transition-colors

                  ${currentPage === page
                    ? "bg-[#2161F5] text-white"
                    : "text-[#6B7280] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={!hasNext}
              onClick={() => {
                if (hasNext) {
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                  );
                }
              }}
              className={`
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border border-[#E5EAF0]
                transition-colors

                ${hasNext
                  ? "text-[#4B5563] hover:bg-[#F8FAFC]"
                  : "cursor-not-allowed text-[#D1D5DB]"
                }
              `}
            >
              <ChevronRight size={18} />
            </button>

          </div>
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

            {/* ==================================================
                Modal
            ================================================== */}

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

              {/* ==================================================
                  Header
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

              {/* ==================================================
                  Content
              ================================================== */}

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
                    {
                      selectedTransaction.amount.toLocaleString()
                    }
                  </p>

                </div>

                {/* 카테고리 선택 제목 */}

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

                {/* ==================================================
                    카테고리 2열
                ================================================== */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2
                  "
                >

                  {CATEGORIES.map(
                    (category) => {

                      // ⭐ ID로 선택 여부 확인
                      const isSelected =
                        modalCategoryId ===
                        category.id;

                      return (
                        <button
                          key={category.id}
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

              {/* ==================================================
                  Footer
              ================================================== */}

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
                    modalCategoryId === null
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