export default function LoginPage() {

    const handleKakaoLogin = () => {
        window.location.href =
            "https://api.anna-lee.xyz/oauth2/authorization/kakao";
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC]">
            <div className="w-[400px] rounded-2xl bg-white p-10 shadow-lg">

                <h1 className="text-center text-3xl font-bold text-[#172033]">
                    Monivo
                </h1>

                <p className="mt-2 text-center text-sm text-[#9AA5B5]">
                    나의 소비를 똑똑하게 관리하세요
                </p>

                <button
                    onClick={handleKakaoLogin}
                    className="
                        mt-10
                        flex h-12 w-full
                        items-center justify-center
                        rounded-xl
                        bg-[#FEE500]
                        text-sm
                        font-semibold
                        text-[#191919]
                        transition
                        hover:bg-[#F5DC00]
                    "
                >
                    카카오로 시작하기
                </button>

            </div>
        </div>
    );
}