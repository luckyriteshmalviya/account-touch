import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTaskDetailsService,
  updateTaskApprovalService,
} from "../../../services/restApi/task";
import Swal from "sweetalert2";

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ViewTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkerNotes, setCheckerNotes] = useState<string>("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const getLabelFromName = (name: string) => {
    const matches = name.match(/\(([^)]+)\)/g); // get all (..)
    const lastMatch = matches ? matches[matches.length - 1] : null;
    const label = lastMatch ? lastMatch.replace(/[()]/g, "") : name;

    if (label === "Document Preparation") {
      return "Document Sharing";
    }

    if (label === "Steps Procedure") {
      return "Document Preparation";
    }

    return label;
  };

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getTaskDetailsService(id);
          if (data) {
            setTask(data);
            if (data.checker_notes) {
              setCheckerNotes(data.checker_notes);
            }
          } else {
            setError("Failed to load task details");
          }
        } catch (err) {
          console.error("Error fetching task details:", err);
          setError("An error occurred while loading task details");
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  const isCheckerOrAdmin = (): boolean => {
    const authString = localStorage.getItem("auth");
    if (!authString) return false;

    try {
      const auth = JSON.parse(authString);
      const roles = auth.user?.roles || [];
      return roles.some((role: any) =>
        ["checker", "admin", "super_admin"].includes(role.name.toLowerCase())
      );
    } catch (error) {
      console.error("Error parsing auth from localStorage:", error);
      return false;
    }
  };

  const handleStartWorkflow = () => {
    navigate(`/tasks/steps/${id}`);
  };

  const handleApproval = async (approvalStatus: "approved" | "rejected") => {
    if (!checkerNotes.trim()) {
      setApprovalError(
        "Please provide notes before approving or rejecting the task."
      );
      return;
    }

    try {
      setApprovalLoading(true);
      setApprovalError(null);

      await updateTaskApprovalService(id!, approvalStatus, checkerNotes);

      setTask((prevTask: any) => ({
        ...prevTask,
        status: approvalStatus,
        checker_notes: checkerNotes,
      }));

      // ✅ SweetAlert feedback
      await Swal.fire({
        icon: "success",
        title: `Task ${
          approvalStatus === "approved" ? "Approved" : "Rejected"
        }!`,
        text: `The task has been successfully ${approvalStatus}.`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating task approval:", error);
      setApprovalError("Failed to update task approval. Please try again.");

      // ✅ Error swal
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update task approval. Please try again.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setApprovalLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!task) {
    return <p className="text-gray-500 text-center mt-10">No task found</p>;
  }

  const processes = task.processes
    ? [...task.processes].sort((a, b) => a.order - b.order)
    : [];

  const derivedTaskStatus =
    task.status === "pending" &&
    processes.some((process) => process.status === "completed")
      ? "in_progress"
      : task.status;

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg p-8 shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Task Details</h1>

      {/* Task Info */}
      <div className="mb-8">
        <div className="overflow-x-auto">
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Client", value: task.client?.full_name },
                { label: "Maker", value: task.maker?.full_name },
                { label: "Checker", value: task.checker?.full_name },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                >
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {label}
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { label: "Title", value: task.title },
                { label: "Category", value: task.category?.name },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                >
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {label}
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                Description
              </h3>
              <p className="text-gray-800 dark:text-gray-300">
                {task.description || "-"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Priority & Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Priority: {task.priority || "-"}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      derivedTaskStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : derivedTaskStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : derivedTaskStatus === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : derivedTaskStatus === "waiting_for_approval"
                        ? "bg-orange-100 text-orange-800"
                        : derivedTaskStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : derivedTaskStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Status: {derivedTaskStatus || "-"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Fees
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {task.fees ? `₹${task.fees}` : "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Completion Date
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.completion_date)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Due Date
                </h3>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.due_date)}
                </p>
              </div>
            </div>

            {/* Approval Section */}
            {task.status === "waiting_for_approval" && isCheckerOrAdmin() && (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Task Approval Required
                </h3>

                <div className="mb-6">
                  <label
                    htmlFor="checkerNotes"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Checker Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="checkerNotes"
                    value={checkerNotes}
                    onChange={(e) => setCheckerNotes(e.target.value)}
                    placeholder="Provide your comments, feedback, or reasons for approval/rejection..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={4}
                    disabled={approvalLoading}
                  />
                  {approvalError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {approvalError}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApproval("approved")}
                    disabled={approvalLoading || !checkerNotes.trim()}
                    className={`px-6 py-2 bg-green-600 text-white rounded-lg font-medium ${
                      approvalLoading || !checkerNotes.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                    }`}
                  >
                    {approvalLoading ? "Processing..." : "✓ Approve"}
                  </button>

                  <button
                    onClick={() => handleApproval("rejected")}
                    disabled={approvalLoading || !checkerNotes.trim()}
                    className={`px-6 py-2 bg-red-600 text-white rounded-lg font-medium ${
                      approvalLoading || !checkerNotes.trim()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                    }`}
                  >
                    {approvalLoading ? "Processing..." : "✗ Reject"}
                  </button>
                </div>
              </div>
            )}

            {/* Display checker notes */}
            {(task.status === "approved" || task.status === "rejected") &&
              task.checker_notes && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                    Checker Notes
                  </h3>
                  <p className="text-gray-800 dark:text-gray-300">
                    {task.checker_notes}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      {processes.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Process Steps</h2>
            {task.status !== "completed" && task.status !== "rejected" && (
              <button
                onClick={handleStartWorkflow}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Task Workflow
              </button>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process, index) => (
                <li
                  key={process.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <span className="mr-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      {index + 1}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/tasks/steps/${id}?step=${index}`)
                      }
                      className="text-gray-800 dark:text-gray-200 underline hover:text-blue-600"
                    >
                      {getLabelFromName(
                        process.process_template_name || `Step ${index + 1}`
                      )}
                    </button>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      process.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : process.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : process.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {process.status ? process.status.replace("_", " ") : "-"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {task.status !== "completed" && task.status !== "rejected" && (
        <button
          type="button"
          onClick={() => navigate(`/manage-task/${id}`)}
          className="px-8 mt-4 p-2 border border-gray-400 hover:bg-blue-400 rounded-lg"
        >
          Edit
        </button>
      )}
    </div>
  );
}
