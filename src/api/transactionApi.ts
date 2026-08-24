const API_BASE_URL = "https://api.anna-lee.xyz";

export const uploadTransactions = async (
    file: File
): Promise<void> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}/api/transactions/upload`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        console.error("거래 내역 업로드 실패");
        console.error("Status:", response.status);
        console.error("Response:", errorText);

        if (response.status === 401) {
            throw new Error(
                "로그인이 필요하거나 로그인 정보가 만료되었습니다."
            );
        }

        throw new Error(
            `거래 내역 업로드 실패 (${response.status}): ${errorText}`
        );
    }
};