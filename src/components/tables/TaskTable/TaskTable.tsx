import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteTaskService,
  getTaskListService,
} from "../../../services/restApi/task";
import { Edit, Eye } from "lucide-react";
import { getUserListService } from "../../../services/restApi/user";

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
  
  // New filter states
  const [createdDateStart, setCreatedDateStart] = useState<string>("");
  const [createdDateEnd, setCreatedDateEnd] = useState<string>("");
  const [completedDateStart, setCompletedDateStart] = useState<string>("");
  const [completedDateEnd, setCompletedDateEnd] = useState<string>("");
  const [dueDateStart, setDueDateStart] = useState<string>("");
  const [dueDateEnd, setDueDateEnd] = useState<string>("");
  const [maker, setMaker] = useState<string>("");
  const [checker, setChecker] = useState<string>("");
  const [client, setClient] = useState<string>("");
  
  // User lists for dropdowns
  const [makerList, setMakerList] = useState<{id: number, full_name: string}[]>([]);
  const [checkerList, setCheckerList] = useState<{id: number, full_name: string}[]>([]);
  const [clientList, setClientList] = useState<{id: number, full_name: string}[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [
    page, 
    search, 
    priority, 
    status, 
    createdDateStart, 
    createdDateEnd, 
    completedDateStart, 
    completedDateEnd, 
    dueDateStart, 
    dueDateEnd, 
    maker, 
    checker, 
    client
  ]);
  
  // Fetch user lists for dropdowns
  useEffect(() => {
    const fetchUserLists = async () => {
      // Fetch makers
      const makerResponse = await getUserListService({ role: "Maker", page: 1, page_size: 100 });
      console.log(
        "makerResponse",
        makerResponse
      );
      if (makerResponse?.results) {
        setMakerList(makerResponse.results);
      }
      
      // Fetch checkers
      const checkerResponse = await getUserListService({ role: "Checker", page: 1, page_size: 100 });
      if (checkerResponse?.results) {
        setCheckerList(checkerResponse.results);
      }
      
      // Fetch clients
      const clientResponse = await getUserListService({ role: "Client", page: 1, page_size: 100 });
      if (clientResponse?.results) {
        setClientList(clientResponse.results);
      }
    };
    
    fetchUserLists();
  }, []);

  const fetchTasks = async () => {
    // Create a params object with only defined values
    const params: any = {
      page,
      page_size: 10
    };
    
    // Only add parameters that have values
    if (search) params.search = search;
    if (priority) params.priority = priority;
    if (status) params.status = status;
    
    // Date filters
    if (createdDateStart) params.created_after = createdDateStart;
    if (createdDateEnd) params.created_before = createdDateEnd;
    if (completedDateStart) params.completed_after = completedDateStart;
    if (completedDateEnd) params.completed_before = completedDateEnd;
    if (dueDateStart) params.due_after = dueDateStart;
    if (dueDateEnd) params.due_before = dueDateEnd;
    
    // User filters - convert IDs to strings
    if (maker) {
      params.maker = maker.toString();
      console.log('Maker ID:', maker, typeof maker);
    }
    if (checker) {
      params.checker = checker.toString();
      console.log('Checker ID:', checker, typeof checker);
    }
    if (client) {
      params.client = client.toString();
      console.log('Client ID:', client, typeof client);
    }
    
    // For debugging
    console.log('Task filter params:', params);
    
    const res = await getTaskListService(params);

    if (res?.results) {
      setTasks(res.results);
      setTotalCount(res.count);
      setTotalPages(Math.ceil(res.count / 10));
    }
  };
  
  // We'll use the built-in date formatting in the table cells directly
  
  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setPriority("");
    setStatus("");
    setCreatedDateStart("");
    setCreatedDateEnd("");
    setCompletedDateStart("");
    setCompletedDateEnd("");
    setDueDateStart("");
    setDueDateEnd("");
    setMaker("");
    setChecker("");
    setClient("");
    setPage(1);
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
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Task Filters</h2>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Filters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Tasks</label>
              <input
                id="search"
                type="text"
                placeholder="Search by title or description..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  id="priority"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  id="status"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                </select>
              </div>
            </div>
          </div>
          
          {/* Date Filters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={createdDateStart}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setCreatedDateStart(e.target.value);
                    setPage(1);
                  }}
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={createdDateEnd}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setCreatedDateEnd(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={dueDateStart}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setDueDateStart(e.target.value);
                    setPage(1);
                  }}
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={dueDateEnd}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setDueDateEnd(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Completion Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={completedDateStart}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setCompletedDateStart(e.target.value);
                    setPage(1);
                  }}
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={completedDateEnd}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  onChange={(e) => {
                    setCompletedDateEnd(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* User Filters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="maker" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maker</label>
              <select
                id="maker"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={maker}
                onChange={(e) => {
                  setMaker(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Makers</option>
                {makerList.map((user) => (
                  <option key={user.id} value={user.full_name}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="checker" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Checker</label>
              <select
                id="checker"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={checker}
                onChange={(e) => {
                  setChecker(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Checkers</option>
                {checkerList.map((user) => (
                  <option key={user.id} value={user.full_name}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
              <select
                id="client"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                value={client}
                onChange={(e) => {
                  setClient(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Clients</option>
                {clientList.map((user) => (
                  <option key={user.id} value={user.full_name}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "Title",
                    "Status",
                    "Priority",
                    "Client",
                    "Maker",
                    "Created At",
                    "Due Date",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      className="text-center px-4 py-16"
                      colSpan={8}
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No tasks found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          No tasks match the selected filters. Try adjusting your filters or clear them to see all tasks.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.id} className="text-center">
                      <TableCell className="px-4 py-4 text-start ">
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
                      <TableCell className="px-4 py-4 text-start capitalize">
                        {task.status}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start capitalize">
                        {task.priority}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start text-blue-600 ">
                        {" "}
                        <Link to={`/user-details/${task.client?.id}`}>
                          {" "}
                          {task.client?.full_name || "N/A"}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start text-blue-600">
                        {" "}
                        <Link to={`/user-details/${task.client?.id}`}>
                          {task.maker?.full_name || "N/A"}{" "}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {new Date(task.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "N/A"}
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
                )))}
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
