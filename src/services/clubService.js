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
  fetchClubRoles,
  updateClubRoles,
  createClub,
  updateClubInfo,
  uploadClubProfileImage,
  uploadClubCoverImage,
  assignManager,
  deleteClub,
};
