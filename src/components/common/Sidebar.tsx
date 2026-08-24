import React, { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  Plus,
  Settings,
  Tag,
  Wallet,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AddTransactionModal from "./AddTransactionModal";

type SidebarMenu = {
  label: string;
  icon: React.ReactNode;
  badge?: string;
  path: string;
};

type SidebarProps = {
  activeMenu?: string;
};

export default function Sidebar({
  activeMenu = "홈",
}: SidebarProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menus: SidebarMenu[] = [
    {
      label: "홈",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      label: "소비 내역",
      icon: <CircleDollarSign size={20} />,
      badge: "30",
      path: "/consumption",
    },
    {
      label: "소비 리포트",
      icon: <BarChart3 size={20} />,
      path: "/report",
    },
    {
      label: "이상 지출",
      icon: <AlertTriangle size={20} />,
      badge: "3",
      path: "/abnormal",
    },
    {
      label: "미분류 관리",
      icon: <Tag size={20} />,
      badge: "3",
      path: "/unclassified",
    },
    {
      label: "설정",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <aside
      className="
        flex h-screen w-[250px] min-w-[250px]
        flex-col
        border-r border-[#E9EDF3]
        bg-white
        px-[18px]
        py-7
      "
    >

      {/* 로고 */}
      <div className="mb-10 flex items-center gap-3 px-2.5">

        <div
          className="
            flex h-[42px] w-[42px]
            items-center justify-center
            rounded-xl
            bg-[#2F6BEB]
            text-white
          "
        >
          <Wallet
            size={22}
            strokeWidth={2.3}
          />
        </div>

        <div>
          <div className="text-[18px] font-bold text-[#1F2937]">
            Monivo
          </div>

          <div className="mt-[3px] text-[11px] text-[#9AA5B5]">
            소비 분석 플랫폼
          </div>
        </div>

      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-1.5">

        {menus.map((menu) => {

          const isActive =
            activeMenu === menu.label;

          return (
            <button
              key={menu.label}
              onClick={() => navigate(menu.path)}
              className={`
                flex h-12 w-full
                items-center
                rounded-[10px]
                px-3.5
                text-left
                transition-colors

                ${isActive
                  ? "bg-[#EEF4FF] text-[#2F6BEB]"
                  : "text-[#7B8798] hover:bg-[#F5F7FB]"
                }
              `}
            >

              {/* 아이콘 */}
              <span className="mr-3 flex items-center justify-center">
                {menu.icon}
              </span>

              {/* 메뉴 이름 */}
              <span className="flex-1 text-sm font-medium">
                {menu.label}
              </span>

              {/* Badge */}
              {menu.badge && (
                <span
                  className="
                    flex h-[22px] min-w-6
                    items-center justify-center
                    rounded-[11px]
                    bg-[#F1F3F6]
                    px-1.5
                    text-[11px]
                    font-semibold
                    text-[#7B8798]
                  "
                >
                  {menu.badge}
                </span>
              )}

            </button>
          );
        })}

      </nav>

      {/* 새 거래 추가 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          mt-auto
          flex h-[46px] w-full
          items-center justify-center
          gap-2
          rounded-[10px]
          bg-[#2F6BEB]
          text-sm
          font-semibold
          text-white
          transition-colors
          hover:bg-[#245BD0]
        "
      >
        <Plus size={19} />

        <span>
          새 거래 추가
        </span>
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </aside>
  );
}