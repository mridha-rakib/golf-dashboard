import { Delete02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { Pagination } from "../../components/ui/Pagination";
import { courses as courseData } from "../../constants/courses";

export default function CourseDataManagement() {
  const navigate = useNavigate();

  // State
  const initialCourses = (courseData || []).map((course) => ({
    courseID: course.courseID ?? course.id,
    courseName: course.courseName,
    country: course.location?.split(",").pop()?.trim() || course.location || "N/A",
    state: course.state || "N/A",
    numHoles: course.holes ?? course.numHoles ?? 0,
    status: course.status || "Active",
    holeDetails: course.holeDetails || [],
    clubName: course.clubName || "N/A",
  }));
  const [coursesData, setCoursesData] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [courseToAction, setCourseToAction] = useState(null);

  const usersPerPage = 8;

  // // Filtered courses
 const filteredCourses = (coursesData || []).filter((course) => {
  const matchesSearch =
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.country.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSearch;
});


  const totalUsers = filteredCourses.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Handlers
  const handleViewCourseData = (course) => navigate(`/Course-data-management/view/${course.courseID}`);

  const handleDeleteCourse = () => {
    if (courseToAction) {
      setCoursesData((prev) =>
        prev.filter((c) => c.courseID !== courseToAction.courseID)
      );
    }
    setShowDeleteModal(false);
    setCourseToAction(null);
  };

  const handleToggleStatus = () => {
    if (courseToAction) {
      setCoursesData((prev) =>
        prev.map((c) =>
          c.courseID === courseToAction.courseID
            ? { ...c, status: c.status === "Active" ? "Banned" : "Active" }
            : c
        )
      );
    }
    setShowBanModal(false);
    setCourseToAction(null);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className=" ">
          Course & Data Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-auto max-h-[calc(100vh-200px)] rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F5EDE8] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">NO</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Course Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Holes</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCourses.map((course, index) => (
              <tr key={course.courseID} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{course.courseName}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate">{`${course.state?`${course.state},`:""} ${course.country}` }</td>
                <td className="px-6 py-4 text-sm text-gray-900">{course.numHoles}</td>
                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleViewCourseData(course)}
                    className="p-2 text-purple-500 hover:bg-purple-50 rounded-full border border-purple-200 transition-colors"
                  >
                    <HugeiconsIcon icon={ViewIcon} />
                  </button>
                  {/* <button
                    onClick={() => {
                      setCourseToAction(course);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {paginatedCourses.map((course, index) => (
          <div key={course.courseID} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-gray-400 font-medium">
                NO{String((currentPage - 1) * usersPerPage + index + 1).padStart(2, "0")}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewCourseData(course)}
                  className="p-2 text-purple-500 hover:bg-purple-50 rounded-full border border-purple-200 transition-colors"
                  aria-label="View"
                >
                  <HugeiconsIcon icon={ViewIcon} />
                </button>
                <button
                  onClick={() => {
                    setCourseToAction(course);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
                  aria-label="Delete"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Course Name:</span> {course.courseName}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {`${course.state}, ${course.country}` }{console.log(course.state)}
              </div>
              <div>
                <span className="font-semibold">Holes:</span> {course.numHoles}
              </div>
              <div className="flex items-center">
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-1 flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
                    course.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      course.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {course.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        PerPage={usersPerPage}
        totalPages={totalPages}
        totalItems={totalUsers}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setCourseToAction(null);
          }}
          onConfirm={handleDeleteCourse}
          title="Delete Course"
          option1="Delete"
          option2="Cancel"
        />
      )}

      {/* Ban/Unban Confirmation Modal */}
      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
            setCourseToAction(null);
          }}
          onConfirm={handleToggleStatus}
          title={courseToAction?.status === "Active" ? "Ban Course" : "Unban Course"}
          option1={courseToAction?.status === "Active" ? "Ban" : "Unban"}
          option2="Cancel"
        />
      )}
    </div>
  );
}
