import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ClubTable = ({
  clubs = [],
  clubRoles = {},
  loading,
  onAssign,
  onDelete,
}) => {
  const navigate = useNavigate();

  const rows = useMemo(() => {
    if (!clubs || clubs.length === 0) {
      return [];
    }

    return clubs.map((club, index) => {
      const roles = clubRoles[club._id];
      const managerNames = roles?.managers
        ?.map((entry) => entry.user.fullName)
        .filter(Boolean);
      const memberCount = club.memberCount ?? 0;

      return {
        index,
        club,
        managers: managerNames || [],
        memberCount,
      };
    });
  }, [clubs, clubRoles]);

  const emptyState =
    !loading && (!clubs || clubs.length === 0) ? (
      <tr>
        <td colSpan="5" className="px-6 py-6 text-sm text-center text-gray-500">
          No clubs available yet.
        </td>
      </tr>
    ) : null;

  return (
    <div className="overflow-hidden border border-[#f1ddd0] bg-white shadow-[0_15px_25px_rgba(134,94,58,0.15)]">
      <div className="bg-gradient-to-r from-[#fbeedd] to-[#f6deca] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#b7854f]">
        Clubs overview
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="bg-[#f2dacb]">
              <th className="py-3 px-6 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-[#b79c7c]">
                No
              </th>
              <th className="py-3 px-6 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-[#b79c7c]">
                Club Name
              </th>
              <th className="py-3 px-6 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-[#b79c7c]">
                Managers
              </th>
              <th className="py-3 px-6 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-[#b79c7c]">
                Members
              </th>
              <th className="py-3 px-6 text-left text-[10px] font-semibold uppercase tracking-[0.4em] text-[#b79c7c]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-6 text-sm text-center text-[#9D4C1D]"
                >
                  Loading clubs...
                </td>
              </tr>
            )}
            {!loading && emptyState}
            {!loading &&
              rows.map((row) => (
                <tr
                  key={row.club._id}
                  className="border-t border-[#efe2d1] bg-[#fffdfb] transition hover:bg-[#fff8f0]"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-[#6b553f]">
                    {row.index + 1}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-[#1f1409]">
                    {row.club.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-[#5b4a3d]">
                    <div className="flex flex-col gap-2">
                      {row.managers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {row.managers.map((name, idx) => (
                            <span
                              key={`${row.club._id}-manager-${idx}`}
                              className="rounded-full bg-[#e9f2ff] px-3 py-1 text-xs font-medium text-[#2254a1]"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#b68e68]">
                        {row.managers.length} manager
                        {row.managers.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#5b4a3d]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#f1ece5] px-3 py-1 text-xs font-semibold text-[#6b553f]">
                      <span className="rounded-full bg-[#fff4e7] px-2 py-0.5 text-[10px] text-[#b17b3d]">
                        {row.memberCount}
                      </span>
                      member{row.memberCount === 1 ? "" : "s"}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#5b4a3d]">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onAssign(row.club._id)}
                        className="rounded bg-white border border-[#a24405] px-4 py-1 text-xs font-semibold text-[#a24405] transition hover:bg-[#a24405] hover:text-white"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => navigate(`/clubs/${row.club._id}`)}
                        className="rounded bg-[#a24405] px-4 py-1 text-xs font-semibold text-white transition hover:bg-[#7a3814]"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onDelete?.(row.club)}
                        className="rounded bg-[#fff2ed] border border-[#e26a4c] px-4 py-1 text-xs font-semibold text-[#b02d0e] transition hover:bg-[#ffe3da]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubTable;
