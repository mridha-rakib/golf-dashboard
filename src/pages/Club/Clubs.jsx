import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useClubStore } from "../../stores/clubStore";
import AddClubModal from "./AddClubModal";
import AssignRolesModal from "./AssignRolesModal";
import ClubTable from "./ClubTable";
import confirmDialog from "../../utils/confirm";

function Clubs() {
  const clubs = useClubStore((state) => state.clubs);
  const golfers = useClubStore((state) => state.golfers);
  const clubRoles = useClubStore((state) => state.clubRoles);
  const loading = useClubStore((state) => state.loading);
  const error = useClubStore((state) => state.error);
  const fetchClubs = useClubStore((state) => state.fetchClubs);
  const fetchGolfers = useClubStore((state) => state.fetchGolfers);
  const fetchClubRoles = useClubStore((state) => state.fetchClubRoles);
  const updateClubRoles = useClubStore((state) => state.updateClubRoles);
  const createClub = useClubStore((state) => state.createClub);
  const deleteClub = useClubStore((state) => state.deleteClub);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeClubId, setActiveClubId] = useState(null);
  const [isFetchingRoles, setIsFetchingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingClub, setIsCreatingClub] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClubs().catch((err) =>
      toast.error(err?.message || "Unable to load clubs")
    );
    fetchGolfers().catch((err) =>
      toast.error(err?.message || "Unable to load golfers")
    );
  }, [fetchClubs, fetchGolfers]);

  useEffect(() => {
    if (!clubs.length) return;
    clubs.forEach((club) => {
      if (!clubRoles[club._id]) {
        fetchClubRoles(club._id).catch(() => {});
      }
    });
  }, [clubs, clubRoles, fetchClubRoles]);

  const handleAssignClick = async (clubId) => {
    setActiveClubId(clubId);
    setIsFetchingRoles(true);
    try {
      // Assign button loads GET /golf-clubs/:clubId/roles before showing the modal.
      await fetchClubRoles(clubId);
      setAssignModalOpen(true);
    } catch (err) {
      toast.error(err?.message || "Unable to load club roles");
      setActiveClubId(null);
    } finally {
      setIsFetchingRoles(false);
    }
  };

  const handleModalClose = () => {
    setAssignModalOpen(false);
    setActiveClubId(null);
  };

  const handleSaveRoles = async ({ managerIds, memberIds, clubPassword }) => {
    if (!activeClubId) return;
    setIsSaving(true);
    try {
      await updateClubRoles(activeClubId, { managerIds, memberIds, clubPassword });
      toast.success("Club roles updated");
      handleModalClose();
    } catch (err) {
      toast.error(err?.message || "Unable to update club roles");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateClub = async ({ clubName, email, password, address, managerIds }) => {
    setIsCreatingClub(true);
    try {
      await createClub({ clubName, email, password, address, managerIds });
      toast.success("Club created successfully");
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(err?.message || "Unable to create club");
    } finally {
      setIsCreatingClub(false);
    }
  };

  const handleDeleteClub = async (club) => {
    if (!club) return;
    const confirmed = await confirmDialog(
      `Delete club “${club.name}”?`,
      "This will permanently remove the club, its managers/members, and login account."
    );
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteClub(club._id);
      toast.success("Club deleted");
    } catch (err) {
      toast.error(err?.message || "Unable to delete club");
    } finally {
      setIsDeleting(false);
    }
  };

  const activeClub = clubs.find((club) => club._id === activeClubId) ?? null;
  const activeClubRoles = activeClubId ? clubRoles[activeClubId] : null;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Management
          </p>
          <h1 className="text-2xl font-semibold">All clubs</h1>
        </div>
        <p className="text-sm text-gray-600">
          Assign golfers as members and managers per club.
        </p>
      </header>

      {error && (
        <p className="px-4 text-sm text-red-600">
          {error || "Failed to load club data."}
        </p>
      )}

      <div className="flex items-center justify-between px-4">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          management
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-md bg-[#9D4C1D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7f3c17] focus:outline-none focus:ring-2 focus:ring-[#9D4C1D] focus:ring-offset-2"
        >
          + Add Club
        </button>
      </div>
      <ClubTable
        clubs={clubs}
        clubRoles={clubRoles}
        loading={loading || isDeleting}
        onAssign={handleAssignClick}
        onDelete={handleDeleteClub}
      />

      <AssignRolesModal
        isOpen={assignModalOpen}
        club={activeClub}
        golfers={golfers}
        roles={activeClubRoles}
        onClose={handleModalClose}
        onSave={handleSaveRoles}
        loadingRoles={isFetchingRoles}
        saving={isSaving}
      />
      <AddClubModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateClub}
        loading={isCreatingClub}
        golfers={golfers}
      />
    </div>
  );
}

export default Clubs;
