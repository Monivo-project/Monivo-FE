import {
  Download,
  RefreshCw,
} from "lucide-react";

import SectionCard from "./SectionCard";

export default function DataManagementSection() {
  return (
    <SectionCard>
      <h2 className="mb-5 text-base font-bold text-gray-900">
        데이터 관리
      </h2>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Download size={16} />
          데이터 내보내기 (CSV)
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          데이터 동기화
        </button>
      </div>
    </SectionCard>
  );
}