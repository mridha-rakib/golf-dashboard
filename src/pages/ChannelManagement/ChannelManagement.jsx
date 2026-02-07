// src/components/ChannelManagement.jsx
import { Add01Icon, Task01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberDropdown from "../../components/Game-and-event-management/MemberDropdown";
import { clubs as clubData } from "../../constants/clubs";

const ChannelManagement = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const metricCards = [
    { title: "Total Channels", value: channels.length },
    { title: "Active Channels", value: channels.length },
  ];


  const clubs = clubData.map((club, index) => ({
    _id: `club-${index + 1}`,
    clubName: club.clubname,
    members: club.members,
  }));
  const clubsLoading = false;
  const clubsError = false;

  // Selected club ID
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Set default club once clubs load
  useEffect(() => {
    if (clubs.length && !selectedClubId) {
      setSelectedClubId(clubs[0]._id);
    }
  }, [clubs, selectedClubId]);

  // Fetch members for selected club
  const selectedClub = clubs.find((club) => club._id === selectedClubId);
  const membersLoading = false;
  const membersError = false;
  const members = (selectedClub?.members || []).map((name, index) => ({
    id: `${selectedClubId}-member-${index + 1}`,
    name,
  }));

  const [selectedClubUserId, setSelectedClubUserId] = useState("")
  const handleClubChange = (e) => {
  const id = e.target.value;
  setSelectedClubId(id);

  // Find the selected club object
  const clubObj = clubs.find(c => c._id === id);
  console.log("clubObj",clubObj)
  // Save its userId
  setSelectedClubUserId(clubObj?.userId || "");
  console.log("selectedClubUserId",selectedClubUserId)

  // Reset members when club changes
  setSelectedMembers([]);
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    console.log("selectedClubId",selectedClubId)
    // Find the selected club object to get the name
    const clubObj = clubs.find(c => c._id === selectedClubId);
    const clubName = clubObj?.clubName || clubObj?.name || "";
    const payload = {
      title: form.title?.value || "",
      name: clubName,
      clubId: selectedClubId,       // Backend expects "name" as club name
      members: [...selectedMembers, selectedClubId], // array of member IDs
    };
    console.log("payload", payload)

    setChannels((prev) => [
      {
        _id: `channel-${Date.now()}`,
        title: payload.title,
        clubId: { clubProfileImage: "", clubName },
        members: payload.members,
      },
      ...prev,
    ]);
    form.reset();
    setSelectedMembers([]);
  };


  const handleFormReset = () => {
    if (clubs[0]?._id) {
      setSelectedClubId(clubs[0]._id);
    }
    setSelectedMembers([]);
    document.getElementById("event-form")?.reset();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold text-gray-900">
          Golf Channels
        </h2>
        <p className="mb-6 text-gray-600">See all channels you have created so far</p>

        <div onClick={() => navigate("/channel-management/all-channel")} className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#F5EDE8] rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow">
            <HugeiconsIcon icon={Task01Icon} />
            <span className="text-sm sm:text-base font-semibold">All Channels</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-[20px] sm:text-[24px] lg:text-3xl font-bold text-gray-900">
            Golf Channel Metrics
          </h2>
          <span className="text-gray-600 text-sm sm:text-base">Overview of golf channels.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {metricCards.map((card, index) => (
            <div key={index} className="bg-[#F5EDE8] rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
              <p className="text-[20px] sm:text-[24px] lg:text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Channel Form */}
      <div>
        <div className="mb-6">
          <h2 className="text-[20px] sm:text-[24px] lg:text-3xl font-bold text-gray-900">
            Create New Channel
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Fill in the details to create a new club channel</p>
        </div>

        <form onSubmit={handleSubmit} id="event-form" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title */}
            <div>
              <label className="block mb-1 text-sm sm:text-base font-medium">Title</label>
              <input
                type="text"
                name="title"
                className="rounded-lg bg-[#F5EDE8] p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9D4C1D]"
                placeholder="Channel title"
              />
            </div>

            {/* Club selection */}
            <div>
              <label className="block mb-1 text-sm sm:text-base font-medium">Club</label>
              {clubsLoading ? (
                <div className="rounded-lg bg-[#F5EDE8] p-2 w-full">Loading clubs...</div>
              ) : clubsError ? (
                <div className="rounded-lg bg-red-100 p-2 w-full text-red-600">Failed to load clubs</div>
              ) : (
                <select
                  name="club"
                  value={selectedClubId}
                  onChange={handleClubChange}
                  className="rounded-lg bg-[#F5EDE8] p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9D4C1D]"
                >
                  {clubs.map(club => (
                    <option key={club._id} value={club._id}>
                      {club.clubName ?? club.name ?? "Unknown Club"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Club Members */}
            <div>
              <label className="block mb-1 text-sm sm:text-base font-medium">Club Members</label>
              {membersLoading ? (
                <div className="rounded-lg bg-[#F5EDE8] p-2 w-full">Loading members...</div>
              ) : membersError ? (
                <div className="rounded-lg bg-red-100 p-2 w-full text-red-600">Failed to load members</div>
              ) : (
                <MemberDropdown
                  members={members}
                  selectedMembers={selectedMembers}
                  setSelectedMembers={setSelectedMembers}
                />
              )}
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleFormReset}
            className="px-4 py-2 bg-[#F5EDE8] text-[#9D4C1D] rounded-lg hover:bg-[#ecdcd3] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="event-form"
            className="px-4 py-2 flex items-center gap-2 bg-[#9D4C1D] text-white rounded-lg hover:bg-[#7a3814] transition"
          >
            <HugeiconsIcon icon={Add01Icon} />
            Create Channel
          </button>
        </div>
      </div>

      {/* Debug */}
      {event && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Channel to create</h4>
          <pre className="text-sm">{JSON.stringify(event, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ChannelManagement;
