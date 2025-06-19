import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteTaskService,
  getTaskListService,
} from "../../../services/restApi/task";
import { Edit, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { getUserListService } from "../../../services/restApi/user";
import { getCategoryListService } from "../../../services/restApi/category";

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
    phone_number: string;
  };
  checker: {
    id: number;
    full_name: string;
    phone_number: string;
  };
  created_by: {
    id: number;
    full_name: string;
  };
  franchise: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  due_date: string;
  started_at: string | null;
  completed_at: string | null;
  maker_notes: string;
  checker_notes: string;
}

interface User {
  id: number;
  full_name: string;
  phone_number: string;
}

interface Franchise {
  id: number;
  full_name: string;
  phone_number: string;
}

interface Category {
  id: number;
  name: string;
}

type PriorityType = "low" | "medium" | "high" | "urgent";
type StatusType = "pending" | "started" | "completed" | "rejected";

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalCount] = useState(0);
  const [searchParams] = useSearchParams();
  const pageSize = 10;

  // Basic filters (always visible)
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<PriorityType | "">("");
  const [status, setStatus] = useState<StatusType | "">("");
  const [category, setCategory] = useState<string>("");

  // More filters toggle
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Separate date range filters for each type
  const [createdDateStart, setCreatedDateStart] = useState<string>("");
  const [createdDateEnd, setCreatedDateEnd] = useState<string>("");
  const [dueDateStart, setDueDateStart] = useState<string>("");
  const [dueDateEnd, setDueDateEnd] = useState<string>("");
  const [completedDateStart, setCompletedDateStart] = useState<string>("");
  const [completedDateEnd, setCompletedDateEnd] = useState<string>("");

  // User filters
  const [maker, setMaker] = useState<string>("");
  const [checker, setChecker] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [franchise, setFranchise] = useState<string>("");

  // User and category lists for dropdowns
  const [makerList, setMakerList] = useState<User[]>([]);
  const [checkerList, setCheckerList] = useState<User[]>([]);
  const [clientList, setClientList] = useState<User[]>([]);
  const [franchiseList, setFranchiseList] = useState<Franchise[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  // Add loading state to ensure proper initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);

  const navigate = useNavigate();

  // First load all dropdown data
  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        // Fetch all data in parallel
        const [
          makerResponse,
          checkerResponse,
          clientResponse,
          franchiseResponse,
          categoryResponse,
        ] = await Promise.all([
          getUserListService({ role: "Maker", page: 1, page_size: 100 }),
          getUserListService({ role: "Checker", page: 1, page_size: 100 }),
          getUserListService({ role: "Client", page: 1, page_size: 100 }),
          getUserListService({ role: "Franchise", page: 1, page_size: 100 }),
          getCategoryListService({ page: 1 }),
        ]);

        // Set all lists
        if (makerResponse?.results) setMakerList(makerResponse.results);
        if (checkerResponse?.results) setCheckerList(checkerResponse.results);
        if (clientResponse?.results) setClientList(clientResponse.results);
        if (franchiseResponse?.results)
          setFranchiseList(franchiseResponse.results);
        if (categoryResponse?.results)
          setCategoryList(categoryResponse.results);

        // Mark as initialized
        setIsInitialized(true);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setIsInitialized(true); // Still mark as initialized even if error
      }
    };

    fetchUserLists();
  }, []);

  // Handle URL parameters after initialization - ONLY ONCE
  useEffect(() => {
    if (!isInitialized || urlParamsProcessed) return;

    const handleUrlParameters = () => {
      // Handle category parameter
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        setCategory(categoryParam);
        setShowMoreFilters(true);
      }

      // Handle status parameter (can be comma-separated)
      const statusParam = searchParams.get("status");
      if (statusParam) {
        // For now, just take the first status if multiple are provided
        const firstStatus = statusParam.split(",")[0];
        if (
          ["pending", "started", "completed", "rejected"].includes(firstStatus)
        ) {
          setStatus(firstStatus as StatusType);
          setShowMoreFilters(true);
        }
      }

      // Handle created date range parameters
      const createdStartParam = searchParams.get("created_start");
      const createdEndParam = searchParams.get("created_end");

      if (createdStartParam && createdEndParam) {
        setCreatedDateStart(createdStartParam);
        setCreatedDateEnd(createdEndParam);
        setShowMoreFilters(true);
      }

      // Handle due date range parameters
      const dueStartParam = searchParams.get("due_start");
      const dueEndParam = searchParams.get("due_end");

      if (dueStartParam && dueEndParam) {
        setDueDateStart(dueStartParam);
        setDueDateEnd(dueEndParam);
        setShowMoreFilters(true);
      } else if (dueEndParam && !dueStartParam) {
        // Handle case where only due_end is provided (for overdue tasks)

        setDueDateEnd(dueEndParam);
        setShowMoreFilters(true);
      }

      // Show more filters if requested
      const showMoreParam = searchParams.get("show_more");
      if (showMoreParam === "true") {
        setShowMoreFilters(true);
      }

      // Mark URL parameters as processed
      setUrlParamsProcessed(true);
    };

    handleUrlParameters();
  }, [isInitialized, searchParams, urlParamsProcessed]);

  // Fetch tasks only after initialization is complete and URL params are processed
  useEffect(() => {
    if (!isInitialized || !urlParamsProcessed) return;

    // Add a small delay to ensure all state updates are complete
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [
    isInitialized,
    urlParamsProcessed,
    page,
    search,
    priority,
    status,
    category,
    createdDateStart,
    createdDateEnd,
    dueDateStart,
    dueDateEnd,
    completedDateStart,
    completedDateEnd,
    maker,
    checker,
    client,
    franchise,
  ]);

  const fetchTasks = async () => {
    const params: any = {
      page,
      page_size: pageSize,
    };

    // Only add parameters that have values
    if (search) params.search = search;
    if (priority) params.priority = priority;
    if (status) params.status = status;
    if (category) params.category = category;

    // Created date filters
    if (createdDateStart && createdDateEnd) {
      params.created_after = createdDateStart;
      params.created_before = createdDateEnd;
    }

    // Due date filters
    if (dueDateStart && dueDateEnd) {
      params.due_after = dueDateStart;
      params.due_before = dueDateEnd;
    } else if (dueDateEnd && !dueDateStart) {
      // Handle case where only due end date is provided (for overdue tasks)
      params.due_before = dueDateEnd;
    } else if (dueDateStart && !dueDateEnd) {
      // Handle case where only due start date is provided
      params.due_after = dueDateStart;
    }

    // Completed date filters
    if (completedDateStart && completedDateEnd) {
      params.completed_after = completedDateStart;
      params.completed_before = completedDateEnd;
    }

    // User filters
    if (maker) params.maker = maker;
    if (checker) params.checker = checker;
    if (client) params.client = client;
    if (franchise) params.franchise = franchise;

    try {
      const res = await getTaskListService(params);

      if (res?.results) {
        setTasks(res.results);
        setTotalCount(res.count);
        setTotalPages(Math.ceil(res.count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setPriority("");
    setStatus("");
    setCategory("");
    setCreatedDateStart("");
    setCreatedDateEnd("");
    setDueDateStart("");
    setDueDateEnd("");
    setCompletedDateStart("");
    setCompletedDateEnd("");
    setMaker("");
    setChecker("");
    setClient("");
    setFranchise("");
    setPage(1);
    setShowMoreFilters(false);
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

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading filters...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
        {/* Basic Filters - Always Visible (Search, Priority, Status, Category) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Search Tasks
            </label>
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

          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Priority
            </label>
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
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
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
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category{" "}
              {category && <span className="text-blue-600">({category})</span>}
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* More Filters and Clear Filters buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            {showMoreFilters ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                More Filters
              </>
            )}
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
        </div>

        {/* Advanced Filters - Toggle Visibility */}
        {showMoreFilters && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            {/* User Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label
                  htmlFor="maker"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Maker
                </label>
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
                    <option key={user.id} value={user.phone_number}>
                      {user.full_name} ({user.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="checker"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Checker
                </label>
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
                    <option key={user.id} value={user.phone_number}>
                      {user.full_name} ({user.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="client"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Client
                </label>
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
                    <option key={user.id} value={user.phone_number}>
                      {user.full_name} ({user.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="franchise"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Franchise
                </label>
                <select
                  id="franchise"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={franchise}
                  onChange={(e) => {
                    setFranchise(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Franchises</option>
                  {franchiseList.map((franchiseItem) => (
                    <option
                      key={franchiseItem.id}
                      value={franchiseItem.phone_number}
                    >
                      {franchiseItem.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filter Rows - Each type gets its own row */}
            <div className="flex flex-wrap gap-8">
              {/* Created Date */}
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Created Date
                </label>
                <div className="flex items-end gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      From
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={createdDateStart}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setCreatedDateStart(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      To
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={createdDateEnd}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setCreatedDateEnd(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <div className="flex items-end gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      From
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={dueDateStart}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setDueDateStart(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      To
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={dueDateEnd}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setDueDateEnd(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Completed Date */}
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completed Date
                </label>
                <div className="flex items-end gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      From
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={completedDateStart}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setCompletedDateStart(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400">
                      To
                    </label>
                    <input
                      type="date"
                      className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                      value={completedDateEnd}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      onChange={(e) => {
                        setCompletedDateEnd(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
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
                    <TableCell className="text-center px-4 py-16" colSpan={9}>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                          No tasks found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {category
                            ? `No tasks found for category "${category}". Try selecting a different category or clear filters.`
                            : "No tasks match the selected filters. Try adjusting your filters or clear them to see all tasks."}
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
                        <Link to={`/user-details/${task.client?.id}`}>
                          {task.client?.full_name || "N/A"}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start text-blue-600">
                        <Link to={`/user-details/${task.maker?.id}`}>
                          {task.maker?.full_name || "N/A"}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {/* {totalPages > 1 && ( */}
      <div className="flex justify-center items-center mt-2 gap-2 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            className={`px-3 py-1 rounded ${
              page === pg
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* )} */}

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
