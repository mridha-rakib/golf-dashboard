import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AssignModal from "./AssignModal";
import { uploadClubCoverImage, uploadClubProfileImage } from "../../services/clubService";
import { useClubStore } from "../../stores/clubStore";

const ClubProfile = () => {
  const { id } = useParams();
  const [assignModal, setAssignModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localClub, setLocalClub] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "",
    city: "",
    address: "",
    ghinNumber: "",
    clubProfileImage: null,
    clubCoverImage: null,
  });
  const [uploading, setUploading] = useState({ cover: false, profile: false });

  const clubs = useClubStore((state) => state.clubs);
  const golfers = useClubStore((state) => state.golfers);
  const loading = useClubStore((state) => state.loading);
  const error = useClubStore((state) => state.error);
  const fetchClubs = useClubStore((state) => state.fetchClubs);
  const fetchGolfers = useClubStore((state) => state.fetchGolfers);
  const assignManager = useClubStore((state) => state.assignManager);
  const updateClubInfo = useClubStore((state) => state.updateClubInfo);
  const clubRoles = useClubStore((state) => state.clubRoles);
  const fetchClubRoles = useClubStore((state) => state.fetchClubRoles);
  const [savingDetails, setSavingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  useEffect(() => {
    if (clubs.length === 0) {
      fetchClubs().catch(() => {});
    }
  }, [clubs.length, fetchClubs]);

  useEffect(() => {
    fetchGolfers().catch(() => {});
  }, [fetchGolfers]);

  useEffect(() => {
    const current = clubs.find((item) => item._id === id);
    if (!current) return;

    const normalized = {
      ...current,
      fullName: current.name || "",
      email: current.clubEmail || "",
      country: current.country || "",
      city: current.city || "",
      address: current.address || "",
      ghinNumber: current.ghinNumber || "",
      clubProfileImage: current.clubProfileImage || "",
      clubCoverImage: current.clubCoverImage || "",
      coverImageUrl: current.coverImageUrl || "",
      profileImageUrl: current.profileImageUrl || "",
      manager: current.manager || null,
    };

    setLocalClub(normalized);
    setForm({
      fullName: normalized.fullName,
      email: normalized.email,
      country: normalized.country,
      city: normalized.city,
      address: normalized.address,
      ghinNumber: normalized.ghinNumber,
      clubProfileImage: normalized.clubProfileImage,
      clubCoverImage: normalized.clubCoverImage,
      coverImageUrl: normalized.coverImageUrl,
      profileImageUrl: normalized.profileImageUrl,
    });
  }, [clubs, id]);

  useEffect(() => {
    if (!id) return;
    fetchClubRoles(id).catch(() => {});
  }, [fetchClubRoles, id]);

  useEffect(() => {
    setActiveTab("members");
  }, [id]);

  const currentRoles = clubRoles[id] ?? { managers: [], members: [] };
  const tabConfig = [
    { key: "members", label: "Members" },
    { key: "managers", label: "Managers" },
  ];
  const activeRoleList = currentRoles[activeTab] ?? [];

  if (loading && !localClub) {
    return (
      <div className="text-center py-10 text-sm text-[#9D4C1D]">
        Loading club profile...
      </div>
    );
  }

  if (!localClub) {
    return (
      <div className="text-center py-10 text-red-500">
        {error ? error : "Failed to load club profile"}
      </div>
    );
  }

  const handleEditClick = () => {
    setForm({
      fullName: localClub.fullName,
      email: localClub.email,
      country: localClub.country,
      city: localClub.city,
      address: localClub.address,
      ghinNumber: localClub.ghinNumber,
      clubProfileImage: localClub.clubProfileImage,
      clubCoverImage: localClub.clubCoverImage,
    });
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !localClub) return;
    setUploading((prev) => ({ ...prev, cover: true }));
    try {
      const updated = await uploadClubCoverImage(localClub._id, file);
      setLocalClub((prev) => ({
        ...prev,
        coverImageUrl: updated.coverImageUrl ?? prev.coverImageUrl,
      }));
      toast.success("Cover image updated");
    } catch (err) {
      toast.error(err?.message || "Failed to upload cover image");
    } finally {
      setUploading((prev) => ({ ...prev, cover: false }));
    }
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !localClub) return;
    setUploading((prev) => ({ ...prev, profile: true }));
    try {
      const updated = await uploadClubProfileImage(localClub._id, file);
      setLocalClub((prev) => ({
        ...prev,
        profileImageUrl: updated.profileImageUrl ?? prev.profileImageUrl,
      }));
      toast.success("Profile image updated");
    } catch (err) {
      toast.error(err?.message || "Failed to upload profile image");
    } finally {
      setUploading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleCancel = () => setEditMode(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localClub) {
      return;
    }
    setSavingDetails(true);
    const payload = {
      country: form.country?.trim() ?? "",
      city: form.city?.trim() ?? "",
      address: form.address?.trim() ?? "",
      ghinNumber: form.ghinNumber?.trim() ?? "",
    };

    try {
      const updated = await updateClubInfo(localClub._id, payload);
      const normalized = {
        ...localClub,
        ...updated,
        fullName: updated.name ?? localClub.fullName,
        email: updated.clubEmail ?? localClub.email,
        country: updated.country ?? payload.country,
        city: updated.city ?? payload.city,
        address: updated.address ?? payload.address,
        ghinNumber: updated.ghinNumber ?? payload.ghinNumber,
        coverImageUrl: updated.coverImageUrl ?? localClub.coverImageUrl,
        profileImageUrl:
          updated.profileImageUrl ?? localClub.profileImageUrl,
      };
      setLocalClub(normalized);
      setForm((prev) => ({
        ...prev,
        fullName: normalized.fullName,
        country: normalized.country,
        city: normalized.city,
        address: normalized.address,
        ghinNumber: normalized.ghinNumber,
      }));
      toast.success("Club updated successfully");
      setEditMode(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update club details");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAssignManager = async (clubId, golfer) => {
    if (!golfer) {
      toast.error("Please select a golfer before assigning.");
      return;
    }

    try {
      await assignManager(clubId, golfer._id);
      setLocalClub((prev) => ({
        ...prev,
        manager: {
          fullName: golfer.fullName,
          email: golfer.email,
        },
      }));
      toast.success("Manager assigned successfully and credentials emailed");
    } catch (err) {
      toast.error(err?.message || "Failed to assign manager");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Cover */}
      <div className="relative h-56 bg-gray-200">
        {localClub.coverImageUrl ? (
          <img
            src={localClub.coverImageUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            No cover image yet
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#9D4C1D] shadow">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleCoverUpload}
            />
            {uploading.cover ? "Uploading..." : "Update cover"}
          </label>
        </div>
        {/* Profile Image */}
        <div className="absolute -bottom-14 left-6">
          <div className="relative">
            <img
              src={localClub.profileImageUrl || ""}
              alt="Profile"
              className="h-28 w-28 rounded-full border-4 border-white object-cover bg-white"
            />
            <label className="absolute bottom-0 right-0 flex cursor-pointer items-center justify-center rounded-full bg-white p-1 text-[10px] font-semibold text-[#9D4C1D] shadow">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileUpload}
              />
              {uploading.profile ? "..." : "Change"}
            </label>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pt-16 px-6 pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {editMode ? (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded px-3 py-2 w-full md:w-auto"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                readOnly
                placeholder="Email"
                className="border rounded px-3 py-2 w-full md:w-auto"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{localClub.fullName}</h1>
              <p className="text-sm text-gray-500">
                {localClub.email || localClub.clubEmail}
              </p>
            </div>
          )}

          <div>
            {editMode ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={savingDetails}
                  className="bg-[#9D4C1D] text-white px-4 py-2 rounded hover:bg-[#7a3814] disabled:bg-[#b37555]"
                >
                  {savingDetails ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-[#9D4C1D] text-white px-4 py-2 rounded hover:bg-[#7a3814]"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="my-6 border-t" />

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["country", "city", "address", "ghinNumber"].map((field) => (
            <div key={field}>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </p>
              {editMode ? (
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">
                  {localClub[field] ?? "—"}
                </p>
              )}
            </div>
          ))}

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              Manager
            </p>

            {localClub.manager ? (
              <p className="text-sm font-medium text-gray-800">
                {`${localClub.manager.fullName} (${localClub.manager.email})`}
              </p>
            ) : (
              <button
                onClick={() => setAssignModal(true)}
                className="bg-[#9D4C1D] text-white px-3 py-1 rounded hover:bg-[#7a3814] text-sm"
              >
                Assign Manager
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {tabConfig.map((tab) => {
              const count = currentRoles[tab.key]?.length ?? 0;
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={`tab-${tab.key}`}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-[#9D4C1D] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#9D4C1D]"
                  }`}
                >
                  {tab.label}{" "}
                  <span className="text-xs font-medium text-gray-400">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
            {activeRoleList.length === 0 ? (
              <p className="text-sm text-gray-500">
                {activeTab === "members"
                  ? "No members have been assigned to this club yet."
                  : "No managers have been assigned to this club yet."}
              </p>
            ) : (
              activeRoleList.map((entry) => (
                <div
                  key={`${entry.golferId}-${entry.user?.email ?? entry.roles?.join("-")}`}
                  className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-white px-4 py-3"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {entry.user?.fullName ?? "Unknown golfer"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {entry.user?.email ?? "Email unavailable"}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {activeTab === "managers" ? "Manager" : "Member"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AssignModal
        clubId={id}
        golfers={golfers}
        isOpen={assignModal}
        onClose={() => setAssignModal(false)}
        onAssign={handleAssignManager}
      />
    </div>
  );
};

export default ClubProfile;
