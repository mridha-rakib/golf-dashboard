import {
    Calendar03Icon,
    ChampionIcon,
    Clock01Icon,
    Delete02Icon,
    PencilEdit02Icon,
    TickDouble01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clubAvatar from "../../assets/images/avatar.jpg";
import ConfirmationModal from "../ui/ConfirmationModal";

function EventCard({ event, setEvents }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUpcoming = event.status === "upcoming";

  const handleEdit = (id) => {
    navigate(`/game-event-management/${event.status}/edit-event/${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (setEvents) {
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
    }
    setShowDeleteModal(false);
  };

  // Format date (e.g., "Nov 15, 2025")
  const formattedDate = new Date(event.eventDate || event.date || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Club image (fallback if not found)
  const clubImage = event.clubId?.clubProfileImage || clubAvatar;
  const participantCount = event.currentParticipants ?? event.numberofparticipant ?? 0;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-4">
      {/* Top section */}
      <div className="flex items-center gap-3">
        <img
          src={clubImage}
          alt={event.clubId?.clubName || "Club"}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-bold">{event.clubId?.clubName || "Unnamed Club"}</h2>
          <p className="text-gray-600 text-sm">
            {event.courseId?.courseName || "No course assigned"}
          </p>
        </div>
        <div className="ml-auto">
          {isUpcoming ? (
            <button
              onClick={() => handleEdit(event._id)}
              className="text-[#9D4C1D]"
              title="Edit Event"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} className="w-6 h-6" />
            </button>
          ) : (
            <HugeiconsIcon
              icon={TickDouble01Icon}
              className="w-6 h-6 text-[#9D4C1D]"
              title="Completed"
            />
          )}
        </div>
      </div>

      {/* Date + Time */}
      <div className="flex items-center gap-4 mt-4 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar03Icon} className="w-6 h-6" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} className="w-6 h-6" />
          <span>{event.eventTime || "N/A"}</span>
        </div>
      </div>

      {/* Event Type */}
      <div className="flex items-center justify-center gap-2 mt-4 text-gray-700 font-medium">
        <HugeiconsIcon icon={ChampionIcon} className="w-6 h-6 text-[#9D4C1D]" />
        <span className="text-[20px] font-bold uppercase">
          {event.gameFormat?.replace("_", " ") || "Unknown"}
        </span>
        <HugeiconsIcon icon={ChampionIcon} className="w-6 h-6 text-[#9D4C1D]" />
      </div>

      {/* Participants */}
      <div className="flex items-center gap-2 mt-4">
        <div className="flex -space-x-3">
          {[...Array(Math.min(participantCount || 3, 3))].map((_, i) => (
            <img
              key={i}
              src={clubAvatar}
              alt="participant"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          +{participantCount} Participant
          {participantCount > 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between gap-2">
        {isUpcoming && (
          <button
            onClick={handleDeleteClick}
            className="bg-[#F5EDE8] flex items-center justify-center text-red-500 w-1/2 h-12 px-3 py-2 gap-2 rounded-lg"
          >
            <HugeiconsIcon icon={Delete02Icon} className="w-6 h-6" />
            Delete
          </button>
        )}
        <button
          onClick={() =>
            navigate(`/game-event-management/event-bracket/${event._id}`)
          }
          className={`flex items-center justify-center gap-2 bg-[#F5EDE8] rounded-lg ${
            isUpcoming ? "w-1/2" : "w-full"
          } text-[#9D4C1D] px-4 py-2 h-12`}
        >
          <HugeiconsIcon icon={ChampionIcon} className="w-6 h-6" />
          <span>Bracket</span>
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={`Delete event "${event.eventName || event.clubname || "event"}"?`}
          option1="Delete"
          option2="Cancel"
        />
      )}
    </div>
  );
}

export default EventCard;
