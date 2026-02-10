import http from "../lib/http";
import API_PATHS from "../lib/apiPaths";

export const listNotifications = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const res = await http.get(API_PATHS.notifications.list, {
    params: { page, limit },
  });
  const data = res.data?.data ?? [];
  const pagination = res.data?.pagination ?? null;
  return { data, pagination };
};

export const updateNotificationsRead = async ({
  notificationId,
  notificationIds,
  countOnly,
} = {}) => {
  const res = await http.patch(API_PATHS.notifications.list + "/read", {
    notificationId,
    notificationIds,
    countOnly,
  });
  return res.data?.data ?? res.data;
};

export default {
  listNotifications,
  updateNotificationsRead,
};
