import { useEffect, useState } from "react";

// HITS POST /golf-clubs with { clubName, email, password }
const AddClubModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  golfers = [],
}) => {
  const [form, setForm] = useState({
    clubName: "",
    email: "",
    password: "",
    address: "",
  });
  const [managerSearch, setManagerSearch] = useState("");
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setForm({
        clubName: "",
        email: "",
        password: "",
        address: "",
      });
      setSelectedManagerIds([]);
      setManagerSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.clubName || !form.email || !form.password) return;
    onSubmit({
      clubName: form.clubName.trim(),
      email: form.email.trim(),
      password: form.password,
      address: form.address.trim(),
      managerIds: selectedManagerIds,
    });
  };

  const filteredGolfers = (managerSearch || "")
    ? golfers.filter((golfer) => {
        const term = managerSearch.toLowerCase();
        return (
          golfer.fullName?.toLowerCase().includes(term) ||
          golfer.email?.toLowerCase().includes(term)
        );
      })
    : golfers;

  const toggleManager = (id) => {
    setSelectedManagerIds((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold">Add new club</h2>
        <p className="text-sm text-gray-500">
          Provide the club name, login email and password that golfers will use.
        </p>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Club Name
            </label>
            <input
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Club Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Address (optional)
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Managers (existing golfers)
              </label>
              <span className="text-[11px] text-gray-500">
                {selectedManagerIds.length} selected
              </span>
            </div>
            <input
              placeholder="Search golfer by name or email"
              value={managerSearch}
              onChange={(e) => setManagerSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200">
              {filteredGolfers.length === 0 && (
                <p className="px-3 py-2 text-xs text-gray-500">
                  No golfers found.
                </p>
              )}
              {filteredGolfers.map((golfer) => (
                <label
                  key={golfer._id}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedManagerIds.includes(golfer._id)}
                    onChange={() => toggleManager(golfer._id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#9D4C1D] focus:ring-[#9D4C1D]"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {golfer.fullName}
                    </p>
                    <p className="text-[11px] text-gray-500">{golfer.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-gray-500">
              Managers are optional. Anyone you select will get the club login
              (email + password) you set above.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:bg-orange-400"
            >
              {loading ? "Creating…" : "Create club"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClubModal;
