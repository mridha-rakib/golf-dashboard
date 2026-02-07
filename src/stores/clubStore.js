import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  createClub as createClubService,
  deleteClub as deleteClubService,
  fetchClubRoles as fetchClubRolesService,
  listClubs,
  listGolfers,
  updateClubInfo as updateClubInfoService,
  updateClubRoles as updateClubRolesService,
  assignManager as assignManagerService,
} from "../services/clubService";

export const useClubStore = create(
  devtools((set, get) => ({
    clubs: [],
    golfers: [],
    clubRoles: {},
    loading: false,
    error: null,

    fetchClubs: async () => {
      set({ loading: true, error: null });
      try {
        const clubs = await listClubs();

        console.log("Fetched clubs:", clubs); 
        set({ clubs, loading: false });
        return clubs;
      } catch (err) {
        const message = err?.message || "Failed to load clubs";
        set({ error: message, loading: false });
        throw err;
      }
    },

    fetchGolfers: async () => {
      set({ loading: true, error: null });
      try {
        const golfers = await listGolfers();
        set({ golfers, loading: false });
        return golfers;
      } catch (err) {
        const message = err?.message || "Failed to load golfers";
        set({ error: message, loading: false });
        throw err;
      }
    },

    fetchClubRoles: async (clubId) => {
      const roles = await fetchClubRolesService(clubId);

      console.log(`Fetched roles for club ${clubId}:`, roles);
      set((state) => ({
        clubRoles: { ...state.clubRoles, [clubId]: roles },
      }));
      return roles;
    },

    updateClubRoles: async (clubId, payload) => {
      const roles = await updateClubRolesService(clubId, payload);
      set((state) => ({
        clubRoles: { ...state.clubRoles, [clubId]: roles },
      }));
      await get().fetchClubs();
      return roles;
    },

    updateClubInfo: async (clubId, payload) => {
      set({ loading: true, error: null });
      try {
        const updated = await updateClubInfoService(clubId, payload);
        await get().fetchClubs();
        return updated;
      } catch (err) {
        const message = err?.message || "Unable to update club";
        set({ error: message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    createClub: async (payload) => {
      set({ loading: true, error: null });
      try {
        const newClub = await createClubService(payload);
        await get().fetchClubs();
        return newClub;
      } catch (err) {
        const message = err?.message || "Create club failed";
        set({ error: message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
    assignManager: async (clubId, golferUserId) => {
      set({ loading: true, error: null });
      try {
        const response = await assignManagerService(clubId, golferUserId);
        await get().fetchClubs();
        await get().fetchClubRoles(clubId);
        return response;
      } catch (err) {
        const message = err?.message || "Unable to assign manager";
        set({ error: message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },

    deleteClub: async (clubId) => {
      set({ loading: true, error: null });
      try {
        await deleteClubService(clubId);
        await get().fetchClubs();
        set((state) => {
          const newRoles = { ...state.clubRoles };
          delete newRoles[clubId];
          return { clubRoles: newRoles };
        });
      } catch (err) {
        const message = err?.message || "Unable to delete club";
        set({ error: message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
  }))
);

export const clubStore = {
  getState: () => useClubStore.getState(),
};
