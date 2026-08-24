import MainLayout from "../../components/layout/MainLayout";

import AbnormalSpendingCard from "./components/AbnormalSpendingCard";
import AbnormalWarningBanner from "./components/AbnormalWarningBanner";

import { abnormalSpending } from "./data/abnormalSpendingData";

export default function AbnormalSpendingPage() {
  const abnormalCount = abnormalSpending.length;

  return (
    <MainLayout activeMenu="이상 지출">
      <div className="w-full px-8 py-8 lg:px-12">

        {/* Header */}
        <header className="mb-7">
          <h1 className="text-[28px] font-bold tracking-tight text-[#172033]">
            이상 지출
          </h1>

          <p className="mt-1 text-[15px] text-[#9AA5B5]">
            평소와 다른 패턴의 지출이 감지되었습니다.
          </p>
        </header>

        {/* Content */}
        <div className="mt-6 space-y-6">

          {/* Warning */}
          <AbnormalWarningBanner
            count={abnormalCount}
          />

          {/* Abnormal Spending List */}
          <div className="space-y-5">
            {abnormalSpending.map((item) => (
              <AbnormalSpendingCard
                key={item.id}
                item={item}
              />
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}