import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { getUserListService } from "../../../services/restApi/user";
import { Eye, Trash } from "lucide-react";
import Swal from "sweetalert2";

interface Order {
  id: number;
  phone_number: string;
  email: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  roles: string[];
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  created_by: {
    id: number;
    email: string | null;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  assigned_to: string | null;
  pan_card?: string;
  aadhar_card?: string;
}

export default function UserTableOne() {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0); // Total number of records (needed for pagination)

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch users with current filters and pagination
  const fetchUsers = async () => {
    const params: any = {
      page,
      page_size: pageSize,
    };

    if (searchTerm) params.search = searchTerm;
    if (roleFilter) params.role = roleFilter;

    const res = await getUserListService(params);

    if (res && Array.isArray(res.results)) {
      setTableData(res.results);
      setTotalCount(res.count); // Update the total count for pagination
    }
  };

  // Effect to fetch users when filters or page changes
  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm, roleFilter]);

  // Effect to apply status filtering when statusFilter changes
  useEffect(() => {
    let filtered = [...tableData];

    // Apply the status filter
    if (statusFilter === "true") {
      filtered = filtered.filter((user) => user.is_active);
    } else if (statusFilter === "false") {
      filtered = filtered.filter((user) => !user.is_active);
    }

    // Update the filteredData
    setFilteredData(filtered);

    // Adjust the pagination if necessary
    const totalFilteredPages = Math.ceil(filtered.length / pageSize);
    if (page > totalFilteredPages && totalFilteredPages > 0) {
      setPage(1); // Reset page to 1 if there are fewer filtered pages
    }

    // If status is "All", show all records, otherwise apply filter
    if (statusFilter === "") {
      setFilteredData(tableData); // Show all users when no status filter is applied
    }

  }, [statusFilter, tableData]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalCount / pageSize); // We use totalCount from API response to get the total number of pages

  // Get paginated data based on current page
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Handler for showing user details
  const showDetails = (order: Order) => {
    navigate(`/user-details/${order.id}`, { state: { hideFields: true } });
  };

  // Handler for deleting a user
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const accessToken = auth?.access;
      try {
        const response = await fetch(
          `https://api.accountouch.com/api/users/users/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 204) {
          setTableData((prevUsers) =>
            prevUsers.filter((user) => user.id !== id)
          );
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire("Error", "There was a problem deleting the user.", "error");
        }
      } catch (e) {
        console.log("Delete API error", e);
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <>
      {/* Filters */}
      {/* udpate on 3/5/2025 */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to page 1 when searching
          }}
          placeholder="Search by name, phone, email, PAN, Aadhar"
          className="px-3 py-2 border rounded-md"
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1); // Reset to page 1 when filter changes
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Checker">Checker</option>
          <option value="Maker">Maker</option>
          <option value="Franchise">Franchise</option>
          <option value="Client">Client</option>
        </select>

        {/* udpate on 3/5/2025 */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset to page 1 when filter changes
          }}
          className="px-3 py-2 border rounded-md w-[120px]"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        {/* udpate on 3/5/2025 */}
          <div className="min-w-[850px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["S. No.", "User name", "Phone Number", "Email", "Roles", "Status", "Assigned To", "Action"].map(
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
              {/* udpate on 3/5/2025  px-4 */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-4 text-start">{index+1}</TableCell>
                    <TableCell className="px-4 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {order.full_name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {new Date(order.date_joined).toDateString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-start">{order.phone_number}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{order.email || "-"}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{order.roles?.join(", ")}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{order.is_active ? "Active" : "Inactive"}</TableCell>
                    <TableCell className="px-4 py-4 text-start">{order.assigned_to || "-"}</TableCell>
                    <TableCell className="flex items-center gap-3 px-4 py-3">
                      <Eye
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => showDetails(order)}
                      />
                      <Trash
                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => handleDelete(order.id)}
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
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
