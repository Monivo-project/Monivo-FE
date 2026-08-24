import { User } from "lucide-react";

import SectionCard from "./SectionCard";

export default function ProfileSection() {
  return (
    <SectionCard>
      <h2 className="mb-5 text-base font-bold text-gray-900">
        프로필
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            <User size={24} />
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              김지민
            </p>

            <p className="text-sm text-gray-400">
              jimin.kim@example.com
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          편집
        </button>
      </div>
    </SectionCard>
  );
}