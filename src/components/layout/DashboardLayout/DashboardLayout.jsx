// src/components/layout/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import Breadcrumb from "./Topbar/Breadcrumb";
import { Toaster } from "react-hot-toast";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen ">

 <Toaster position="top-right" />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <Breadcrumb />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
