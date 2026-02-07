import React, { useState, useRef, useEffect } from "react";

const MemberDropdown = ({ members = [], selectedMembers, setSelectedMembers }) => {
  // console.log(`members from member component ${members}`)
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const selectAllRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync Select All checkbox
  useEffect(() => {
    if (!selectAllRef.current) return;

    if (selectedMembers.length === 0) {
      selectAllRef.current.indeterminate = false;
      selectAllRef.current.checked = false;
    } else if (selectedMembers.length === members.length) {
      selectAllRef.current.indeterminate = false;
      selectAllRef.current.checked = true;
    } else {
      selectAllRef.current.indeterminate = true;
    }
  }, [selectedMembers, members]);

  // Reset selectedMembers when members list changes (e.g., new club)
  // useEffect(() => {
  //   setSelectedMembers([]);
  // }, [members, setSelectedMembers]);

  // Toggle individual member
  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map((m) => m.id));
    }
  };

  // Display selected names
  const selectedLabels = members
    .filter((m) => selectedMembers.includes(m.id))
    .map((m) => m.name);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Header */}
      <div
        className="rounded-lg bg-[#F5EDE8] p-2 w-full cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {selectedMembers.length === 0
            ? "Select Members"
            : selectedMembers.length === members.length
            ? "All selected"
            : selectedLabels.join(", ")}
        </span>
        <span className="ml-2 text-gray-500">▼</span>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-10 w-full mt-1 max-h-56 overflow-y-auto bg-white border rounded-lg shadow-lg p-2">
          {/* Select All */}
          <div className="flex items-center mb-2 px-2">
            <input
              ref={selectAllRef}
              type="checkbox"
              onChange={toggleSelectAll}
              className="mr-2"
            />
            <span className="font-medium text-sm">Select All</span>
          </div>

          <hr className="my-1" />

          {/* Individual Members */}
          {members.length > 0 ? (
            members.map((member) => (
              <div key={member.id} className="flex items-center mb-1 px-2">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => toggleMember(member.id)}
                  className="mr-2"
                />
                <span className="text-sm">{member.name}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-2">No members available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
