import { useEffect, useState } from "react";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";

import AbnormalSpendingCard from "./components/AbnormalSpendingCard";
import AbnormalWarningBanner from "./components/AbnormalWarningBanner";

import api from "../../api/api";

/* ============================================================
   이상 지출 데이터
============================================================ */

export type AbnormalSpendingItem = {
  transactionId: number;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  score: number;
  type: "AI" | "RULE";
  reason: string;
};

/* ============================================================
   API Response
============================================================ */

type AbnormalApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AbnormalSpendingItem[];
};

/* ============================================================
   Page
============================================================ */

export default function AbnormalSpendingPage() {
  const [
    abnormalSpending,
    setAbnormalSpending,
  ] = useState<AbnormalSpendingItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ============================================================
     이상 지출 조회
     
     GET /api/abnormal
  ============================================================ */

  useEffect(() => {
    const fetchAbnormalSpendings =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get<AbnormalApiResponse>(
              "/api/abnormal"
            );

          console.log(
            "이상 지출 API 응답:",
            response.data
          );

          /* ======================================================
             Axios Response이므로

             response.data.isSuccess
             response.data.result
             response.data.message

             사용
          ====================================================== */

          if (response.data.isSuccess) {

            console.log(
              "이상 지출 목록:",
              response.data.result
            );

            setAbnormalSpending(
              response.data.result ?? []
            );

          } else {

            setError(
              response.data.message ||
              "이상 지출 정보를 불러오지 못했습니다."
            );

          }

        } catch (error) {

          console.error(
            "이상 지출 조회 실패:",
            error
          );

          setError(
            "이상 지출 정보를 불러오지 못했습니다."
          );

        } finally {

          setLoading(false);

        }
      };

    fetchAbnormalSpendings();

  }, []);

  /* ============================================================
     이상 지출 개수
  ============================================================ */

  const abnormalCount =
    abnormalSpending.length;

  return (
    <MainLayout activeMenu="이상 지출">

      <div className="w-full px-8 py-8 lg:px-12">

        {/* ======================================================
            Header
        ====================================================== */}

        <header className="mb-7">

          <h1
            className="
              text-[28px]
              font-bold
              tracking-tight
              text-[#172033]
            "
          >
            이상 지출
          </h1>

          <p
            className="
              mt-1
              text-[15px]
              text-[#9AA5B5]
            "
          >
            평소와 다른 패턴의 지출이
            감지되었습니다.
          </p>

        </header>

        {/* ======================================================
            Content
        ====================================================== */}

        <div className="mt-6 space-y-6">

          {/* ====================================================
              Warning Banner
          ==================================================== */}

          {!loading && !error && (
            <AbnormalWarningBanner
              count={abnormalCount}
            />
          )}

          {/* ====================================================
              Loading
          ==================================================== */}

          {loading && (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                rounded-2xl
                border
                border-gray-100
                bg-white
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[#8B95A7]
                "
              >

                <Loader2
                  size={20}
                  className="animate-spin"
                />

                <span>
                  이상 지출을 분석하고 있습니다...
                </span>

              </div>

            </div>
          )}

          {/* ====================================================
              Error
          ==================================================== */}

          {!loading && error && (
            <div
              className="
                flex
                min-h-[250px]
                items-center
                justify-center
                rounded-2xl
                border
                border-red-100
                bg-white
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-red-500
                "
              >

                <AlertCircle
                  size={20}
                />

                <span>
                  {error}
                </span>

              </div>

            </div>
          )}

          {/* ====================================================
              Empty
          ==================================================== */}

          {!loading &&
            !error &&
            abnormalSpending.length === 0 && (

              <div
                className="
                  flex
                  min-h-[300px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-gray-100
                  bg-white
                "
              >

                <div
                  className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                  "
                >
                  <span className="text-2xl">
                    ✓
                  </span>
                </div>

                <h2
                  className="
                    text-[18px]
                    font-bold
                    text-[#172033]
                  "
                >
                  이상 지출이 없습니다.
                </h2>

                <p
                  className="
                    mt-2
                    text-[14px]
                    text-[#9AA5B5]
                  "
                >
                  현재까지 평소와 다른
                  소비 패턴이 발견되지 않았습니다.
                </p>

              </div>
            )}

          {/* ====================================================
              Abnormal Spending List
          ==================================================== */}

          {!loading &&
            !error &&
            abnormalSpending.length > 0 && (

              <div className="space-y-5">

                {abnormalSpending.map(
                  (item) => (
                    <AbnormalSpendingCard
                      key={
                        item.transactionId
                      }
                      item={item}
                    />
                  )
                )}

              </div>
            )}

        </div>

      </div>

    </MainLayout>
  );
}