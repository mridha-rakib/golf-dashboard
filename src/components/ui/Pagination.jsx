
import {ChevronLeft} from "lucide-react";

export const Pagination = ({
  currentPage,
  setCurrentPage,
  PerPage,
  totalPages,
  totalItems,
}) => {
  const getPageInfoText = () => {
    if (totalItems === 0) return "No results";
    const start = (currentPage - 1) * PerPage + 1;
    const end = Math.min(currentPage * PerPage, totalItems);
    return `Showing ${start} to ${end} of ${totalItems}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white p-4 rounded-lg">
        {/* Showing Info */}
        <div className="text-sm text-gray-700">{getPageInfoText()}</div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {/* Previous Button */}
          <button
            className="p-2 text-gray-400 rounded-full border border-gray-500 hover:text-gray-600 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
           <ChevronLeft/>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1;
              const isCurrentPage = currentPage === pageNumber;
              const showPage =
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 &&
                  pageNumber <= currentPage + 1);

              if (!showPage && (pageNumber === currentPage - 2 || pageNumber === currentPage + 2)) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <button
                  key={pageNumber}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    isCurrentPage
                      ? "bg-[#AA6239] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            className="p-2 text-gray-400 rounded-full border border-gray-500 hover:text-gray-600 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
