import { useEffect, useState, useRef } from "react";
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
import {
  Edit,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { getUserListService } from "../../../services/restApi/user";
import { getCategoryListService } from "../../../services/restApi/category";
import useIsSuperAdmin from "../../../hooks/useIsSuperAdmin";
import { Trash2 } from "lucide-react";

// DateRangePicker Component Props Interface
interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  placeholder?: string;
  label?: string;
}

// DateRangePicker Component
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  placeholder = "Select date range",
  label = "Date Range",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [, setIsSelectingEnd] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setIsSelectingEnd(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startDate, endDate]);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getDisplayText = (): string => {
    if (tempStartDate && tempEndDate) {
      return `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`;
    }
    if (tempStartDate) {
      return `${formatDate(tempStartDate)} - Select end date`;
    }
    return placeholder;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isInRange = (date: Date): boolean => {
    if (!tempStartDate || !tempEndDate || !date) return false;
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isToday = (date: Date): boolean => {
    if (!date) return false;
    return isSameDay(date, new Date());
  };

  const handleDateClick = (date: Date): void => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
      setIsSelectingEnd(true);
    } else if (tempStartDate && !tempEndDate) {
      if (date >= tempStartDate) {
        setTempEndDate(date);
        setIsSelectingEnd(false);
        setTimeout(() => {
          onDateChange(tempStartDate, date);
          setIsOpen(false);
        }, 200);
      } else {
        setTempStartDate(date);
        setTempEndDate(null);
      }
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const clearDates = (): void => {
    setTempStartDate(null);
    setTempEndDate(null);
    setIsSelectingEnd(false);
    onDateChange(null, null);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      <div
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-sm ${
            tempStartDate || tempEndDate
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-2">
          {(tempStartDate || tempEndDate) && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                clearDates();
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4 min-w-[320px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <h3 className="font-semibold text-gray-900 dark:text-white">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>

            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-10" />;
              }

              const isStart = isSameDay(date, tempStartDate);
              const isEnd = isSameDay(date, tempEndDate);
              const inRange = isInRange(date);
              const today = isToday(date);

              let className =
                "h-10 w-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all duration-200 ";

              if (isStart || isEnd) {
                className += "bg-blue-600 text-white font-semibold ";
              } else if (inRange) {
                className +=
                  "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 ";
              } else if (today) {
                className += "bg-purple-500 text-white font-semibold ";
              } else {
                className +=
                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={className}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            {!tempStartDate
              ? "Select start date"
              : !tempEndDate
              ? "Select end date"
              : "Range selected"}
          </div>
        </div>
      )}
    </div>
  );
};

// Main TasksTable Component Interfaces
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
  completion_date: string;
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
type StatusType =
  | "pending"
  | "started"
  | "completed"
  | "in_progress"
  | "rejected";

export default function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [, setTotalCount] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const pageSize: number = 10;

  // Basic filters (always visible)
  const [search, setSearch] = useState<string>("");
  const [priority, setPriority] = useState<PriorityType | "">("");
  const [status, setStatus] = useState<StatusType | "">("");
  const [category, setCategory] = useState<string>("");

  // More filters toggle
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);

  // Date range filters using Date objects
  const [createdDateStart, setCreatedDateStart] = useState<Date | null>(null);
  const [createdDateEnd, setCreatedDateEnd] = useState<Date | null>(null);
  const [dueDateStart, setDueDateStart] = useState<Date | null>(null);
  const [dueDateEnd, setDueDateEnd] = useState<Date | null>(null);
  const [completedDateStart, setCompletedDateStart] = useState<Date | null>(
    null
  );
  const [completedDateEnd, setCompletedDateEnd] = useState<Date | null>(null);

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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState<boolean>(false);

  const navigate = useNavigate();

  // Helper function to convert date to string format
  const dateToString = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Helper function to convert string to date
  const stringToDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  const isSuperAdmin = useIsSuperAdmin();

  // First load all dropdown data
  useEffect(() => {
    const fetchUserLists = async (): Promise<void> => {
      try {
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

        if (makerResponse?.results) setMakerList(makerResponse.results);
        if (checkerResponse?.results) setCheckerList(checkerResponse.results);
        if (clientResponse?.results) setClientList(clientResponse.results);
        if (franchiseResponse?.results)
          setFranchiseList(franchiseResponse.results);
        if (categoryResponse?.results)
          setCategoryList(categoryResponse.results);

        setIsInitialized(true);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setIsInitialized(true);
      }
    };

    fetchUserLists();
  }, []);

  // Handle URL parameters after initialization - ONLY ONCE
  useEffect(() => {
    if (!isInitialized || urlParamsProcessed) return;

    const handleUrlParameters = (): void => {
      const categoryParam = searchParams.get("category");
      if (categoryParam) {
        setCategory(categoryParam);
        setShowMoreFilters(true);
      }

      const statusParam = searchParams.get("status");
      if (statusParam) {
        const firstStatus = statusParam.split(",")[0];
        if (
          [
            "pending",
            "started",
            "completed",
            "in_progress",
            "rejected",
          ].includes(firstStatus)
        ) {
          setStatus(firstStatus as StatusType);
          setShowMoreFilters(true);
        }
      }

      const createdStartParam = searchParams.get("created_start");
      const createdEndParam = searchParams.get("created_end");

      if (createdStartParam && createdEndParam) {
        setCreatedDateStart(stringToDate(createdStartParam));
        setCreatedDateEnd(stringToDate(createdEndParam));
        setShowMoreFilters(true);
      }

      const dueStartParam = searchParams.get("due_start");
      const dueEndParam = searchParams.get("due_end");

      if (dueStartParam && dueEndParam) {
        setDueDateStart(stringToDate(dueStartParam));
        setDueDateEnd(stringToDate(dueEndParam));
        setShowMoreFilters(true);
      } else if (dueEndParam && !dueStartParam) {
        setDueDateEnd(stringToDate(dueEndParam));
        setShowMoreFilters(true);
      }

      const showMoreParam = searchParams.get("show_more");
      if (showMoreParam === "true") {
        setShowMoreFilters(true);
      }

      setUrlParamsProcessed(true);
    };

    handleUrlParameters();
  }, [isInitialized, searchParams, urlParamsProcessed]);

  // Fetch tasks only after initialization is complete and URL params are processed
  useEffect(() => {
    if (!isInitialized || !urlParamsProcessed) return;

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

  const fetchTasks = async (): Promise<void> => {
    const params: Record<string, any> = {
      page,
      page_size: pageSize,
    };

    if (search) params.search = search;
    if (priority) params.priority = priority;
    if (status) params.status = status;
    if (category) params.category = category;

    // Created date filters
    if (createdDateStart && createdDateEnd) {
      params.created_after = dateToString(createdDateStart);
      params.created_before = dateToString(createdDateEnd);
    }

    // Due date filters
    if (dueDateStart && dueDateEnd) {
      params.due_after = dateToString(dueDateStart);
      params.due_before = dateToString(dueDateEnd);
    } else if (dueDateEnd && !dueDateStart) {
      params.due_before = dateToString(dueDateEnd);
    } else if (dueDateStart && !dueDateEnd) {
      params.due_after = dateToString(dueDateStart);
    }

    // Completed date filters
    if (completedDateStart && completedDateEnd) {
      params.completed_after = dateToString(completedDateStart);
      params.completed_before = dateToString(completedDateEnd);
    }

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
  const clearFilters = (): void => {
    setSearch("");
    setPriority("");
    setStatus("");
    setCategory("");
    setCreatedDateStart(null);
    setCreatedDateEnd(null);
    setDueDateStart(null);
    setDueDateEnd(null);
    setCompletedDateStart(null);
    setCompletedDateEnd(null);
    setMaker("");
    setChecker("");
    setClient("");
    setFranchise("");
    setPage(1);
    setShowMoreFilters(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteId !== null) {
      const success = await deleteTaskService(deleteId);
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

  // Date range change handlers
  const handleCreatedDateChange = (
    start: Date | null,
    end: Date | null
  ): void => {
    setCreatedDateStart(start);
    setCreatedDateEnd(end);
    setPage(1);
  };

  const handleDueDateChange = (start: Date | null, end: Date | null): void => {
    setDueDateStart(start);
    setDueDateEnd(end);
    setPage(1);
  };

  const handleCompletedDateChange = (
    start: Date | null,
    end: Date | null
  ): void => {
    setCompletedDateStart(start);
    setCompletedDateEnd(end);
    setPage(1);
  };

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
        {/* Basic Filters - Always Visible */}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatus(e.target.value as StatusType | "");
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="started">Started</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
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

            {/* Date Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DateRangePicker
                startDate={createdDateStart}
                endDate={createdDateEnd}
                onDateChange={handleCreatedDateChange}
                label="Created Date Range"
                placeholder="Select created date range"
              />

              <DateRangePicker
                startDate={dueDateStart}
                endDate={dueDateEnd}
                onDateChange={handleDueDateChange}
                label="Due Date Range"
                placeholder="Select due date range"
              />

              <DateRangePicker
                startDate={completedDateStart}
                endDate={completedDateEnd}
                onDateChange={handleCompletedDateChange}
                label="Completed Date Range"
                placeholder="Select completed date range"
              />
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
                    "Completion Date",
                    "Due Date",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
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
                          onClick={(e: React.MouseEvent) => {
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
                        {new Date(task.completion_date).toLocaleDateString()}
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
                        {isSuperAdmin && task.status !== "completed" && (
                          <Trash2
                            className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={() => setDeleteId(task.id)}
                          />
                        )}
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
