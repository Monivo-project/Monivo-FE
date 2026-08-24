import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

const categoryData = [
  { name: "식비", value: 35, color: "#2F6BEB" },
  { name: "교통", value: 20, color: "#13B98A" },
  { name: "쇼핑", value: 18, color: "#8555E8" },
  { name: "문화", value: 15, color: "#FF8A00" },
  { name: "기타", value: 12, color: "#9AA5B5" },
];

export default function CategorySpending() {
  return (
    <section className="rounded-2xl border border-[#E9EDF3] bg-white p-6">
      <h2 className="mb-5 text-[17px] font-bold text-[#1F2937]">
        카테고리별 지출
      </h2>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={73}
              outerRadius={104}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="#fff"
              strokeWidth={3}
            >
              {categoryData.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        {categoryData.slice(0, 5).map((item) => (
          <div
            className="flex items-center justify-between"
            key={item.name}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-sm text-[#5F6B7A]">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-semibold text-[#374151]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}