import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getToken, setToken, clearToken, getUser, setUser, clearUser } from "../lib/storage";
import { login as loginRequest, fetchProfile } from "../services/authService";

const initialToken = getToken();
const initialUser = getUser();

export const useAuthStore = create(
  devtools((set, get) => ({
    user: initialUser,
    token: initialToken,
    loading: false,
    error: null,

    isAuthenticated: () => Boolean(get().token),
    isAdmin: () => get().user?.role === "admin",

    resetAuth: () =>
      set({
        user: null,
        token: null,
        loading: false,
        error: null,
      }),

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const { user, tokens } = await loginRequest(email, password);
        if (user.role !== "admin") {
          throw new Error("Only admin users can access this dashboard.");
        }
        if (!tokens?.accessToken) {
          throw new Error("Access token missing in response.");
        }
        setToken(tokens.accessToken);
        setUser(user);
        set({ user, token: tokens.accessToken, loading: false });
        return user;
      } catch (err) {
        const message = typeof err === "string" ? err : err?.message || "Login failed";
        set({ error: message, loading: false });
        throw err;
      }
    },

    logout: () => {
      clearToken();
      clearUser();
      set({ user: null, token: null, error: null, loading: false });
    },

    hydrateProfile: async () => {
      const token = get().token || getToken();
      if (!token) return null;
      try {
        const profile = await fetchProfile();
        setUser(profile);
        set({ user: profile, token });
        return profile;
      } catch (err) {
        // If token invalid, clear and bubble
        clearToken();
        clearUser();
        set({ user: null, token: null });
        throw err;
      }
    },
  })),
);

// Non-hook access for utilities (like axios interceptors)
export const authStore = {
  getState: () => useAuthStore.getState(),
  logout: () => useAuthStore.getState().logout(),
  resetAuth: () => useAuthStore.getState().resetAuth(),
};
