import type React from "react";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}