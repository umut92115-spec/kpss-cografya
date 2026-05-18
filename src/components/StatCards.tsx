"use client";

interface StatItem {
  label: string;
  value: string;
  icon?: string;
  color?: "blue" | "orange" | "green" | "red";
}

interface StatCardsProps {
  stats: StatItem[];
}

export default function StatCards({ stats = [] }: StatCardsProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border ${colorMap[stat.color || "blue"]} flex flex-col gap-1 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              {stat.label}
            </span>
            {stat.icon && <span className="text-lg">{stat.icon}</span>}
          </div>
          <div className="text-xl font-black">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
