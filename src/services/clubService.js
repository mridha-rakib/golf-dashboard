import http from "../lib/http";
import API_PATHS from "../lib/apiPaths";

export const listClubs = async () => {
  const res = await http.get(API_PATHS.clubs.list);
  return res.data?.data ?? res.data;
};

export const listGolfers = async () => {
  const res = await http.get(API_PATHS.clubs.listGolfers);
  return res.data?.data ?? res.data;
};

const getFileNameFromDisposition = (contentDisposition) => {
  if (!contentDisposition) return "users-export.xlsx";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim());
  }

  const quotedMatch = contentDisposition.match(/filename=\"([^\"]+)\"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1].trim();
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (plainMatch?.[1]) {
    return plainMatch[1].replace(/\"/g, "").trim();
  }

  return "users-export.xlsx";
};

export const exportUsersExcel = async () => {
  const res = await http.get(API_PATHS.clubs.exportUsers, {
    responseType: "blob",
  });

  return {
    blob: res.data,
    fileName: getFileNameFromDisposition(res.headers?.["content-disposition"]),
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
