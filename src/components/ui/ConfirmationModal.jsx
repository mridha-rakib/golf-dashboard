import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Are you sure, you want to delete?" ,option1,option2}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Close button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {title}
          </h2>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {option1}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {option2}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
