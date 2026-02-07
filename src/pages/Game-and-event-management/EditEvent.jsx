import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { events } from "../../constants/events";
import { gameFormats } from "../../constants/gameFormats";
import { clubs } from "../../constants/clubs";

const EditEvent = () => {
  const { id } = useParams();
  const event = events.find((event) => event.id === Number(id)); // convert id to number

  const [selectedClub, setSelectedClub] = useState(clubs[0].clubname);
  const [members, setMembers] = useState(clubs[0].members);

  if (!event) {
    return <div className="text-red-500 text-xl">Event not found!</div>;
  }

  const handleClubChange = (e) => {
    const clubName = e.target.value;
    setSelectedClub(clubName);
    const club = clubs.find((c) => c.clubname === clubName);
    setMembers(club.members);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      date: e.target.date.value,
      time: e.target.time.value,
      club: e.target.club.value,
      member: e.target.member.value,
      game: e.target.game.value,
    };
    console.log("Updated Event Data:", data);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-[28px] font-bold text-gray-900">
          Edit Event
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Modify the details of the golf event.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        id="event-form"
        className="flex flex-col gap-4"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-[16px] font-medium">Calendar</label>
            <input
              type="date"
              name="date"
              className="rounded-lg bg-[#F5EDE8] p-2 w-full"
              defaultValue={event.date}
            />
          </div>
          <div>
            <label className="block mb-1 text-[16px] font-medium">Time</label>
            <input
              type="time"
              name="time"
              className="rounded-lg bg-[#F5EDE8] p-2 w-full"
              defaultValue={event.time}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-[16px] font-medium">Club</label>
            <select
              name="club"
              value={selectedClub}
              onChange={handleClubChange}
              className="rounded-lg bg-[#F5EDE8] p-2 w-full"
            >
              {clubs.map((club) => (
                <option key={club.clubname} value={club.clubname}>
                  {club.clubname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-[16px] font-medium">Club Members</label>
            <select
              name="member"
              disabled={!members.length}
              className="rounded-lg bg-[#F5EDE8] p-2 w-full"
              defaultValue={event.member}
            >
              {members.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div>
          <label className="block mb-1 text-[16px] font-medium">Game Type</label>
          <select
            name="game"
            className="rounded-lg bg-[#F5EDE8] p-2 w-full"
            defaultValue={event.game}
          >
            {Object.entries(gameFormats).map(([group, options]) => (
              <optgroup key={group} label={group}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => document.getElementById("event-form").reset()}
            className="px-4 py-2 bg-[#F5EDE8] text-[#9D4C1D] rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="event-form"
            className="px-4 py-2 flex items-center gap-2 bg-[#9D4C1D] text-white rounded-lg"
          >
            <HugeiconsIcon icon={Add01Icon} />
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
