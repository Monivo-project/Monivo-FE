import { useEffect, useState } from "react";
import { User, X } from "lucide-react";

import SectionCard from "./SectionCard";
import api from "../../../api/api";

/* ============================================================
   API Response Type
============================================================ */

interface Member {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/* ============================================================
   ProfileSection
============================================================ */

export default function ProfileSection() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // 이름 수정 모달
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 수정할 닉네임
  const [editName, setEditName] = useState("");

  // 저장 중
  const [isSaving, setIsSaving] = useState(false);

  /* ============================================================
     사용자 정보 조회
  ============================================================ */

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await api.get<ApiResponse<Member>>(
          "/auth/users/me/name"
        );

        setMember(response.data.result);
      } catch (error) {
        console.error(
          "프로필 정보를 불러오지 못했습니다.",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  /* ============================================================
     편집 버튼 클릭
  ============================================================ */

  const handleEditClick = () => {
    if (!member) return;

    // 현재 닉네임을 입력창에 넣기
    setEditName(member.name);

    // 모달 열기
    setIsEditOpen(true);
  };

  /* ============================================================
     모달 닫기
  ============================================================ */

  const handleCloseModal = () => {
    if (isSaving) return;

    setIsEditOpen(false);
    setEditName("");
  };

  /* ============================================================
     닉네임 수정 API
     
     PATCH /auth/users/me/name
     
     Request Body
     {
       "nickname": "새로운 닉네임"
     }
  ============================================================ */

  const handleSaveName = async () => {
    const nickname = editName.trim();

    // 빈 값 검사
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!member) {
      return;
    }

    try {
      setIsSaving(true);

      const response = await api.patch<ApiResponse<string>>(
        "/auth/users/me/name",
        {
          nickname,
        }
      );

      // 백엔드 수정 성공
      if (response.data.isSuccess) {
        // 화면의 사용자 정보도 바로 변경
        setMember({
          ...member,
          name: nickname,
        });

        // 모달 닫기
        setIsEditOpen(false);
        setEditName("");

        alert("닉네임이 수정되었습니다.");
      } else {
        alert(
          response.data.message || "닉네임 수정에 실패했습니다."
        );
      }
    } catch (error) {
      console.error(
        "닉네임 수정 중 오류가 발생했습니다.",
        error
      );

      alert("닉네임 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* ========================================================
          프로필
      ======================================================== */}

      <SectionCard>
        <h2 className="mb-5 text-base font-bold text-gray-900">
          프로필
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 프로필 아이콘 */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <User size={24} />
            </div>

            {/* 사용자 정보 */}
            <div>
              <p className="font-semibold text-gray-900">
                {loading
                  ? "불러오는 중..."
                  : member?.name ?? "사용자"}
              </p>

              <p className="text-sm text-gray-400">
                {loading
                  ? "불러오는 중..."
                  : member?.email ?? "이메일 정보 없음"}
              </p>
            </div>
          </div>

          {/* 편집 버튼 */}
          <button
            type="button"
            onClick={handleEditClick}
            disabled={loading || !member}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            편집
          </button>
        </div>
      </SectionCard>

      {/* ========================================================
          닉네임 수정 모달
      ======================================================== */}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                닉네임 수정
              </h3>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* 닉네임 입력 */}
            <div className="mb-6">
              <label
                htmlFor="edit-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                닉네임
              </label>

              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSaving) {
                    handleSaveName();
                  }
                }}
                placeholder="닉네임을 입력해주세요"
                autoFocus
                disabled={isSaving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              {/* 취소 */}
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>

              {/* 저장 */}
              <button
                type="button"
                onClick={handleSaveName}
                disabled={isSaving || !editName.trim()}
                className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}