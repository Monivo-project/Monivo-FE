"use client";

import { useState } from "react";

import SectionCard from "./SectionCard";
import BudgetRow from "./BudgetRow";

import {
  INITIAL_BUDGETS,
} from "../data/settingsData";

export default function BudgetSection() {
  const [budgets, setBudgets] =
    useState(INITIAL_BUDGETS);

  const updateAmount = (
    index: number,
    value: number,
  ) => {
    setBudgets((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              amount: value,
            }
          : item,
      ),
    );
  };

  return (
    <SectionCard>
      <h2 className="mb-5 text-base font-bold text-gray-900">
        카테고리별 월 예산
      </h2>

      <div className="space-y-4">
        {budgets.map((item, index) => (
          <BudgetRow
            key={item.category}
            category={item.category}
            amount={item.amount}
            onChange={(value) =>
              updateAmount(index, value)
            }
          />
        ))}
      </div>
    </SectionCard>
  );
}