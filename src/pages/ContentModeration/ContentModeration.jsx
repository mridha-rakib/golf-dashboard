import { Delete02Icon, Flag01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDown, Filter, Loader, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { Pagination } from "../../components/ui/Pagination";
import { report as reportData } from "../../constants/reports";

export default function ContentModeration() {
  const [reports, setReports] = useState(reportData);
  const isLoading = false;
const navigate = useNavigate();
const [isClient, setIsClient] = useState(false);
const [windowWidth, setWindowWidth] = useState(0);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [filters, setFilters] = useState({ contentType: "", status: "" });
const [reportToAction, setReportToAction] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showBanModal, setShowBanModal] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const reportsPerPage = 8;

useEffect(() => {
  setIsClient(true);
  setWindowWidth(window.innerWidth);
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  if (windowWidth >= 1024 && isMobileMenuOpen) setIsMobileMenuOpen(false);
}, [windowWidth, isMobileMenuOpen]);

const reportList = reports;

const handleViewReport = (report) => {
  if (report.contentType === "Post") {
    navigate(`/content-moderation/reported-post/${report.reportid}`);
  } else {
    navigate(`/content-moderation/reported-profile/${report.reportid}`);
  }
};

const handleFilterChange = (filterType, value) => {
  setFilters((prev) => ({ ...prev, [filterType]: value }));
};

const clearFilters = () => setFilters({ contentType: "", status: "" });

const filteredReports = React.useMemo(() => {
  const lowerSearch = searchQuery.toLowerCase();

  const filtered = reportList.filter((report) => {
    const matchesSearch =
      // report.reportid?.toLowerCase().includes(lowerSearch) ||
      report.reportedBy?.toLowerCase().includes(lowerSearch) ||
      report.contentType?.toLowerCase().includes(lowerSearch) ||
      report.reason?.toLowerCase().includes(lowerSearch);

    const matchesFilters =
      (!filters.contentType || report.contentType === filters.contentType) &&
      (!filters.status || report.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  return {
    filtered,
    totalPages: Math.ceil(filtered.length / reportsPerPage),
    paginated: filtered.slice(
      (currentPage - 1) * reportsPerPage,
      currentPage * reportsPerPage
    ),
  };
}, [reportList, filters, currentPage, reportsPerPage, searchQuery]);

const { totalPages, paginated: paginatedReports } = filteredReports;

useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  } else if (totalPages === 0) {
    setCurrentPage(1);
  }
}, [currentPage, totalPages]);

useEffect(() => setCurrentPage(1), [filters.contentType, filters.status, searchQuery]);


  if (!isClient || isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[32px] sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Content Moderation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage and moderate reported content
          </p>
        </div>

        {/* Search and Filters - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-0"
              aria-label="Search reports"
            />
          </div>

          <div className="relative">
            <select
              value={filters.contentType}
              onChange={(e) =>
                handleFilterChange("contentType", e.target.value)
              }
              className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 text-sm rounded-lg focus:border-transparent min-w-[140px]"
              aria-label="Content type filter"
            >
              <option value="">Content type</option>
              <option value="Post">Post</option>
              <option value="Profile">Profile</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 text-sm rounded-lg focus:ring-0 focus:border-transparent min-w-[140px]"
              aria-label="Status filter"
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Banned">Banned</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {(filters.contentType || filters.status) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-filters"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(filters.contentType || filters.status) && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-purple-600 rounded-full">
              {(filters.contentType ? 1 : 0) + (filters.status ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters */}
      {isMobileMenuOpen && (
        <div
          id="mobile-filters"
          className="lg:hidden mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content type
              </label>
              <select
                value={filters.contentType}
                onChange={(e) =>
                  handleFilterChange("contentType", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-0 focus:border-transparent"
              >
                <option value="">Content type</option>
                <option value="Post">Post</option>
                <option value="Profile">Profile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-0 focus:border-transparent"
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Banned">Banned</option>
              </select>
            </div>

            {(filters.contentType || filters.status) && (
              <button
                onClick={clearFilters}
                className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none "
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#F5EDE8] px-6 py-4">
          <div className="flex text-sm font-medium text-gray-700">
            <div className="w-[6%]">No</div>
            {/* <div className="w-[16%] justify-center text-center">Report ID</div> */}
            <div className="w-[16%] justify-center text-center">
              Reported By
            </div>
            <div className="w-[16%] justify-center text-center">
              Content Type
            </div>
            <div className="w-[20%] justify-center text-center">Reason</div>
            <div className="w-[12%] justify-center text-center">Status</div>
            <div className="w-[14%] justify-center text-center">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {paginatedReports.map((report, index) => (
            <div
              key={report._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center text-sm text-gray-900">
                <div className="w-[6%]">
                  {String(
                    (currentPage - 1) * reportsPerPage + index + 1
                  ).padStart(2, "0")}
                </div>
                {/* <div className="w-[16%] font-medium justify-center text-center">
                  {report.reportid}
                </div> */}
                <div className="w-[16%] justify-center text-center">
                  {report.reporterId.fullName||"N/A"}
                </div>
                <div className="w-[16%] justify-center text-center">
                  {report.contentType}
                </div>
                <div className="w-[20%] truncate justify-center text-center">
                  {report.reason}
                </div>
                <div className="w-[12%] justify-center text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.isResolved? "bg-green-100 text-gray-800" : "bg-yellow-100 text-gray-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        report.isResolved? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></span>
                    {report.isResolved? "Resolved" : "Pending"}
                  </span>
                </div>
                <div className="w-[14%] flex items-center justify-center space-x-2">
                  <button
                    onClick={() => {
                      setReportToAction(report);
                      setShowBanModal(true);
                    }}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-full border border-orange-200 transition-colors"
                  >
                    <HugeiconsIcon icon={Flag01Icon} />
                  </button>
                  <button
                    onClick={() => handleViewReport(report)}
                    className="p-2 text-purple-500 hover:bg-purple-50 rounded-full border border-purple-200 transition-colors"
                  >
                    <HugeiconsIcon icon={ViewIcon} />
                  </button>
                  <button
                    onClick={() => {
                      setReportToAction(report);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedReports.map((report, index) => (
          <div
            key={report.reportid}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              {/* Left: Report number and report ID */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  #
                  {String(
                    (currentPage - 1) * reportsPerPage + index + 1
                  ).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {report.reportid}
                </span>
              </div>

              {/* Right: Action buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setReportToAction(report);
                    setShowBanModal(true);
                  }}
                  className={`${
                    report.status === "Banned" ? "bg-red-200" : ""
                  } p-2 text-orange-500 hover:bg-orange-50 rounded-full border border-orange-200 transition-colors`}
                  aria-label="Ban"
                >
                  <HugeiconsIcon icon={Flag01Icon} />
                </button>
                <button
                  onClick={() => handleViewReport(report)}
                  className="p-2 text-purple-500 hover:bg-purple-50 rounded-full border border-purple-200 transition-colors"
                  aria-label="View"
                >
                  <HugeiconsIcon icon={ViewIcon} />
                </button>
                <button
                  onClick={() => {
                    setReportToAction(report);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full border border-red-200 transition-colors"
                  aria-label="Delete"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                </button>
              </div>
            </div>

            {/* Reported By and Status */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900">
                {report.reporterId.fullName}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  report.isResolved
                    ? "bg-green-100 text-gray-800"
                    : "bg-yellow-100 text-gray-800"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    report.isResolved ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></span>
                {report.isResolved ? "Resolved" : "Pending"}
              </span>
            </div>

            {/* Content Type and Reason */}
            <p className="text-sm text-gray-600 mb-1">
              <strong>Content Type: </strong>
              {report.contentType}
            </p>
            <p className="text-sm text-gray-600 truncate">
              <strong>Reason: </strong>
              {report.reason}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        PerPage={reportsPerPage}
        totalPages={totalPages}
        totalItems={reports.length}
      />

      {/* Confirmation Modals */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setReportToAction(null);
          }}
          onConfirm={() => {
            if (reportToAction) {
              // Remove user from the users array
              setReports((prevReports) =>
                prevReports.filter(
                  (report) => report.reportid !== reportToAction.reportid
                )
              );
              console.log(`Report ${reportToAction.reportid} deleted`);
            }
            setShowDeleteModal(false);
            setReportToAction(null);
          }}
          title={"Delete Report"}
          option1={"Delete Report"}
          option2={"Cancel"}
        />
      )}
      {showBanModal && (
        <ConfirmationModal
          isOpen={showBanModal}
          onClose={() => {
            setShowBanModal(false);
            setReportToAction(null);
          }}
          onConfirm={() => {
            if (reportToAction) {
              // Toggle user status between Active and Banned
              setReports((prevReports) =>
                prevReports.map((report) =>
                  report.reportid === reportToAction.reportid
                    ? {
                        ...report,
                        status:
                          report.status === "Pending" ? "Banned" : "Pending",
                      }
                    : report
                )
              );
              const newStatus =
                reportToAction.status === "Pending" ? "Banned" : "Pending";
              console.log(
                `Report ${reportToAction.reportid} status changed to ${newStatus}`
              );
            }
            setShowBanModal(false);
            setReportToAction(null);
          }}
          title={
            reportToAction?.status === "Pending" ? "Ban Report" : "Unban Report"
          }
          option1={
            reportToAction?.status === "Pending" ? "Ban Report" : "Unban Report"
          }
          option2={"Cancel"}
        />
      )}
    </div>
  );
}
