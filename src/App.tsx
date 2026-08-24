import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";

import HomePage from "./pages/Home/HomePage";
import ConsumptionPage from "./pages/Consumption/ConsumptionPage";
import ReportPage from "./pages/Report/Report";
import AbnormalSpendingPage from "./pages/AbnormalSpending/AbnormalSpendingPage";
import UncategorizedPage from "./pages/Uncategorized/UncategorizedPage";
import SettingsPage from "./pages/Settings/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 루트 → 로그인 */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* 로그인 */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* 홈 */}
        <Route
          path="/home"
          element={<HomePage />}
        />

        {/* 소비 내역 */}
        <Route
          path="/consumption"
          element={<ConsumptionPage />}
        />

        {/* 소비 리포트 */}
        <Route
          path="/report"
          element={<ReportPage />}
        />

        {/* 이상 지출 */}
        <Route
          path="/abnormal"
          element={<AbnormalSpendingPage />}
        />

        {/* 미분류 관리 */}
        <Route
          path="/unclassified"
          element={<UncategorizedPage />}
        />

        {/* 설정 */}
        <Route
          path="/settings"
          element={<SettingsPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;