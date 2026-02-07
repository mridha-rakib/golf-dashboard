import { useEffect, useMemo, useState } from "react";
import RolePicker from "../../components/Club/RolePicker";

const useDebouncedValue = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

// Modal fetches GET /golf-clubs/:clubId/roles and saves via PUT /golf-clubs/:clubId/roles.
const AssignRolesModal = ({
  isOpen,
  club,
  golfers = [],
  roles,
  onClose,
  onSave,
  loadingRoles = false,
  saving = false,
}) => {
  const [managerQuery, setManagerQuery] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const debouncedManagerQuery = useDebouncedValue(managerQuery);
  const debouncedMemberQuery = useDebouncedValue(memberQuery);

  useEffect(() => {
    setSelectedManagerIds(
      roles?.managers.map((entry) => entry.golferId) ?? []
    );
    setSelectedMemberIds(
      roles?.members.map((entry) => entry.golferId) ?? []
    );
  }, [roles]);

  useEffect(() => {
    if (!isOpen) {
      setManagerQuery("");
      setMemberQuery("");
    }
  }, [isOpen]);

  const golfersById = useMemo(
    () =>
      new Map(
        (golfers || []).map((golfer) => [golfer._id, golfer])
      ),
    [golfers]
  );

  const filterGolfers = (search) => {
    const term = (search || "").trim().toLowerCase();
    const source = golfers || [];
    if (!term) {
      return source;
    }
    return source.filter((golfer) => {
      const name = golfer.fullName?.toLowerCase() ?? "";
      const email = golfer.email?.toLowerCase() ?? "";
      return name.includes(term) || email.includes(term);
    });
  };

  const managerOptions = filterGolfers(debouncedManagerQuery);
  const memberOptions = filterGolfers(debouncedMemberQuery);

  const toggleSelection = (id, isManager) => {
    if (isManager) {
      setSelectedManagerIds((prev) =>
        prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
      );
    } else {
      setSelectedMemberIds((prev) =>
        prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
      );
    }
  };

  const handleRemove = (id, isManager) => {
    toggleSelection(id, isManager);
  };

  const handleSave = () => {
    onSave({
      managerIds: selectedManagerIds,
      memberIds: selectedMemberIds,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        <div className="flex h-full max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl">
          <header className="flex flex-col gap-1 border-b border-gray-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Assign Club Roles</h2>
              <p className="text-sm text-gray-500">
                Manage club members and managers for{" "}
                <span className="font-medium text-gray-700">
                  {club?.name ?? "the selected club"}
                </span>
                .
              </p>
            </div>
            {loadingRoles && (
              <p className="text-xs uppercase tracking-wide text-blue-600">
                Loading current assignments...
              </p>
            )}
          </header>

          <div className="flex-1 overflow-y-auto space-y-6 px-6 py-4">
            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Managers</p>
                <p className="text-xs text-gray-500">
                  Search and toggle golfers to give them manager privileges. New managers will receive the club login.
                </p>
              </div>
              {selectedManagerIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedManagerIds.map((id) => {
                    const golfer = golfersById.get(id);
                    if (!golfer) return null;
                    return (
                      <span
                        key={`manager-chip-${id}`}
                        className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {golfer.fullName}
                        <button
                          type="button"
                          onClick={() => handleRemove(id, true)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <RolePicker
                title="Managers"
                searchValue={managerQuery}
                onSearchChange={setManagerQuery}
                options={managerOptions.map((golfer) => ({
                  _id: golfer._id,
                  label: golfer.fullName,
                  subLabel: golfer.email,
                }))}
                selectedIds={selectedManagerIds}
                onToggle={(id) => toggleSelection(id, true)}
              />
            </section>

            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Members</p>
                <p className="text-xs text-gray-500">
                  Pick golfers who should stay in the membership list.
                </p>
              </div>
              {selectedMemberIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMemberIds.map((id) => {
                    const golfer = golfersById.get(id);
                    if (!golfer) return null;
                    return (
                      <span
                        key={`member-chip-${id}`}
                        className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                      >
                        {golfer.fullName}
                        <button
                          type="button"
                          onClick={() => handleRemove(id, false)}
                          className="text-amber-500 hover:text-amber-700"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <RolePicker
                title="Members"
                searchValue={memberQuery}
                onSearchChange={setMemberQuery}
                options={memberOptions.map((golfer) => ({
                  _id: golfer._id,
                  label: golfer.fullName,
                  subLabel: golfer.email,
                }))}
                selectedIds={selectedMemberIds}
                onToggle={(id) => toggleSelection(id, false)}
              />
            </section>

          </div>

          <footer className="flex flex-wrap justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AssignRolesModal;
