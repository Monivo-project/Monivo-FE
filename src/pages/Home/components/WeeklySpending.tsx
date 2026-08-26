import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../../api/api";

interface MonthlySpending {
  month: string;
  amount: number;
}

interface MonthlySpendingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MonthlySpending[];
}

export default function WeeklySpending() {
  const [monthlyData, setMonthlyData] = useState<MonthlySpending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        const response =
          await api.get<MonthlySpendingResponse>(
            "/api/home/monthly-spending"
          );

        console.log(
          "최근 6개월 지출:",
          response.data
        );

        setMonthlyData(
          response.data.result
        );
      } catch (error: any) {
        console.error(
          "최근 6개월 지출 조회 실패:",
          error
        );

        console.error(
          "Response:",
          error.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySpending();
  }, []);

  /*
   * 실제 데이터에서 최대 지출 금액 계산
   */
  const maxAmount = useMemo(() => {
    if (monthlyData.length === 0) {
      return 100000;
    }

    const max = Math.max(
      ...monthlyData.map(
        (item) => item.amount
      )
    );

    if (max === 0) {
      return 100000;
    }

    /*
     * 그래프 위쪽에 여유 공간을 주기 위해
     * 최대값의 20% 정도 추가
     */
    return Math.ceil(
      (max * 1.2) / 10000
    ) * 10000;
  }, [monthlyData]);

  /*
   * Y축 눈금 자동 생성
   */
  const yAxisTicks = useMemo(() => {
    const tickCount = 4;

    return Array.from(
      { length: tickCount + 1 },
      (_, index) =>
        Math.round(
          (maxAmount / tickCount) *
          index
        )
    );
  }, [maxAmount]);

  /*
   * 금액 표시
   *
   * 예:
   * 10000 → 1만
   * 50000 → 5만
   * 100000 → 10만
   */
  const formatAmount = (
    value: number
  ) => {
    if (value >= 10000) {
      return `${Math.round(value / 10000)}만`;
    }

    return `${value.toLocaleString()}`;
  };

  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[17px] font-bold text-[#1F2937]">
          최근 6개월 지출
        </h2>

        <p className="mt-1 text-xs text-[#9AA5B5]">
          이번 달을 제외한 최근 6개월
        </p>
      </div>

      <div className="h-[300px] w-full">

        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#9AA5B5]">
            지출 데이터를 불러오는 중...
          </div>
        ) : monthlyData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#9AA5B5]">
            지출 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 12,
                left: 18,
                bottom: 8,
              }}
            >

              {/* X축 */}
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9AA5B5",
                  fontSize: 14,
                }}
              />

              {/* Y축 */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A5AEBB",
                  fontSize: 13,
                }}
                tickFormatter={(
                  value: string | number
                ) =>
                  formatAmount(
                    Number(value)
                  )
                }
                domain={[
                  0,
                  maxAmount,
                ]}
                ticks={yAxisTicks}
              />

              {/* Tooltip */}
              <Tooltip
                cursor={{
                  fill: "rgba(47,107,235,.05)",
                }}
                formatter={(value) => [
                  `₩${Number(
                    value
                  ).toLocaleString()}`,
                  "지출",
                ]}
              />

              {/* Bar */}
              <Bar
                dataKey="amount"
                fill="#2F6BEB"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                barSize={42}
              />

            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}