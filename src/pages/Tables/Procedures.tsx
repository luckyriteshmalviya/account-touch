import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Eye, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useIsSuperAdmin from "../../hooks/useIsSuperAdmin";
import {
  deleteProcedureService,
  getProceduresListService,
} from "../../services/restApi/Procedure";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Procedure {
  id: number;
  title: string;
  description: string;
  created_by?: {
    full_name: string;
    email: string;
  };
  steps: {
    step_id: number;
    step_text: string;
    description: string;
    order: number;
  }[];
  showDropdown?: boolean;
}

export default function ProceduresTable() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const isSuperAdmin = useIsSuperAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProcedures();
  }, [page, search]);

  const fetchProcedures = async () => {
    const res = await getProceduresListService({ page, search });
    if (res?.results) {
      setProcedures(
        res.results.map((proc: any) => ({
          ...proc,
          showAllSteps: false,
        }))
      );
      setTotalPages(Math.ceil(res.count / 10));
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const success = await deleteProcedureService(deleteId);
      if (success) {
        setProcedures((prev) => prev.filter((proc) => proc.id !== deleteId));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Procedure deleted successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong while deleting.",
        });
      }
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search procedures..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button
          onClick={() => navigate("/manage-procedure")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Procedure
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Title",
                    "Description",
                    "Created By",
                    "Steps",
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

              <TableBody>
                {procedures.length > 0 ? (
                  procedures.map((proc) => (
                    <TableRow key={proc.id}>
                      {/* Title */}
                      <TableCell className="px-4 py-3 text-[#417893] font-semibold">
                        {proc.title || "-"}
                      </TableCell>

                      {/* Description */}
                      <TableCell className="px-4 py-3">
                        {proc.description || "-"}
                      </TableCell>

                      {/* Created By */}
                      <TableCell className="px-4 py-3">
                        {proc.created_by?.full_name
                          ? proc.created_by.full_name
                          : "N/A"}
                      </TableCell>

                      {/* Steps */}

                      <TableCell className="px-4 py-3 max-w-xs break-words">
                        {proc.steps.length > 0 ? (
                          proc.steps.length <= 2 ? (
                            // Directly show steps if 2 or fewer
                            <ol className="list-decimal pl-4 space-y-1">
                              {proc.steps
                                .sort((a, b) => a.order - b.order)
                                .map((s, idx) => (
                                  <li key={idx}>
                                    <span className="font-medium">
                                      {s.step_text}
                                    </span>
                                    {/* {s.description && (
                                      <div className="text-gray-500 text-xs">
                                        {s.description}
                                      </div>
                                    )} */}
                                  </li>
                                ))}
                            </ol>
                          ) : (
                            // Show dropdown if more than 2 steps
                            <div className="relative">
                              <button
                                type="button"
                                className="text-blue-600 flex items-center gap-1"
                                onClick={() =>
                                  setProcedures((prev) =>
                                    prev.map((p) =>
                                      p.id === proc.id
                                        ? {
                                            ...p,
                                            showDropdown: !p.showDropdown,
                                          }
                                        : p
                                    )
                                  )
                                }
                              >
                                View Steps ({proc.steps.length})
                                {proc.showDropdown ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </button>

                              {proc.showDropdown && (
                                <div className="absolute z-20 mt-2 pl-4 bg-white border shadow-md rounded-lg w-64 max-h-60 overflow-y-auto">
                                  <ol className="list-decimal p-3 space-y-2">
                                    {proc.steps
                                      .sort((a, b) => a.order - b.order)
                                      .map((s, idx) => (
                                        <li key={idx}>
                                          <span className="font-medium">
                                            {s.step_text}
                                          </span>
                                          {/* {s.description && (
                                            <div className="text-gray-500 text-xs">
                                              {s.description}
                                            </div>
                                          )} */}
                                        </li>
                                      ))}
                                  </ol>
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <span className="text-gray-500">No Steps</span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="flex items-center gap-3 px-4 py-3">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/procedures/view/${proc.id}`)
                          }
                        />
                        <Edit
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/manage-procedure/${proc.id}`)
                          }
                        />
                        {isSuperAdmin && (
                          <Trash
                            className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={() => setDeleteId(proc.id)}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 py-6"
                    >
                      No procedures found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p className="mb-6">
              Are you sure you want to delete this procedure?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
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
