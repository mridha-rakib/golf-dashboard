// src/components/layout/Sidebar/Sidebar.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import golflogo from "/Golf_Docket_Logo.svg";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("sidebarCollapsed");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // 🔹 Get role from localStorage
  const role = JSON.parse(localStorage.getItem("authUser") || "{}")?.role || "admin";

  // Define all menu items + which roles can see them
  const menuItems = [
    { name: "Dashboard", path: "/", roles: ["admin", "super_admin"] },
    { name: "Course & Data Management", path: "/course-data-management", roles: ["admin", "super_admin"] },
    { name: "Analytics", path: "/analytics", roles: ["admin", "super_admin"] },
    { name: "User Management", path: "/user-management", roles: ["admin", "super_admin"] },
    { name: "Channel Management", path: "/channel-management", roles: ["admin", "super_admin"] },
    { name: "Game & Event Management", path: "/game-event-management", roles: ["golf_club", "admin", "super_admin"] },
    { name: "Clubs", path: "/clubs", roles: ["golf_club", "admin", "super_admin"] },
  ];

  // Filter items based on user role
  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));

  const handleMenuClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const isItemActive = (itemPath) => {
    if (itemPath === "/") return location.pathname === "/";
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 transform transition-all duration-300 ease-in-out bg-[#f7efe7] border-r border-[#e2d7cc] shadow-sm
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "lg:w-20" : "lg:w-64"}
        lg:translate-x-0 lg:relative lg:z-auto`}
      >
        <div className="pt-5 flex items-center justify-center relative px-4 lg:px-3">
          <div
            className={`flex items-center justify-center rounded-xl bg-[#f0e5dc] border border-[#e2d7cc] shadow-sm transition-all duration-300 overflow-hidden ${
              collapsed ? "h-12 w-12 p-2" : "h-16 w-16 p-2.5"
            }`}
          >
            <img
              src={golflogo}
              alt="Club Docket logo"
              className="h-full w-full object-contain"
            />
          </div>
          {!collapsed && (
            <span className="ml-3 text-lg font-semibold text-[#7a4322] hidden xl:block">
              Club Docket
            </span>
          )}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 lg:hidden p-2 rounded-md hover:bg-white/60 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              collapsed={collapsed}
              isActive={isItemActive(item.path)}
              onClick={() => handleMenuClick(item.path)}
            />
          ))}
        </nav>

        <div className="hidden lg:flex items-center justify-between px-3 pb-5">
          <button
            type="button"
            onClick={toggleCollapse}
            className="group flex items-center w-full justify-center rounded-lg p-2 bg-white/60 hover:bg-white transition-colors shadow-sm"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-[#6f2d10] transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-[#f7efe7] border border-[#e2d7cc] shadow-md lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;
