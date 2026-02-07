import {
    Delete02Icon,
    Flag01Icon,
    ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { Pagination } from "../../components/ui/Pagination";
import { dummyUsers } from "../../constants/users";

export default function UserManagement() {
  const [users, setUsers] = useState(
    dummyUsers.map((user, index) => ({
      _id: user.id || `user-${index + 1}`,
      fullName: user.name,
      clubName: user.clubName,
      status: user.status,
      role: user.role || "golfer",
      isActive: user.status !== "Banned",
    }))
  );
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;
  // ✅ Update search filter to check clubName instead of email
const filteredUsers = users?.filter((user) => {
  const matchesSearch =
    user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.clubName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?._id?.toLowerCase().includes(searchQuery.toLowerCase()); // if using MongoDB _id

  const matchesStatus =
    statusFilter === "All" || user?.status === statusFilter;

  return matchesSearch && matchesStatus;
});


  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleViewUser = (user) => {
    navigate(`view/${user._id}`);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-[32px] sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Users
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder={"Search"}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#F5EDE8] px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-1">No</div>
            {/* <div className="col-span-2">ID</div> */}
            <div className="col-span-3">User Name</div>
            <div className="col-span-3">Role</div> {/* ✅ Changed */}
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {paginatedUsers.map((user, index) => (
            <div
              key={user._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-sm text-gray-900">
                  {String(
                    (currentPage - 1) * usersPerPage + index + 1
                  ).padStart(2, "0")}
                </div>
                {/* <div className="col-span-2 text-sm font-medium text-gray-900">
                  {user._id}
                </div> */}
                <div className="col-span-3 text-sm text-gray-900">
                  {user.fullName}
                </div>
                <div className="col-span-3 text-sm text-gray-900 truncate">
                  {user.role==="golf_club" ? "Golf Club" : "Golfer"}
                </div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        user.isActive === true ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {user.isActive === true ? "Active" : "Banned"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setUserToAction(user);
                      setShowBanModal(true);
                    }}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-full border border-orange-200 transition-colors"
                  >
                    <HugeiconsIcon icon={Flag01Icon} />
                  </button>
                  <button
                    onClick={() => handleViewUser(user)}
                    className="p-2 text-purple-500 hover:bg-purple-50 rounded-full border border-purple-200 transition-colors"
                  >
                    <HugeiconsIcon icon={ViewIcon} />
                  </button>
                  <button
                    onClick={() => {
                      setUserToAction(user);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {paginatedUsers.map((user, index) => (
          <div
            key={user._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-gray-400 font-medium">
                #{String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setUserToAction(user);
                    setShowBanModal(true);
                  }}
                  className="p-2 text-orange-500 hover:bg-orange-50  rounded-full border border-orange-200 transition-colors"
                >
                  <HugeiconsIcon icon={Flag01Icon} />
                </button>
                <button
                  onClick={() => handleViewUser(user)}
                  className="p-1.5 rounded-full bg-[#F5EDE8] text-[#9D4C1D]  border border-purple-200"
                >
                  <HugeiconsIcon icon={ViewIcon} />
                </button>
                <button
                  onClick={() => {
                    setUserToAction(user);
                    setShowDeleteModal(true);
                  }}
                  className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <div><span className="font-semibold">Name:</span> {user.fullName}</div>
              <div><span className="font-semibold">Club:</span> {user.clubName}</div>
              <div><span className="font-semibold">ID:</span> {user._id}</div>
              <div className="flex items-center">
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-1 flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      user.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        PerPage={usersPerPage}
        totalPages={totalPages}
        totalItems={totalUsers}
      />

      {/* Confirmation Modals (Delete + Ban/Unban) remain unchanged */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToAction(null);
          }}
          onConfirm={() => {
            if (userToAction) {
              setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== userToAction._id)
              );
            }
            setShowDeleteModal(false);
            setUserToAction(null);
          }}
          title="Delete User"
          option1="Delete User"
          option2="Cancel"
        />
      )}
      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
            setUserToAction(null);
          }}
          onConfirm={() => {
            if (userToAction) {
              setUsers((prevUsers) =>
                prevUsers.map((user) =>
                  user._id === userToAction._id
                    ? { ...user, status: user.status === "Active" ? "Banned" : "Active" }
                    : user
                )
              );
            }
            setShowBanModal(false);
            setUserToAction(null);
          }}
          title={userToAction?.status === "Active" ? "Ban User" : "Unban User"}
          option1={userToAction?.status === "Active" ? "Ban User" : "Unban User"}
          option2="Cancel"
        />
      )}
    </div>
  );
}
