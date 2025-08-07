import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Eye, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import {
  deleteStepService,
  getStepsListService,
} from "../../services/restApi/steps";

function StepsTable() {
  const [steps, setSteps] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchSteps = async () => {
    const res = await getStepsListService({ page, search, page_size: 10 });
    if (res) {
      setSteps(res.results || []);
      setTotalPages(Math.ceil(res.count / 10));
    }
  };

  useEffect(() => {
    fetchSteps();
  }, [page, search]);

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        const result = await deleteStepService(deleteId);
        if (result) {
          setSteps((prev) => prev.filter((q) => q.id !== deleteId));
          Swal.fire("Deleted!", "Step deleted successfully.", "success");
        } else {
          throw new Error("Delete failed");
        }
      } catch (err) {
        Swal.fire("Error", "Something went wrong!", "error");
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <>
      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search steps..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to page 1 on search
          }}
        />
        <button
          onClick={() => navigate("/add-step")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Step
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100">
                <TableRow>
                  {["Step Text", "Description", "Actions"].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-4 py-3 font-medium text-gray-500 text-start"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {steps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      No steps found.
                    </TableCell>
                  </TableRow>
                ) : (
                  steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell className="px-4 py-3">
                        {step.step_text}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {step.description}
                      </TableCell>
                      <TableCell className="flex items-center gap-3 px-4 py-3">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => navigate(`/view-step/${step.id}`)}
                        />
                        <Edit
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => navigate(`/edit-step/${step.id}`)}
                        />
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(step.id)}
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

      {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p className="mb-6">Are you sure you want to delete this step?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
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

export default StepsTable;
