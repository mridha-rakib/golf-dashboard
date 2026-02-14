export const API_PATHS = {
  auth: {
    login: "/auth/login",
    profile: "/user/profile",
  },
  clubs: {
    list: "/golf-clubs",
    listGolfers: "/golf-clubs/golfers",
    exportUsers: "/golf-clubs/export/users",
    roles: (clubId) => `/golf-clubs/${clubId}/roles`,
    profileImage: (clubId) => `/golf-clubs/${clubId}/profile-image`,
    coverImage: (clubId) => `/golf-clubs/${clubId}/cover-image`,
    manager: (clubId) => `/golf-clubs/${clubId}/manager`,
  },
  users: {
    profileImage: "/user/profile/image-upload",
    updateStatus: (userId) => `/user/${userId}/status`,
    get: (userId) => `/user/${userId}`,
    delete: (userId) => `/user/${userId}`,
  },
  notifications: {
    list: "/notifications",
  },
};

export default API_PATHS;
