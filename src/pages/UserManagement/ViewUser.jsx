import { Delete02Icon, Flag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { deleteClub, listClubs, listGolfers } from "../../services/clubService";
import { deleteUser, updateUserStatus } from "../../services/userService";
const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBanned, setIsBanned] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const [golfers, clubs] = await Promise.all([
          listGolfers(),
          listClubs(),
        ]);

        if (!alive) return;

        const mappedGolfers = (golfers ?? []).map((golfer) => {
          const statusRaw = String(golfer?.accountStatus || "").toLowerCase();
          const isActive = statusRaw === "active";
          return {
            _id: golfer?._id,
            fullName:
              golfer?.fullName || golfer?.userName || golfer?.email || "Unknown",
            email: golfer?.email || "N/A",
            bio: golfer?.bio || "N/A",
            address: golfer?.address || "N/A",
            role: golfer?.role || "golfer",
            status: isActive ? "Active" : "Banned",
            isActive,
            accountStatus: golfer?.accountStatus,
            profileImageUrl: golfer?.profileImageUrl,
            coverImageUrl: golfer?.coverImageUrl,
            userName: golfer?.userName,
            phoneNumber: golfer?.phoneNumber,
          };
        });

        const mappedClubs = (clubs ?? []).map((club) => ({
          _id: club?.clubUserId || club?._id,
          clubId: club?._id,
          fullName: club?.name || "Unknown Club",
          email: club?.clubEmail || "N/A",
          bio: "N/A",
          address: club?.address || "N/A",
          role: "golf_club",
          status: "Active",
          isActive: true,
          accountStatus: "active",
          profileImageUrl: club?.profileImageUrl || null,
          coverImageUrl: club?.coverImageUrl || null,
          userName: club?.name || "N/A",
          phoneNumber: "N/A",
          ghinNumber: club?.ghinNumber || "N/A",
          clubName: club?.name || "N/A",
          country: club?.country || "N/A",
          state: club?.city || "N/A",
        }));

        const allUsers = [...mappedGolfers, ...mappedClubs];
        const found = allUsers.find((item) => String(item._id) === String(id));

        setUser(found || null);
        setIsBanned(found?.status === "Banned");
      } catch (err) {
        if (!alive) return;
        const message = err?.message || "Failed to load user";
        setError(message);
        setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadUser();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleDeleteUser = async (userToDelete) => {
    if (!userToDelete) return;
    setError(null);
    try {
      if (userToDelete.role === "golf_club" && userToDelete.clubId) {
        await deleteClub(userToDelete.clubId);
      } else {
        await deleteUser(userToDelete._id);
      }
      navigate("/user-management");
    } catch (err) {
      const message = err?.message || "Failed to delete user";
      setError(message);
    }
  };

  const handleBanUser = async (userToBan, newBanStatus) => {
    if (!userToBan) return;
    setError(null);
    try {
      const nextStatus = newBanStatus ? "suspended" : "active";
      await updateUserStatus(userToBan._id, nextStatus);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              status: newBanStatus ? "Banned" : "Active",
              isActive: !newBanStatus,
              accountStatus: nextStatus,
            }
          : prev,
      );
      setIsBanned(newBanStatus);
    } catch (err) {
      const message = err?.message || "Failed to update status";
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        User not found.
      </div>
    );
  }

  const userInfo = {
    fullName: user.fullName || "N/A",
    username: user.userName || user._id || "N/A",
    email: user.email || "N/A",
    bio: user.bio || "N/A",
    dateOfBirth: user.dateOfBirth || "N/A",
    gender: user.gender || "N/A",
    location: user.location || "N/A",
    avatar:
      user.profileImageUrl ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isActive: user.status === "Banned" ? "Banned" : "Active",
    country: user.country || "N/A",
    state: user.state || "N/A",
    handicapIndex: user.handicapIndex || "N/A",
    ghinNumber: user.ghinNumber || "N/A",
    clubName: user.clubName || "N/A",
    address: user.address || "N/A",
  };

  return (
    <div className="">
      {/* Header */}

      {/* Main Content */}
      <div className="bg-white rounded-lg ">
        {/* Profile Header */}
        <h1 className="text-[32px] font-bold">User Profile</h1>
        <div className="p-6 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {userInfo.fullName}
                </h1>
                <div className="flex items-center">
                  <span
                    className={`ml-1 flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${userInfo.isActive === "Banned"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${userInfo.isActive === "Banned" ? "bg-red-500" : "bg-green-500"
                        }`}
                    />
                    {userInfo.isActive === "Banned" ? "Banned" : "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBanModal(true)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer text-base w-full sm:w-auto ${userInfo.isActive === "Banned"
                    ? "bg-red-50 text-red-600 border-red-600 hover:bg-red-100"
                    : "border-[#E8D738] bg-[#FFFDEC] text-[#B5A82B] hover:bg-red-50"
                  }`}
              >
                <HugeiconsIcon icon={Flag01Icon} />
                {/* <CMIcon fill="#DD612C" height={24} width={24} /> */}
                {userInfo.isActive === "Banned" ? "Unban" : "Ban"}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border-red-600 border text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer text-base w-full sm:w-auto"
              >
                {/* <TrashIcon fill="#DD612C" height={24} width={24} /> */}
                <HugeiconsIcon icon={Delete02Icon} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 ">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.email}
                </div>
              </div>

              {/* ghin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GHIN Number{" "}
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.ghinNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.country}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.address}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Handicap Index
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.handicapIndex}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club Name
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.clubName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.state}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                  {userInfo.gender}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Items
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {accountStats.totalItems}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Outfits
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {accountStats.totalOutfits}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Lookbooks
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {accountStats.totalLookbooks}
              </div>
            </div>
          </div>
        </div> */}

        {/* Community Information
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Community Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Posts
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {communityStats.totalPosts}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Followers
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {communityStats.totalFollowers}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Following
              </label>
              <div className="text-2xl font-bold text-gray-900 border-b border-[#D8D4E0] py-[12px]">
                {communityStats.totalFollowing}
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Confirmation Modals */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
          }}
          onConfirm={() => {
            handleDeleteUser(user);
            setShowDeleteModal(false);
          }}
          title={`Are you sure you want to delete ${userInfo.fullName}?`}
          option1="Yes, delete it"
          option2="Cancel"
        />
      )}

      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
          }}
          onConfirm={() => {
            const newBanStatus = !isBanned;
            handleBanUser(user, newBanStatus);
            setShowBanModal(false);
          }}
          title={`Are you sure you want to ${isBanned ? "Unban" : "Ban"} ${userInfo.fullName}?`}
          option1={`Yes, ${isBanned ? "Unban" : "Ban"} user`}
          option2="Cancel"
        />
      )}
    </div>
  );
};

export default ViewUser;
