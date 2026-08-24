import { AlertTriangle } from "lucide-react";

type AbnormalWarningBannerProps = {
  count: number;
};

export default function AbnormalWarningBanner({
  count,
}: AbnormalWarningBannerProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-[#fff5f5] px-5 py-5">
      <div className="mt-0.5 shrink-0 text-red-500">
        <AlertTriangle
          size={25}
          strokeWidth={2}
        />
      </div>

      <div>
        <p className="text-[17px] font-bold text-red-600">
          {count}건의 이상 지출이 감지되었습니다
        </p>

        <p className="mt-1 text-[15px] text-red-500">
          아래 항목을 검토하고 정상 지출이라면 확인 완료를 눌러주세요.
        </p>
      </div>
    </div>
  );
}