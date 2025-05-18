import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteTaskService,
  getTaskListService,
} from "../../../services/restApi/task";
import { Edit, Eye } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: {
    id: number;
    name: string;
  };
  template: {
    id: number;
    title: string;
  };
  client: {
    id: number;
    full_name: string;
    phone_number: string;
  };
  maker: {
    id: number;
    full_name: string;
  };
  checker: {
    id: number;
    full_name: string;
  };
  created_by: {
    id: number;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
  due_date: string;
  started_at: string | null;
  completed_at: string | null;
  maker_notes: string;
  checker_notes: string;
}

type PriorityType = "low" | "medium" | "high" | "urgent";
type StatusType = "pending" | "started" | "completed";

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<PriorityType | "">("");
  const [status, setStatus] = useState<StatusType | "">("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [page, search, priority, status]);

  const fetchTasks = async () => {
    const res = await getTaskListService({
      page,
      page_size: 10,
      search,
      priority: priority || undefined,
      status: status || undefined,
    });

    if (res?.results) {
      setTasks(res.results);
      setTotalCount(res.count);
      setTotalPages(Math.ceil(res.count / 10));
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const success = await deleteTaskService(Number(deleteId));
      if (success) {
        setTasks((prev) => prev.filter((task) => task.id !== deleteId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Task deleted successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      }
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-3 py-2 border rounded w-[130px]"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as PriorityType | "");
            setPage(1);
          }}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          className="px-3 py-2 border rounded w-[130px]"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusType | "");
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="started">Started</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Title", "Status", "Priority", "Client", "Maker", "Created At", "Due Date", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        isHeader
                        className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {tasks.map((task) => (
                  <TableRow key={task.id} className="text-center">
                    <TableCell className="px-4 py-4 text-start">
                      <a 
                        href={`/tasks/view/${task.id}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/tasks/view/${task.id}`);
                        }}
                      >
                        {task.title}
                      </a>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-start capitalize">{task.status}</TableCell>
                    <TableCell className="px-4 py-4 text-start capitalize">{task.priority}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{task.client?.full_name || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{task.maker?.full_name || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-4 text-start">
                      {new Date(task.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-start">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="flex items-center gap-3 px-4 py-3">
                      <Eye
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => navigate(`/tasks/view/${task.id}`)}
                      />
                      <Edit
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => navigate(`/manage-task/${task.id}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>
          <span className="px-4 py-2">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Delete Confirmation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
