import { useState } from "react";
import { useParams } from "react-router-dom";
import { courses as courseData } from "../../constants/courses";

const ViewCourseData = () => {
  const { id } = useParams();
  const course = (courseData || []).find(
    (item) => String(item.courseID ?? item.id) === String(id)
  );

  const [expandedHole, setExpandedHole] = useState(null);

  if (!id || !course) {
    return <p className="text-gray-500">No course selected</p>;
  }

  const toggleHole = (index) => {
    setExpandedHole(expandedHole === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg  p-6">
      {/* Course Info */}
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Course & Data Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Course Name
          </label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.courseName|| "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Club</label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.clubName|| "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Country</label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.country|| "N/A"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">State</label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.state|| "N/A"}</p>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-600">
            Handicap Number
          </label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.handicapNumberType}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Type</label>
          <p className="mt-1 p-2 rounded bg-[#F5EDE8]">{course.type}</p>
        </div> */}
      </div>

      {/* Holes with dropdown */}
      {course.holeDetails &&
        course.holeDetails.map((hole, index) => (
          <div key={index} className="mb-4">
            {/* Hole Button */}
            <button
              type="button"
              className={`w-full flex justify-between items-center px-4 py-2 bg-[#e7caba] text-left font-medium hover:bg-[#E6D9D1] 
                ${expandedHole === index ? "rounded-t-lg" : "rounded-lg"}`}
              onClick={() => toggleHole(index)}
            >
              <span>Hole {index + 1}</span>
              <span>{expandedHole === index ? "▲" : "▼"}</span>
            </button>

            {/* Expanded Content */}
            {expandedHole === index && (
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-6  rounded-b-lg -mt-1 p-2 shadow-b-lg ">
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600">Par</label>
                  <p className="mt-1 bg-[#F5EDE8] p-2 rounded-lg">{hole.par|| "N/A"}</p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600">Yards</label>
                  <p className="mt-1 bg-[#F5EDE8] p-2 rounded-lg">{hole.yards|| "N/A"}</p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600">Handicap Rating</label>
                  <p className="mt-1 bg-[#F5EDE8] p-2 rounded-lg">{hole.handicapRating}</p>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-600">Course Rating & Slope</label>
                  <p className="mt-1 bg-[#F5EDE8] p-2 rounded-lg">{hole.courseRating}</p>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ViewCourseData;
