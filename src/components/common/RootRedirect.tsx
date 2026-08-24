import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function RootRedirect() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch(
                    "https://api.anna-lee.xyz/auth/me",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                setIsLoggedIn(false);
            }
        };

        checkLogin();
    }, []);

    // 아직 로그인 여부 확인 중
    if (isLoggedIn === null) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>로그인 상태를 확인하고 있습니다...</p>
            </div>
        );
    }

    // 로그인 O → 홈
    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    // 로그인 X → 로그인
    return <Navigate to="/login" replace />;
}