import { useParams } from "react-router-dom";
import EventCard from "../../components/Game-and-event-management/EventCard";
import { events as eventData } from "../../constants/events";

const ViewAllEvent = () => {
  const { status } = useParams(); // "upcoming" or "all"
  const events = eventData || [];
  const filteredEvents =
    status === "upcoming"
      ? events.filter((e) => e.status === "upcoming")
      : events;
  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 mb-6">
        {status === "upcoming" ? "Upcoming Events" : "All Events"}
      </h2>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewAllEvent;
