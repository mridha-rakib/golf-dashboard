import http from "../lib/http";
import API_PATHS from "../lib/apiPaths";

export const login = async (email, password) => {
  const res = await http.post(API_PATHS.auth.login, { email, password });
  const payload = res.data?.data ?? res.data;
  return {
    user: payload.user,
    tokens: {
      accessToken: payload.accessToken || payload.tokens?.accessToken,
      expiresIn: payload.expiresIn || payload.tokens?.expiresIn,
    },
  };
};

export const fetchProfile = async () => {
  const res = await http.get(API_PATHS.auth.profile);
  return res.data?.data ?? res.data;
};

export default {
  login,
  fetchProfile,
};
