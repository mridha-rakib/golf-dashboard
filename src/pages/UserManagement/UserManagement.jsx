import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AtSign,
  BadgeCheck,
  Ban,
  Building2,
  Download,
  Eye,
  Filter,
  Loader2,
  Mail,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import ErrorNotice from "../../components/common/ErrorNotice";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { Pagination } from "../../components/ui/Pagination";
import {
  deleteClub,
  exportUsersExcel,
  listClubs,
  listGolfers,
} from "../../services/clubService";
import { deleteUser, updateUserStatus } from "../../services/userService";

const STATUS_OPTIONS = ["All", "Active", "Banned"];

const getRoleLabel = (role) => (role === "golf_club" ? "Golf Club" : "Golfer");

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const usersPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    let alive = true;

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [golfers, clubs] = await Promise.all([listGolfers(), listClubs()]);

        if (!alive) return;

        const mappedGolfers = (golfers ?? []).map((user) => {
          const statusRaw = String(user?.accountStatus || "").toLowerCase();
          const isActive = statusRaw === "active";
          return {
            _id: user?._id,
            email: user?.email || "N/A",
            fullName: user?.fullName || user?.userName || user?.email || "Unknown",
            userName: user?.userName || "N/A",
            clubName: user?.clubName || "N/A",
            status: isActive ? "Active" : "Banned",
            role: user?.role || "golfer",
            isActive,
            clubMemberCount: user?.clubMemberCount ?? 0,
            clubManagerCount: user?.clubManagerCount ?? 0,
            ghinNumbers:
              user?.ghinNumbers && user.ghinNumbers.length > 0
                ? user.ghinNumbers.join(", ")
                : "N/A",
          };
        });

        const mappedClubs = (clubs ?? []).map((club) => ({
          _id: club?.clubUserId || club?._id,
          email: club?.clubEmail || "N/A",
          fullName: club?.name || "Unknown Club",
          userName: club?.clubUserName || "N/A",
          clubName: club?.name || "Unknown Club",
          status: "Active",
          role: "golf_club",
          isActive: true,
          clubId: club?._id,
          clubMemberCount: club?.memberCount ?? "N/A",
          clubManagerCount: "N/A",
          ghinNumbers: club?.ghinNumber || "N/A",
        }));

        setUsers([...mappedGolfers, ...mappedClubs]);
      } catch (err) {
        if (!alive) return;
        setError(err);
        setUsers([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      alive = false;
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = useMemo(
    () =>
      users?.filter((user) => {
        const matchesSearch =
          user?.fullName?.toLowerCase().includes(normalizedQuery) ||
          user?.userName?.toLowerCase().includes(normalizedQuery) ||
          user?.clubName?.toLowerCase().includes(normalizedQuery) ||
          String(user?._id || "")
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesStatus = statusFilter === "All" || user?.status === statusFilter;
        return matchesSearch && matchesStatus;
      }) ?? [],
    [users, normalizedQuery, statusFilter],
  );

  const totalUsers = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / usersPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const activeUsers = filteredUsers.filter((user) => user.isActive).length;
  const bannedUsers = filteredUsers.length - activeUsers;
  const golfClubs = filteredUsers.filter((user) => user.role === "golf_club").length;

  const statCards = useMemo(
    () => [
      {
        title: "Visible Users",
        value: filteredUsers.length,
        Icon: Users,
        iconClass: "bg-[#f5e6da] text-[#8c4f30]",
      },
      {
        title: "Active Users",
        value: activeUsers,
        Icon: UserCheck,
        iconClass: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Banned Users",
        value: bannedUsers,
        Icon: ShieldAlert,
        iconClass: "bg-red-100 text-red-700",
      },
      {
        title: "Golf Clubs",
        value: golfClubs,
        Icon: Building2,
        iconClass: "bg-amber-100 text-amber-700",
      },
    ],
    [filteredUsers.length, activeUsers, bannedUsers, golfClubs],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleViewUser = (user) => {
    navigate(`view/${user._id}`);
  };

  const handleToggleBan = async () => {
    if (!userToAction) return;
    setError(null);
    const nextStatus = userToAction.status === "Active" ? "suspended" : "active";
    try {
      await updateUserStatus(userToAction._id, nextStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userToAction._id
            ? {
                ...user,
                status: nextStatus === "active" ? "Active" : "Banned",
                isActive: nextStatus === "active",
              }
            : user,
        ),
      );
      setShowBanModal(false);
      setUserToAction(null);
    } catch (err) {
      setError(err);
      setShowBanModal(false);
      setUserToAction(null);
    }
  };

  const handleDelete = async () => {
    if (!userToAction) return;
    setError(null);
    try {
      if (userToAction.role === "golf_club" && userToAction.clubId) {
        await deleteClub(userToAction.clubId);
      } else {
        await deleteUser(userToAction._id);
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToAction._id));
      setShowDeleteModal(false);
      setUserToAction(null);
    } catch (err) {
      setError(err);
      setShowDeleteModal(false);
      setUserToAction(null);
    }
  };

  const handleExportUsers = async () => {
    setError(null);
    setExporting(true);
    try {
      const { blob, fileName } = await exportUsersExcel();
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName || "users-export.xlsx";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-[#ead9cc] bg-gradient-to-r from-[#fff7ef] via-[#fffefb] to-[#f7efe8] p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-[#edcdb7]/45 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-[#d9ead8]/35 blur-3xl" />

        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f6348]">
              Admin Console
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#2b1b11] sm:text-4xl">
              User Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6f5545] sm:text-base">
              Manage golfers and clubs from one place with quick moderation actions and
              real-time status visibility.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7d69]" />
              <input
                type="text"
                placeholder="Search by name, username, club, or ID"
                className="w-full rounded-xl border border-[#decdbc] bg-white/95 py-2.5 pl-10 pr-9 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#b27a55] focus:ring-2 focus:ring-[#e8cdb9]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-44">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b7d69]" />
              <select
                className="w-full appearance-none rounded-xl border border-[#decdbc] bg-white py-2.5 pl-10 pr-9 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#b27a55] focus:ring-2 focus:ring-[#e8cdb9]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8f715d]">
                v
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportUsers}
              disabled={exporting || loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#8a4d2f] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#744027] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exporting ? "Preparing..." : "Export Excel"}
            </button>
          </div>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ title, value, Icon, iconClass }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7d6656]">
                  {title}
                </p>
                <span className={`rounded-lg p-2 ${iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-[#e6d6c9] bg-[#fff8f2] px-4 py-3 text-sm text-[#7d6656]">
          Loading users...
        </div>
      )}
      {error && <ErrorNotice error={error} />}

      <div className="hidden xl:block overflow-hidden rounded-2xl border border-[#eadcd0] bg-white shadow-sm">
        <div className="grid grid-cols-12 gap-4 border-b border-[#efe3d8] bg-[#f8eee7] px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a553e]">
          <div className="col-span-1">No</div>
          <div className="col-span-2">User</div>
          <div className="col-span-1">User Name</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-1">Role</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-center">Members</div>
          <div className="col-span-1 text-center">Managers</div>
          <div className="col-span-1">GHIN #</div>
          <div className="col-span-1">Actions</div>
        </div>

        <div className="divide-y divide-[#f1e6dc]">
          {paginatedUsers.length === 0 && (
            <div className="px-6 py-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8ece1] text-[#935a38]">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term or status filter.
              </p>
            </div>
          )}

          {paginatedUsers.map((user, index) => (
            <div key={user._id} className="px-6 py-4 transition-colors hover:bg-[#fff9f4]">
              <div className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-1 text-sm text-gray-900">
                  {String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
                </div>
                <div className="col-span-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4e3d5] text-xs font-semibold text-[#8a4d2f]">
                      {getInitials(user.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.fullName}</p>
                      <p className="truncate text-xs text-slate-500">{user.clubName}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 truncate text-sm text-gray-700">{user.userName || "N/A"}</div>
                <div className="col-span-2 truncate text-sm text-gray-900">{user.email}</div>
                <div className="col-span-1">
                  <span className="inline-flex items-center rounded-full border border-[#ead7c9] bg-[#fcf7f2] px-2.5 py-1 text-xs font-medium text-[#7f5237]">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {user.isActive ? "Active" : "Banned"}
                  </span>
                </div>
                <div className="col-span-1 text-center text-sm text-gray-900">
                  {user.clubMemberCount ?? 0}
                </div>
                <div className="col-span-1 text-center text-sm text-gray-900">
                  {user.clubManagerCount ?? 0}
                </div>
                <div className="col-span-1 truncate text-sm text-gray-900">
                  {user.ghinNumbers || "N/A"}
                </div>
                <div className="col-span-1 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUserToAction(user);
                      setShowBanModal(true);
                    }}
                    className={`rounded-full border p-2 transition-colors ${
                      user.isActive
                        ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }`}
                    title={user.isActive ? "Ban user" : "Unban user"}
                    aria-label={user.isActive ? "Ban user" : "Unban user"}
                  >
                    {user.isActive ? (
                      <Ban className="h-4 w-4" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleViewUser(user)}
                    className="rounded-full border border-violet-200 p-2 text-violet-600 transition-colors hover:bg-violet-50"
                    title="View user"
                    aria-label="View user"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setUserToAction(user);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-full border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50"
                    title="Delete user"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:hidden">
        {paginatedUsers.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#eadcd0] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8ece1] text-[#935a38]">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No users found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or status filter.
            </p>
          </div>
        )}

        {paginatedUsers.map((user, index) => (
          <div
            key={user._id}
            className="overflow-hidden rounded-2xl border border-[#eadcd0] bg-white shadow-sm"
          >
            <div className="flex items-start justify-between border-b border-[#f2e6dc] bg-[#fcf8f4] px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8f6f5a]">
                  #{String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">{getRoleLabel(user.role)}</p>
              </div>

              <span
                className={`inline-flex h-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                    user.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {user.isActive ? "Active" : "Banned"}
              </span>
            </div>

            <div className="space-y-3 px-4 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <AtSign className="h-4 w-4 text-[#8f6f5a]" />
                <span className="truncate">{user.userName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Mail className="h-4 w-4 text-[#8f6f5a]" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Building2 className="h-4 w-4 text-[#8f6f5a]" />
                <span className="truncate">{user.clubName}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#fbf6f1] p-3 text-xs text-slate-600">
                <div className="space-y-1">
                  <p className="font-medium text-[#7d6656]">Members</p>
                  <p className="text-base font-semibold text-slate-900">{user.clubMemberCount ?? 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-[#7d6656]">Managers</p>
                  <p className="text-base font-semibold text-slate-900">{user.clubManagerCount ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <UserRound className="h-4 w-4 text-[#8f6f5a]" />
                <span className="truncate">GHIN: {user.ghinNumbers || "N/A"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[#f2e6dc] px-4 py-3">
              <button
                onClick={() => {
                  setUserToAction(user);
                  setShowBanModal(true);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                  user.isActive
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {user.isActive ? <Ban className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                {user.isActive ? "Ban" : "Unban"}
              </button>
              <button
                onClick={() => handleViewUser(user)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-2 py-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              <button
                onClick={() => {
                  setUserToAction(user);
                  setShowDeleteModal(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
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

      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToAction(null);
          }}
          onConfirm={handleDelete}
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
          onConfirm={handleToggleBan}
          title={userToAction?.status === "Active" ? "Ban User" : "Unban User"}
          option1={userToAction?.status === "Active" ? "Ban User" : "Unban User"}
          option2="Cancel"
        />
      )}
    </div>
  );
}
