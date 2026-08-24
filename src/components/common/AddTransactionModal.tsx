import { useRef, useState } from "react";
import { X, UploadCloud, FileText, Trash2 } from "lucide-react";
import { uploadTransactions } from "../../api/transactionApi";

type AddTransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AddTransactionModal({
    isOpen,
    onClose,
}: AddTransactionModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFiles = (files: FileList | null) => {
        if (files && files[0]) {
            const selectedFile = files[0];

            // 확장자 검사
            const fileName = selectedFile.name.toLowerCase();

            if (
                !fileName.endsWith(".xlsx") &&
                !fileName.endsWith(".xls")
            ) {
                alert("XLSX 또는 XLS 파일만 업로드할 수 있습니다.");
                return;
            }

            // 10MB 제한
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("파일 크기는 최대 10MB까지 업로드할 수 있습니다.");
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        handleFiles(e.dataTransfer.files);
    };

    const handleSubmit = async () => {
        if (!file || isUploading) return;

        try {
            setIsUploading(true);

            console.log("거래 내역 업로드 시작");
            console.log("파일:", file.name);

            await uploadTransactions(file);

            alert("거래 내역이 등록되었습니다.");

            setFile(null);
            onClose();
        } catch (error) {
            console.error("거래 내역 업로드 실패:", error);

            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("거래 내역 등록에 실패했습니다.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        if (isUploading) return;

        setFile(null);
        onClose();
    };

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/40
                px-4
            "
            onClick={handleClose}
        >
            <div
                className="
                    w-full max-w-[520px]
                    rounded-2xl
                    bg-white
                    shadow-[0_20px_60px_rgba(15,23,42,0.15)]
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="
                        flex items-center justify-between
                        border-b border-[#EEF1F5]
                        px-7 py-5
                    "
                >
                    <h2 className="text-[19px] font-bold text-[#172033]">
                        새 거래 추가
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            text-[#9AA5B5]
                            transition-colors
                            hover:bg-[#F5F7FB]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-7 py-6">
                    <label className="mb-2 block text-sm font-semibold text-[#172033]">
                        파일 업로드 <span className="text-red-500">*</span>
                    </label>

                    <p className="mb-3 text-[13px] text-[#9AA5B5]">
                        명세서 파일을 등록하면 거래 내역이 자동으로 인식돼요.
                    </p>

                    {!file ? (
                        <div
                            onClick={() => inputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`
                                flex flex-col items-center justify-center gap-3
                                rounded-2xl
                                border-2 border-dashed
                                px-6 py-12
                                text-center
                                cursor-pointer
                                transition-colors
                                ${isDragging
                                    ? "border-[#2F6BEB] bg-[#EEF4FF]"
                                    : "border-[#E5EAF0] bg-[#FAFBFC] hover:bg-[#F5F7FB]"
                                }
                            `}
                        >
                            <div
                                className="
                                    flex h-12 w-12
                                    items-center justify-center
                                    rounded-full
                                    bg-[#EEF4FF]
                                    text-[#2F6BEB]
                                "
                            >
                                <UploadCloud size={22} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#172033]">
                                    클릭하거나 파일을 끌어다 놓으세요
                                </p>

                                <p className="mt-1 text-[13px] text-[#9AA5B5]">
                                    XLSX, XLS (최대 10MB)
                                </p>
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </div>
                    ) : (
                        <div
                            className="
                                flex items-center gap-3
                                rounded-2xl
                                border border-[#E5EAF0]
                                bg-[#FAFBFC]
                                px-4 py-3.5
                            "
                        >
                            <div
                                className="
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-[#EEF4FF]
                                    text-[#2F6BEB]
                                "
                            >
                                <FileText size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[#172033]">
                                    {file.name}
                                </p>

                                <p className="mt-0.5 text-[12px] text-[#9AA5B5]">
                                    {(file.size / 1024).toFixed(0)}KB
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => setFile(null)}
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-lg
                                    text-[#9AA5B5]
                                    transition-colors
                                    hover:bg-[#F1F3F6]
                                    hover:text-red-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-7 pb-7">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="
                            h-12 flex-1
                            rounded-xl
                            border border-[#E5EAF0]
                            text-sm font-semibold text-[#4B5563]
                            transition-colors
                            hover:bg-[#F8FAFC]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        disabled={!file || isUploading}
                        onClick={handleSubmit}
                        className="
                            h-12 flex-1
                            rounded-xl
                            text-sm font-semibold text-white
                            transition-colors
                            disabled:cursor-not-allowed
                            disabled:bg-[#C7D2E5]
                            enabled:bg-[#2161F5]
                            enabled:hover:bg-[#1553DE]
                        "
                    >
                        {isUploading ? "업로드 중..." : "추가하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}