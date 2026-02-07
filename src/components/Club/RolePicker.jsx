const RolePicker = ({
  title,
  searchValue,
  onSearchChange,
  options = [],
  selectedIds = [],
  onToggle,
}) => {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        <input
          type="search"
          placeholder="Search golfers"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div className="max-h-52 overflow-y-auto rounded-md bg-white">
        {options.length === 0 ? (
          <p className="p-4 text-xs text-gray-500">No golfers match the search.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {options.map((option) => (
              <li
                key={option._id}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
              >
                <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(option._id)}
                    onChange={() => onToggle(option._id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    {option.subLabel && (
                      <p className="text-xs text-gray-400">{option.subLabel}</p>
                    )}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RolePicker;
