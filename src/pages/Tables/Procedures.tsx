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

interface Procedure {
  id: number;
  title: string;
  description: string;
  created_by?: {
    full_name: string;
    email: string;
  };
  steps: {
    id: number;
    step_text: string;
    description: string;
  }[];
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
      setProcedures(res.results);
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
          <div className="min-w-[950px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Title", "Description", "Steps", "Actions"].map(
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

              <TableBody>
                {procedures.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell className="px-4 py-3 text-[#417893] font-semibold">
                      {proc.title}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {proc.description}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {proc.steps.length > 0
                        ? proc.steps.map((s) => s.step_text).join(", ")
                        : "No Steps"}
                    </TableCell>
                    <TableCell className="flex items-center gap-3 px-4 py-3">
                      <Eye
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => navigate(`/procedures/view/${proc.id}`)}
                      />
                      <Edit
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => navigate(`/manage-procedure/${proc.id}`)}
                      />
                      {isSuperAdmin && (
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(proc.id)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
