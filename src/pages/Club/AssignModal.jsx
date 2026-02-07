import { useEffect, useMemo, useState } from "react";

function AssignModal({ clubId, golfers = [], isOpen, onClose, onAssign }) {
  const [selectedGolferId, setSelectedGolferId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedGolferId(null);
    }
  }, [isOpen]);

  const filteredGolfers = useMemo(() => {
    if (!query.trim()) return golfers;
    const normalized = query.trim().toLowerCase();
    return golfers.filter((golfer) => {
      const name = golfer.fullName?.toLowerCase() ?? "";
      const email = golfer.email?.toLowerCase() ?? "";
      return name.includes(normalized) || email.includes(normalized);
    });
  }, [golfers, query]);

  const selectedGolfer = golfers.find(
    (golfer) => golfer._id === selectedGolferId
  );

  if (!isOpen) return null;

  const handleAssign = () => {
    if (!selectedGolfer) return;
    onAssign(clubId, selectedGolfer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Assign Manager</h3>
        <input
          placeholder="Search golfers by name or email"
          className="mb-3 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#a24405] focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {filteredGolfers.map((golfer) => (
            <li
              key={golfer._id}
              onClick={() => setSelectedGolferId(golfer._id)}
              className={`cursor-pointer rounded-md border px-3 py-2 transition ${
                selectedGolferId === golfer._id
                  ? "border-[#a24405] bg-[#fff4e7] text-[#5b3b19]"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              <p className="text-sm font-semibold">{golfer.fullName}</p>
              <p className="text-xs text-gray-500">{golfer.email}</p>
            </li>
          ))}
          {filteredGolfers.length === 0 && (
            <li className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400">
              No golfers match your search.
            </li>
          )}
        </ul>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedGolfer}
            className="rounded-md bg-[#a24405] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7a3814] disabled:cursor-not-allowed disabled:bg-[#f0c8a1]"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignModal;
