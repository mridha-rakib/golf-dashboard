import { Add01Icon, Calendar01Icon, Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clubs as clubData } from "../../constants/clubs";
import { courses as courseData } from "../../constants/courses";
import { events as eventData } from "../../constants/events";
import { gameFormats } from "../../constants/gameFormats";

import MemberDropdown from "../../components/Game-and-event-management/MemberDropdown";

const GameAndEventManagement = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const role = authUser?.role || "admin";
  const user = authUser || { id: "club-001", fullName: "Demo Club" };
  const navigate = useNavigate();

  const [events, setEvents] = useState(eventData || []);

  // Dashboard
  const eventMetrics = {
    totalEvents: events.length,
    activeEvents: events.filter((event) => event.status === "upcoming").length,
  };

  // Clubs
  const clubs = clubData.map((club, index) => ({
    _id: `club-${index + 1}`,
    clubName: club.clubname,
    members: club.members,
  }));
  const clubsLoading = false;

  // Courses
  const courses = (courseData || []).map((course) => ({
    courseID: course.courseID ?? course.id,
    courseName: course.courseName,
  }));
  // console.log(courses)
  // State
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [formData, setFormData] = useState({
    eventDate: "",
    eventTime: "",
    gameFormat: "",
    registrationDeadline: "",
  });

  // Default club selection
  useEffect(() => {
    if (!clubsLoading && clubs.length > 0 && !selectedClubId) {
      setSelectedClubId(clubs[0]._id);
    }
  }, [clubsLoading, clubs, selectedClubId]);

  // Members from selected club
  const selectedClub = clubs.find((club) => club._id === selectedClubId);
  const members = (selectedClub?.members || []).map((name, index) => ({
    id: `${selectedClubId}-member-${index + 1}`,
    name,
  }));

  // Handlers
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClubChange = (e) => {
    setSelectedClubId(e.target.value);
    setSelectedMembers([]);
  };

  const handleCourseChange = (e) => {
    console.log(e)
    setSelectedCourseId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      clubId: selectedClubId,
      courseID: selectedCourseId,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime,
      gameFormat: formData.gameFormat,
      selectedGolfers: selectedMembers, // array of golfer IDs
    };

    console.log("Event", body);


    const newEvent = {
      id: Date.now(),
      status: "upcoming",
      eventDate: body.eventDate,
      eventTime: body.eventTime,
      gameFormat: body.gameFormat,
      currentParticipants: body.selectedGolfers.length,
      clubId: {
        clubName: selectedClub?.clubName || "Club",
      },
      courseId: {
        courseName: courses.find((course) => course.courseID === body.courseID)?.courseName,
      },
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Upcoming Golf Events</h2>
        <p className="mt-2 text-gray-600 text-base">Manage your golf games, tournaments, and events effectively.</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <div
            onClick={() => navigate("all")}
            className="flex items-center justify-center bg-[#F5EDE8] rounded-lg px-6 py-4 cursor-pointer"
          >
            <HugeiconsIcon icon={Calendar02Icon} className="w-5 h-5" />
            <span className="ml-2 font-semibold">All Events</span>
          </div>

          <div
            onClick={() => navigate("upcoming")}
            className="flex items-center justify-center bg-[#F5EDE8] rounded-lg px-6 py-4 cursor-pointer"
          >
            <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5" />
            <span className="ml-2 font-semibold">Upcoming Events</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-2">Event Participation Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F5EDE8] p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold">{eventMetrics.totalEvents || 0}</p>
          </div>
          <div className="bg-[#F5EDE8] p-4 rounded-lg">
            <p className="text-sm text-gray-600">Active Events</p>
            <p className="text-2xl font-bold">{eventMetrics.activeEvents || 0}</p>
          </div>
        </div>
      </div>

      {/* Create Event */}
      <form onSubmit={handleSubmit} id="event-form" className="flex flex-col gap-6">
        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="bg-[#F5EDE8] p-2 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="font-medium">Time</label>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleInputChange}
              className="bg-[#F5EDE8] p-2 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Club & Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {
            role==="golf_club"?(<div>
            <label className="font-medium">Club</label>
            <select
              value={user.id}
              onChange={handleClubChange}
              className="bg-[#F5EDE8] p-2 rounded-lg w-full"
            >
              {/* {clubs.map((club) => (
                <option key={club._id} value={club._id}>{club.clubName}</option>
              ))} */}
              <option value={user.id}>{user.fullName || "Club"}</option>
            </select>
          </div>):(
          <div>
            <label className="font-medium">Club</label>
            <select
              value={selectedClubId}
              onChange={handleClubChange}
              className="bg-[#F5EDE8] p-2 rounded-lg w-full"
            >
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>{club.clubName}</option>
              ))}
            </select>
          </div>)
          }

          <div>
            <label className="font-medium">Club Members</label>
            <MemberDropdown
              members={members}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
            />
          </div>
        </div>

        {/* Game Type */}
        <div>
          <label className="font-medium">Game Type</label>
          <select
            name="gameFormat"
            value={formData.gameFormat}
            onChange={handleInputChange}
            className="bg-[#F5EDE8] p-2 rounded-lg w-full"
          >
            <option value="">Select Game Format</option>
            {Object.entries(gameFormats).map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="font-medium">Course</label>
          <select
            // value={selectedCourseId}
            onChange={handleCourseChange}
            className="bg-[#F5EDE8] p-2 rounded-lg w-full"
          >
            <option value={selectedCourseId}>Select Course</option>
            {courses.map((course) => (
              <option key={course.courseID} value={course.courseID}>{course.courseName}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => document.getElementById("event-form").reset()}
            className="px-4 py-2 bg-[#F5EDE8] text-[#9D4C1D] rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 flex items-center gap-2 bg-[#9D4C1D] text-white rounded-lg"
          >
            <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameAndEventManagement;
