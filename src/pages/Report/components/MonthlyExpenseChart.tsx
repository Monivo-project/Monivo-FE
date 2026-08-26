import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
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

export default function MonthlyExpenseChart() {
  const [monthlyData, setMonthlyData] = useState<
    MonthlySpending[]
  >([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // 최근 6개월 지출 조회
  // ============================================================

  useEffect(() => {
    const fetchMonthlySpending = async () => {
      try {
        setLoading(true);

        const response =
          await api.get<MonthlySpendingResponse>(
            "/api/home/monthly-spending"
          );

        console.log(
          "최근 6개월 지출:",
          response.data
        );

        setMonthlyData(
          response.data.result ?? []
        );
      } catch (error: any) {
        console.error(
          "최근 6개월 지출 조회 실패:",
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

        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySpending();
  }, []);

  // ============================================================
  // 최대 금액
  // ============================================================

  const maxAmount = useMemo(() => {
    if (monthlyData.length === 0) {
      return 100000;
    }

    const max = Math.max(
      ...monthlyData.map(
        (item) => item.amount
      )
    );

    if (max <= 0) {
      return 100000;
    }

    // 그래프 위쪽에 여유 공간
    return Math.ceil(
      (max * 1.2) / 10000
    ) * 10000;
  }, [monthlyData]);

  // ============================================================
  // Y축 금액 표시
  // ============================================================

  const formatAmount = (
    value: number
  ) => {
    if (value >= 10000) {
      return `${Math.round(
        value / 10000
      )}만`;
    }

    return value.toLocaleString();
  };

  // ============================================================
  // Y축 눈금
  // ============================================================

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

  return (
    <div className="w-full">
      {/* ======================================================
          Graph
      ====================================================== */}

      <div className="h-[300px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#9AA5B5]">
              지출 데이터를 불러오는 중...
            </p>
          </div>
        ) : monthlyData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#9AA5B5]">
              지출 데이터가 없습니다.
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={monthlyData}
              margin={{
                top: 15,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              {/* ==================================================
                  영역 Gradient
              ================================================== */}

              <defs>
                <linearGradient
                  id="monthlyExpenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#2563EB"
                    stopOpacity={0.18}
                  />

                  <stop
                    offset="100%"
                    stopColor="#2563EB"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              {/* ==================================================
                  X축
              ================================================== */}

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 14,
                }}
                padding={{
                  left: 10,
                  right: 10,
                }}
              />

              {/* ==================================================
                  Y축
              ================================================== */}

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 13,
                }}
                tickFormatter={(value) =>
                  formatAmount(
                    Number(value)
                  )
                }
                domain={[
                  0,
                  maxAmount,
                ]}
                ticks={yAxisTicks}
                width={55}
              />

              {/* ==================================================
                  Tooltip
              ================================================== */}

              <Tooltip
                cursor={{
                  stroke: "#CBD5E1",
                  strokeDasharray:
                    "4 4",
                }}
                contentStyle={{
                  border:
                    "1px solid #E5EAF0",
                  borderRadius:
                    "10px",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
                formatter={(value) => [
                  `₩${Number(
                    value
                  ).toLocaleString()}`,
                  "지출",
                ]}
              />

              {/* ==================================================
                  꺾은선 + 영역
              ================================================== */}

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#monthlyExpenseGradient)"
                dot={{
                  r: 4,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#2563EB",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}