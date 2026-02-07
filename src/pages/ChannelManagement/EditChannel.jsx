// src/components/EditChannel.jsx
import React, { useState, useEffect } from "react";
import { clubs } from "../../constants/clubs";
import MemberDropdown from "../../components/Game-and-event-management/MemberDropdown";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

const EditChannel = ({ initialData }) => {
  // ✅ Prefill from props (when editing an existing channel)
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedClub, setSelectedClub] = useState(initialData?.club || clubs[0]?.clubname || "");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(initialData?.members || []);

  useEffect(() => {
    const club = clubs.find((c) => c.clubname === selectedClub);
    setMembers(club ? club.members : []);
  }, [selectedClub]);

  const handleClubChange = (e) => {
    const clubName = e.target.value;
    setSelectedClub(clubName);
    const club = clubs.find((c) => c.clubname === clubName);
    setMembers(club ? club.members : []);
    setSelectedMembers([]); // Reset members on club change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedChannel = {
      title,
      club: selectedClub,
      members: selectedMembers,
    };
    console.log("Updated Channel:", updatedChannel);
    // 🔗 send to API here
  };

  return (
    <div className=" bg-white rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] sm:text-[24px] lg:text-3xl font-bold text-gray-900">
          Edit Channel
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Modify the details of the channel
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        id="edit-channel-form"
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg bg-[#F5EDE8] p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9D4C1D]"
            />
          </div>

          {/* Club */}
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium">
              Club
            </label>
            <select
              name="club"
              value={selectedClub}
              onChange={handleClubChange}
              className="rounded-lg bg-[#F5EDE8] p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9D4C1D]"
            >
              {clubs.map((club) => (
                <option key={club.clubname} value={club.clubname}>
                  {club.clubname}
                </option>
              ))}
            </select>
          </div>

          {/* Members */}
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium">
              Club Members
            </label>
            <MemberDropdown
              members={members}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
            />
          </div>
        </div>
      </form>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            setTitle(initialData?.title || "");
            setSelectedClub(initialData?.club || clubs[0]?.clubname || "");
            setSelectedMembers(initialData?.members || []);
          }}
          className="px-4 py-2 bg-[#F5EDE8] text-[#9D4C1D] rounded-lg hover:bg-[#ecdcd3] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="edit-channel-form"
          className="px-4 py-2 flex items-center gap-2 bg-[#9D4C1D] text-white rounded-lg hover:bg-[#7a3814] transition"
        >
          <HugeiconsIcon icon={Add01Icon} />
          Update Channel
        </button>
      </div>
    </div>
  );
};

export default EditChannel;
