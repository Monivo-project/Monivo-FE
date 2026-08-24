import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weeklyData = [
  { day: "월", amount: 12000 },
  { day: "화", amount: 18000 },
  { day: "수", amount: 9000 },
  { day: "목", amount: 24000 },
  { day: "금", amount: 15000 },
  { day: "토", amount: 27000 },
  { day: "일", amount: 21000 },
];

export default function WeeklySpending() {
  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">
      <h2 className="mb-5 text-[17px] font-bold text-[#1F2937]">
        이번 주 일별 지출
      </h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyData}
            margin={{
              top: 10,
              right: 12,
              left: 18,
              bottom: 8,
            }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9AA5B5",
                fontSize: 14,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#A5AEBB",
                fontSize: 13,
              }}
              tickFormatter={(value: string | number) =>
                `${Number(value) / 1000}만`
              }
              domain={[0, 28000]}
              ticks={[0, 7000, 14000, 21000, 28000]}
            />

            <Tooltip
              cursor={{
                fill: "rgba(47,107,235,.05)",
              }}
              formatter={(value) => [
                `₩${Number(value).toLocaleString()}`,
                "지출",
              ]}
            />

            <Bar
              dataKey="amount"
              fill="#2F6BEB"
              radius={[5, 5, 0, 0]}
              barSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}