// src/components/layout/Topbar/Topbar.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../stores/authStore";
import {
  listNotifications,
  updateNotificationsRead,
} from "../../../../services/notificationService";
import userdummy from "../../../../assets/images/user-dummy.png";

const Topbar = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const user = useAuthStore((s) => s.user);
  const hydrateProfile = useAuthStore((s) => s.hydrateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };
  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError("");
    try {
      const [result, countResult] = await Promise.all([
        listNotifications({ page: 1, limit: 10 }),
        updateNotificationsRead({ countOnly: true }),
      ]);
      setNotifications(Array.isArray(result.data) ? result.data : []);
      if (countResult && typeof countResult.unreadCount === "number") {
        setUnreadCount(countResult.unreadCount);
      }
    } catch (error) {
      setNotifications([]);
      setNotificationsError("Failed to load notifications.");
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const handleMarkRead = async (notificationId) => {
    if (!notificationId) return;
    try {
      const result = await updateNotificationsRead({ notificationId });
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
      if (typeof result?.unreadCount === "number") {
        setUnreadCount(result.unreadCount);
      } else {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // ignore errors for now
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n._id);
    if (unreadIds.length === 0) return;
    try {
      const result = await updateNotificationsRead({
        notificationIds: unreadIds,
      });
      setNotifications((prev) =>
        prev.map((item) =>
          unreadIds.includes(item._id) ? { ...item, isRead: true } : item,
        ),
      );
      if (typeof result?.unreadCount === "number") {
        setUnreadCount(result.unreadCount);
      } else {
        setUnreadCount((prev) => Math.max(0, prev - unreadIds.length));
      }
    } catch {
      // ignore errors for now
    }
  };

  useEffect(() => {
    hydrateProfile?.().catch(() => {});
  }, [hydrateProfile]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage, user?.profileImageUrl, user?.avatarUrl]);

  const profileImageRaw =
    user?.profileImage ||
    user?.profileImageUrl ||
    user?.avatarUrl ||
    "";
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const apiOrigin = apiBase.replace(/\/api\/v1$/i, "");
  const profileImage = useMemo(() => {
    if (!profileImageRaw) return "";
    if (/^https?:\/\//i.test(profileImageRaw)) return profileImageRaw;
    if (!apiOrigin) return profileImageRaw;
    if (profileImageRaw.startsWith("/")) {
      return `${apiOrigin}${profileImageRaw}`;
    }
    return `${apiOrigin}/${profileImageRaw}`;
  }, [profileImageRaw, apiOrigin]);

  const showImage = Boolean(profileImage) && !imageError;
  const displayName =
    user?.fullName || user?.userName || user?.email || "Admin";
  const initials =
    displayName?.trim()?.charAt(0)?.toUpperCase() || "A";
  const formatNotificationTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString();
  };

  return (
    <div className="bg-white py-7 px-4 sm:px-6 relative ">
      <div className="flex items-center justify-end space-x-4 sm:space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-1 sm:p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => {
              const nextOpen = !isNotificationOpen;
              setIsNotificationOpen(nextOpen);
              setIsProfileOpen(false);
              if (nextOpen) {
                fetchNotifications();
              }
            }}
          >
            <HugeiconsIcon icon={Notification01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-3 w-3 sm:h-4 sm:w-4 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200">
              <div className="py-2 px-4 bg-gray-100 border-b flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[#9D4C1D] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="py-4 px-4 text-center text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notificationsError ? (
                  <div className="py-4 px-4 text-center text-sm text-gray-500">
                    {notificationsError}
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="py-4 px-4 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications?.map(notification => (
                    <button
                      type="button"
                      key={notification._id}
                      onClick={() => handleMarkRead(notification._id)}
                      className={`w-full text-left border-b border-gray-100 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="py-3 px-4 flex items-start">
                        <div className="ml-2 sm:ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-white font-medium bg-[#9D4C1D] overflow-hidden">
              {showImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="rounded-full object-cover h-full w-full"
                  onError={(e) => {
                    e.currentTarget.src = userdummy;
                    setImageError(true);
                  }}
                />
              ) : (
                <span className="text-sm sm:text-base">{initials}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {displayName}
              </p>
              <p className="text-xs text-gray-500">{user?.role || "admin"}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              {/* <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{'User'}</p>
                <p className="text-xs text-gray-500 truncate">{'user@example.com'}</p>
              </div> */}
              <a onClick={() => navigate('/profile')} className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
