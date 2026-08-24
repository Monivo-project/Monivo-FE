import React from "react";
import Sidebar from "../common/Sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
  activeMenu?: string;
};

export default function MainLayout({
  children,
  activeMenu,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FA]">

      {/* 왼쪽 Sidebar */}
      <aside className="h-screen w-[250px] shrink-0">
        <Sidebar activeMenu={activeMenu} />
      </aside>

      {/* 오른쪽 콘텐츠 */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}