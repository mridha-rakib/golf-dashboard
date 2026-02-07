// src/components/layout/Topbar/Topbar.jsx
import { useState } from "react";
import { Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../stores/authStore";
import userdummy from "../../../../assets/images/user-dummy.png";

const Topbar = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const notifications = [];

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };
  const unreadCount = notifications?.filter((n) => !n.read).length;

  return (
    <div className="bg-white py-7 px-4 sm:px-6 relative ">
      <div className="flex items-center justify-end space-x-4 sm:space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-1 sm:p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
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
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications?.length === 0 ? (
                  <div className="py-4 px-4 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications?.map(notification => (
                    <div key={notification.id} className={`border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}>
                      <div className="py-3 px-4 flex items-start">
                        <div className="ml-2 sm:ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 mt-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
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
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-white font-medium">
              <img
                src={user?.profileImage || userdummy}
                alt="User"
                className="rounded-full object-cover h-full w-full"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || "Admin"}
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
