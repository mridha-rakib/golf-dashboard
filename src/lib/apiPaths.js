export const API_PATHS = {
  auth: {
    login: "/auth/login",
    profile: "/user/profile",
  },
  clubs: {
    list: "/golf-clubs",
    listGolfers: "/golf-clubs/golfers",
    roles: (clubId) => `/golf-clubs/${clubId}/roles`,
    profileImage: (clubId) => `/golf-clubs/${clubId}/profile-image`,
    coverImage: (clubId) => `/golf-clubs/${clubId}/cover-image`,
    manager: (clubId) => `/golf-clubs/${clubId}/manager`,
  },
  users: {
    updateStatus: (userId) => `/user/${userId}/status`,
    delete: (userId) => `/user/${userId}`,
  },
};

export default API_PATHS;
