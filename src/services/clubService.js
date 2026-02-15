import API_PATHS from "../lib/apiPaths";
import http from "../lib/http";

export const listClubs = async () => {
  const res = await http.get(API_PATHS.clubs.list);
  return res.data?.data ?? res.data;
};

export const listGolfers = async () => {
  const res = await http.get(API_PATHS.clubs.listGolfers);
  return res.data?.data ?? res.data;
};

const escapeCsvCell = (value) => {
  const stringValue = value == null ? "" : String(value);
  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
};

export const exportUsersExcel = async () => {
  const [golfers, clubs] = await Promise.all([listGolfers(), listClubs()]);
  const rows = [];

  (golfers ?? []).forEach((user) => {
    const statusRaw = String(user?.accountStatus || "").toLowerCase();
    rows.push({
      id: user?._id || "",
      name: user?.fullName || user?.userName || user?.email || "",
      userName: user?.userName || "",
      email: user?.email || "",
      role: user?.role || "golfer",
      status: statusRaw === "active" ? "Active" : "Banned",
      clubName: user?.clubName || "",
      memberCount: user?.clubMemberCount ?? 0,
      managerCount: user?.clubManagerCount ?? 0,
      ghin:
        Array.isArray(user?.ghinNumbers) && user.ghinNumbers.length > 0
          ? user.ghinNumbers.join(" | ")
          : user?.ghinNumber || "",
    });
  });

  (clubs ?? []).forEach((club) => {
    rows.push({
      id: club?.clubUserId || club?._id || "",
      name: club?.name || "",
      userName: club?.clubUserName || "",
      email: club?.clubEmail || "",
      role: "golf_club",
      status: "Active",
      clubName: club?.name || "",
      memberCount: club?.memberCount ?? 0,
      managerCount: "",
      ghin: club?.ghinNumber || "",
    });
  });

  const header = [
    "ID",
    "Name",
    "User Name",
    "Email",
    "Role",
    "Status",
    "Club",
    "Members",
    "Managers",
    "GHIN",
  ];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.name,
        row.userName,
        row.email,
        row.role,
        row.status,
        row.clubName,
        row.memberCount,
        row.managerCount,
        row.ghin,
      ]
        .map(escapeCsvCell)
        .join(","),
    ),
  ];

  const content = lines.join("\n");
  const dateTag = new Date().toISOString().slice(0, 10);

  return {
    blob: new Blob([content], { type: "text/csv;charset=utf-8;" }),
    fileName: `users-export-${dateTag}.csv`,
  };
};

export const fetchClubRoles = async (clubId) => {
  const res = await http.get(API_PATHS.clubs.roles(clubId));
  return res.data?.data ?? res.data;
};

export const updateClubRoles = async (clubId, payload) => {
  const res = await http.put(API_PATHS.clubs.roles(clubId), payload);
  return res.data?.data ?? res.data;
};

export const createClub = async (payload) => {
  const res = await http.post(API_PATHS.clubs.list, payload);
  return res.data?.data ?? res.data;
};

export const updateClubInfo = async (clubId, payload) => {
  const res = await http.put(`${API_PATHS.clubs.list}/${clubId}`, payload);
  return res.data?.data ?? res.data;
};

export const uploadClubProfileImage = async (clubId, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await http.post(API_PATHS.clubs.profileImage(clubId), formData);
  return res.data?.data ?? res.data;
};

export const uploadClubCoverImage = async (clubId, file) => {
  const formData = new FormData();
  formData.append("coverImage", file);
  const res = await http.post(API_PATHS.clubs.coverImage(clubId), formData);
  return res.data?.data ?? res.data;
};

export const assignManager = async (clubId, golferUserId) => {
  const res = await http.post(API_PATHS.clubs.manager(clubId), {
    golferUserId,
  });
  return res.data?.data ?? res.data;
};

export const deleteClub = async (clubId) => {
  const res = await http.delete(`${API_PATHS.clubs.list}/${clubId}`);
  return res.data?.data ?? res.data;
};

export default {
  listClubs,
  listGolfers,
  exportUsersExcel,
  fetchClubRoles,
  updateClubRoles,
  createClub,
  updateClubInfo,
  uploadClubProfileImage,
  uploadClubCoverImage,
  assignManager,
  deleteClub,
};
