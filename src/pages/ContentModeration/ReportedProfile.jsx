import { Delete02Icon, Flag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { report } from "../../constants/reports";
import { dummyUsers } from "../../constants/users";

const ReportedProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isBanned, setIsBanned] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  const reportData = report.find((r) => r.reportid === id);

  // Load user based on report
  useEffect(() => {
    if (!reportData) return;

    const reportedUser = dummyUsers.find((u) => u.id === reportData.user);
    setUser(reportedUser || null);

    if (reportedUser) {
      setIsBanned(reportedUser.status === "Banned");
    }
  }, [reportData]);


  const handleDeleteUser = (userToDelete) => {
    console.log(`User ${userToDelete.name} deleted`);
    navigate("/content-moderation");
  };

  const handleBanUser = (userToBan, newBanStatus) => {
    setIsBanned(newBanStatus);
    console.log(
      `User ${userToBan.name} status changed to ${newBanStatus ? "Banned" : "Active"
      }`
    );
  };

  if (!reportData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Report not found
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        User not found
      </div>
    );
  }

  const userInfo = {
    name: user.name,
    username: user.id,
    email: user.email,
    bio: user.bio || "N/A",
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    location: `${user.country}, ${user.state}`,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isActive: user.status === "Active",
    clubName: user.clubName,
    ghinNumber: user.ghinNumber,
    handicapIndex: user.handicapIndex,
    country: user.country,
    state: user.state,
    phoneNumber: user.phoneNumber,

  };

  return (
    <div>


      {/* Main Content */}
      <div className="bg-white rounded-lg">
        {/* Profile Header */}
        <h1 className="text-[32px] font-bold ">
          Reported Profile
        </h1>

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userInfo.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-medium">
                    {userInfo.username}
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isBanned
                          ? "bg-red-200 text-gray-800"
                          : "bg-green-200 text-gray-800"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isBanned ? "bg-red-500" : "bg-green-500"
                          }`}
                      ></span>
                      {isBanned ? "Banned" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBanModal(true)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer text-base w-full sm:w-auto ${isBanned
                    ? "bg-[#FCEFEA] text-[#DD612C] border-red-500 hover:bg-red-100"
                    : "border-[#DD612C] text-[#DD612C] hover:bg-red-50"
                  }`}
              >
                <HugeiconsIcon icon={Flag01Icon} />
                {isBanned ? "Unban" : "Ban"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-base w-full sm:w-auto"
              >
                <HugeiconsIcon icon={Delete02Icon} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.email}
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  GHIN Number
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.ghinNumber}
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  Location
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.location}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  Club Name
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.clubName}
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  Handicap Index
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.handicapIndex}
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-semibold text-gray-700 mb-1">
                  Gender
                </label>
                <div className="text-[16px] font-medium text-gray-900 border-b border-[#D8D4E0] py-3">
                  {userInfo.gender}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDeleteUser(user);
            setShowDeleteModal(false);
          }}
          title={`Are you sure you want to delete ${user?.name}?`}
          option1="Yes, delete it"
          option2="Cancel"
        />
      )}

      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => setShowBanModal(false)}
          onConfirm={() => {
            const newBanStatus = !isBanned;
            handleBanUser(user, newBanStatus);
            setShowBanModal(false);
          }}
          title={`Are you sure you want to ${isBanned ? "unban" : "ban"} ${user?.name
            }?`}
          option1={`Yes, ${isBanned ? "unban" : "ban"} user`}
          option2="Cancel"
        />
      )}
    </div>
  );
};

export default ReportedProfile;
