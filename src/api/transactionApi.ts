import api from "./api";

/**
 * 거래 내역 엑셀 파일 업로드
 *
 * POST /api/transactions/upload
 */
export const uploadTransactions = async (
  file: File
): Promise<void> => {
  const formData = new FormData();

  formData.append("file", file);

  try {
    await api.post(
      "/api/transactions/upload",
      formData,
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    console.error("거래 내역 업로드 실패");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    if (error.response?.status === 401) {
      throw new Error(
        "로그인이 필요하거나 로그인 정보가 만료되었습니다."
      );
    }

    throw new Error(
      `거래 내역 업로드 실패 (${
        error.response?.status ?? "알 수 없음"
      })`
    );
  }
};