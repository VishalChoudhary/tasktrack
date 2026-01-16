import React from "react";

const DeleteConfirmModal = ({
  taskTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800">Delete Task</h2>
        </div>
        <p className="text-gray-700 mb-2">Are you sure you want to delete: </p>
        <p className="text-lg font-semibold text-gray-800 mb-4 px-4 py-2 bg-gray-50 rounded">
          "{taskTitle}"
        </p>
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading && <span>🗑️</span>}
            Delete Permenantly
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
