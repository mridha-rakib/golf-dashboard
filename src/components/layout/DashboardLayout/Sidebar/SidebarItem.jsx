// src/components/layout/Sidebar/SidebarItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Database01Icon,
  Analytics01Icon,
  UserCircleIcon,
  Message02Icon,
  GameIcon,
  AiContentGenerator01Icon,
} from "@hugeicons/core-free-icons";

const SidebarItem = ({ item, isActive, onClick, collapsed }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const iconMap = {
    Dashboard: <HugeiconsIcon icon={DashboardSquare01Icon} />,
    "Course & Data Management": <HugeiconsIcon icon={Database01Icon} />,
    Analytics: <HugeiconsIcon icon={Analytics01Icon} />,
    "User Management": <HugeiconsIcon icon={UserCircleIcon} />,
    "Channel Management": <HugeiconsIcon icon={Message02Icon} />,
    "Game & Event Management": <HugeiconsIcon icon={GameIcon} />,
    "Content Moderation": <HugeiconsIcon icon={AiContentGenerator01Icon} />,
    Clubs: <HugeiconsIcon icon={AiContentGenerator01Icon} />,
  };

  return (
    <div className="mb-1" title={collapsed ? item.name : undefined}>
      <div
        className={`flex items-center justify-between rounded-lg cursor-pointer transition-colors px-3 py-2 ${
          isActive
            ? "bg-[#9D4C1D] text-white shadow-sm"
            : "text-[#3d2a1a] hover:bg-white/70"
        }`}
        onClick={handleItemClick}
      >
        <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
          <span className={`flex-shrink-0 ${collapsed ? "" : "mr-3"}`}>
            {iconMap[item.name]}
          </span>
          {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;
