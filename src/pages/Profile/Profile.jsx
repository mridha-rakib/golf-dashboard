import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import ErrorNotice from "../../components/common/ErrorNotice";
import { useAuthStore } from "../../stores/authStore";
import { uploadProfileImage } from "../../services/userService";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);
  const hydrateProfile = useAuthStore((s) => s.hydrateProfile);

  const normalizeProfile = (profile) => ({
    fullName: profile?.fullName || profile?.userName || profile?.email || "Admin User",
    email: profile?.email || "admin@example.com",
    dob: profile?.dob || "",
    gender: profile?.gender || "",
    profileImage: profile?.profileImage || profile?.profileImageUrl || "",
    profileImageUrl: profile?.profileImageUrl || profile?.profileImage || "",
  });

  useEffect(() => {
    let alive = true;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = user || (await hydrateProfile());
        if (!alive) return;
        if (profile) {
          setTempProfile(normalizeProfile(profile));
        } else {
          setTempProfile(null);
        }
      } catch (err) {
        if (!alive) return;
        setError(err);
        setTempProfile(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      alive = false;
    };
  }, [user?._id, user?.profileImageUrl, user?.profileImage, user?.fullName, user?.email, user?.userName]);

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const apiOrigin = apiBase.replace(/\/api\/v1$/i, "");
  const resolvedProfileImage = useMemo(() => {
    const raw = tempProfile?.profileImageUrl || tempProfile?.profileImage || "";
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (!apiOrigin) return raw;
    if (raw.startsWith("/")) return `${apiOrigin}${raw}`;
    return `${apiOrigin}/${raw}`;
  }, [tempProfile?.profileImageUrl, tempProfile?.profileImage, apiOrigin]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") return;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfile((prev) => ({ ...prev, profileImage: imageUrl, file }));
      setUploading(true);
      setError(null);
      uploadProfileImage(file)
        .then(async (updated) => {
          setTempProfile((prev) => ({
            ...prev,
            profileImage: updated?.profileImageUrl || updated?.profileImage || imageUrl,
            profileImageUrl: updated?.profileImageUrl || updated?.profileImage || "",
          }));
          await hydrateProfile?.().catch(() => {});
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const handleSave = async () => {
    if (!tempProfile) return;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile({ ...tempProfile });
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return <ErrorNotice error={error} />;
  }
  if (!tempProfile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-[32px] font-bold">Admin Profile</h1>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[#9D4C1D] text-white rounded-lg"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#9D4C1D] text-white rounded-lg"
              disabled={false}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col gap-4 items-start">
          <img
            className="w-full max-w-xs h-auto md:w-[280px] md:h-[220px] object-cover rounded-lg border"
            src={resolvedProfileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"}
            alt="Avatar"
          />
          {isEditing && (
            <label className="cursor-pointer bg-[#9D4C1D] text-white px-3 py-2 rounded-lg">
              {uploading ? "Uploading..." : "Change Picture"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-wrap gap-6">
        {/* Name */}
        <div className="w-full md:w-[48%] border-b border-[#D8D4E0]">
          <label className="block text-[18px] font-semibold text-gray-700 mb-1">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={tempProfile?.fullName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          ) : (
            <div className="text-gray-900 py-2">{tempProfile?.fullName || "N/A"}</div>
          )}
        </div>

        {/* Email */}
        <div className="w-full md:w-[48%] border-b border-[#D8D4E0]">
          <label className="block text-[18px] font-semibold text-gray-700 mb-1">Email</label>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleChange}
                disabled
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed.</p>
            </div>
          ) : (
            <a href={`mailto:${tempProfile?.email}`} className="text-blue-600 hover:underline">
              {tempProfile?.email}
            </a>
          )}
        </div>

        {/* Date of birth */}
        <div className="w-full md:w-[48%] border-b border-[#D8D4E0]">
          <label className="block text-[18px] font-semibold text-gray-700 mb-1">Date of birth</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={tempProfile?.dob}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          ) : (
            <div className="text-gray-900 py-2">{tempProfile?.dob || "N/A"}</div>
          )}
        </div>

        {/* Gender */}
        <div className="w-full md:w-[48%] border-b border-[#D8D4E0]">
          <label className="block text-[18px] font-semibold text-gray-700 mb-1">Gender</label>
          {isEditing ? (
            <select
              name="gender"
              value={tempProfile?.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <div className="text-gray-900 py-2">{tempProfile?.gender || "N/A"}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
