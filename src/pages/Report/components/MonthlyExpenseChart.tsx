import React from "react";
import { monthlyExpenses } from "../data/reportData";

const maxExpense = 2400000;

export default function MonthlyExpenseChart() {
  const width = 1000;
  const height = 250;

  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const points = monthlyExpenses.map((item, index) => {
    const x =
      paddingLeft +
      (index / (monthlyExpenses.length - 1)) *
        chartWidth;

    const y =
      paddingTop +
      chartHeight -
      (item.amount / maxExpense) *
        chartHeight;

    return { x, y };
  });

  const linePath = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${paddingTop + chartHeight}
    L ${points[0].x} ${paddingTop + chartHeight}
    Z
  `;

  const yLabels = [
    { value: 2400000, label: "240만" },
    { value: 1800000, label: "180만" },
    { value: 1200000, label: "120만" },
    { value: 600000, label: "60만" },
    { value: 0, label: "0만" },
  ];

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[270px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="expenseArea"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#2563EB"
              stopOpacity="0.12"
            />

            <stop
              offset="100%"
              stopColor="#2563EB"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Y축 */}
        {yLabels.map((label) => {
          const y =
            paddingTop +
            chartHeight -
            (label.value / maxExpense) *
              chartHeight;

          return (
            <React.Fragment key={label.label}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke="#E9EDF3"
                strokeDasharray="3 5"
              />

              <text
                x={paddingLeft - 15}
                y={y + 4}
                textAnchor="end"
                fontSize="14"
                fill="#94A3B8"
              >
                {label.label}
              </text>
            </React.Fragment>
          );
        })}

        {/* 영역 */}
        <path
          d={areaPath}
          fill="url(#expenseArea)"
        />

        {/* 라인 */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
        />

        {/* X축 */}
        {monthlyExpenses.map((item, index) => {
          const x =
            paddingLeft +
            (index / (monthlyExpenses.length - 1)) *
              chartWidth;

          return (
            <text
              key={item.month}
              x={x}
              y={height - 12}
              textAnchor="middle"
              fontSize="14"
              fill="#94A3B8"
            >
              {item.month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}