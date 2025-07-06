import { useState } from "react";

interface Task {
  id: string;
  title?: string;
  name?: string;
  status?: string;
}

interface ApprovalProps {
  task: Task;
  taskId: string;
  onComplete: () => void;
  onPrevious?: () => void;
  isCheckerOrAdmin: boolean;
  refreshTask: () => void;
}

// You'll need to implement this API call in your services
const updateTaskApprovalStatus = async (
  taskId: string,
  status: "approved" | "rejected",
  checkerNotes: string
) => {
  // Replace with your actual API endpoint
  const response = await fetch(`/api/tasks/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      checker_notes: checkerNotes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task approval status");
  }

  return response.json();
};

export default function Approval({
  task,
  taskId,
  onComplete,
  onPrevious,
  isCheckerOrAdmin,
  refreshTask,
}: ApprovalProps) {
  const [checkerNotes, setCheckerNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApproval = async (status: "approved" | "rejected") => {
    if (!checkerNotes.trim()) {
      setError("Please provide notes for your decision");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateTaskApprovalStatus(taskId, status, checkerNotes);
      refreshTask();
      onComplete();
    } catch (err) {
      console.error("Error updating approval status:", err);
      setError("Failed to update approval status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isCheckerOrAdmin) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-blue-600 text-lg font-medium mb-4">
            ⏳ Awaiting Approval
          </div>
          <p className="text-blue-700 mb-4">
            This task has been submitted for approval and is currently being
            reviewed by a checker or admin.
          </p>
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Task Details:</h3>
            <p className="text-blue-700">
              <strong>Task:</strong> {task.title || task.name}
            </p>
            <p className="text-blue-700">
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Task Approval Required
        </h2>
        <p className="text-gray-600">
          Please review the task and provide your approval decision along with
          any notes.
        </p>
      </div>

      {/* Task Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Task Summary:</h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Task:</strong> {task.title || task.name}
          </p>
          <p>
            <strong>Status:</strong>
            <span className="inline-block ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {task.status}
            </span>
          </p>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label
          htmlFor="checkerNotes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Checker Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          id="checkerNotes"
          value={checkerNotes}
          onChange={(e) => setCheckerNotes(e.target.value)}
          placeholder="Please provide your comments, feedback, or reasons for approval/rejection..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          disabled={loading}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => handleApproval("approved")}
            disabled={loading || !checkerNotes.trim()}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg font-medium transition-colors ${
              loading || !checkerNotes.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            }`}
          >
            {loading ? "Processing..." : "✓ Approve"}
          </button>

          <button
            onClick={() => handleApproval("rejected")}
            disabled={loading || !checkerNotes.trim()}
            className={`px-6 py-2 bg-red-600 text-white rounded-lg font-medium transition-colors ${
              loading || !checkerNotes.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            }`}
          >
            {loading ? "Processing..." : "✗ Reject"}
          </button>
        </div>

        {onPrevious && (
          <button
            onClick={onPrevious}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            ← Previous
          </button>
        )}
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-blue-800 text-sm">
            <p className="font-medium mb-1">Important:</p>
            <p>
              Your approval decision will be final and will determine whether
              this task proceeds or needs to be revised. Please ensure you have
              thoroughly reviewed all aspects of the task before making your
              decision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
