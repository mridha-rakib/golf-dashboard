import http from "../lib/http";
import API_PATHS from "../lib/apiPaths";

export const updateUserStatus = async (userId, accountStatus) => {
  const res = await http.patch(API_PATHS.users.updateStatus(userId), {
    accountStatus,
  });
  return res.data?.data ?? res.data;
};

export const deleteUser = async (userId) => {
  const res = await http.delete(API_PATHS.users.delete(userId));
  return res.data?.data ?? res.data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await http.post(API_PATHS.users.profileImage, formData);
  return res.data?.data ?? res.data;
};

export default {
  updateUserStatus,
  deleteUser,
  uploadProfileImage,
};
