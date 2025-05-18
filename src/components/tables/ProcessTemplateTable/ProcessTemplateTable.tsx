import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  getProcessTemplatListService,
  deleteProcessTemplatService,
} from "../../../services/restApi/processTemplate";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Edit, Eye, Trash } from "lucide-react";

interface RequiredDocument {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

interface ProcessTemplat {
  id: number;
  title: string;
  process_type: string;
  status: string;
  required_documents: RequiredDocument[];
}

export default function ProcessTemplatTable() {
  const [processTemplat, setProcessTemplat] = useState<ProcessTemplat[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [processtype, setprocesstype] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProcessTemplat();
  }, [page, search, processtype]);

  const fetchProcessTemplat = async () => {
    const res = await getProcessTemplatListService({
      page,
      search,
      processtype,
    });
    if (res?.results) {
      setProcessTemplat(res.results);
      setTotalPages(Math.ceil(res.count / 10)); // assuming 10 per page
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const success = await deleteProcessTemplatService(deleteId);
      if (success) {
        setProcessTemplat((prev) =>
          prev.filter((proc) => proc.id !== deleteId)
        );
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Deleted Successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong!",
        });
      }
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex justify-between items-center mb-4">
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
        <div className="relative inline-block w-72">
          <select
            value={processtype}
            onChange={(e) => setprocesstype(e.target.value)}
            className="block w-full px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled value="">
              --------
            </option>
            <option value="questionnaire">Questionnaire</option>
            <option value="documentation">Documentation</option>
            <option value="payment">Payment</option>
            <option value="document_preparation">Document Preparation</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[850px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {[
                    "Title",
                    "Process Type",
                    "Status",
                    "Is Active",
                    "Created At",
                    "Required Document",
                    "Action",
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
                {processTemplat.map((proc) => {
                  const doc = proc.required_documents?.[0];
                  return (
                    <TableRow key={proc.id} className="text-center">
                      <TableCell className="px-4 py-4 text-start bold text-[#417893]">
                        {proc.title}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {proc.process_type
                          ? proc.process_type
                              .replace(/_/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {proc.status || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {proc.required_documents?.[0]?.is_active ? (
                          <span className="text-green-600 text-xl">✅</span>
                        ) : (
                          <span className="text-red-600 text-xl">❌</span>
                        )}
                      </TableCell>{" "}
                      <TableCell className="px-4 py-4 text-start">
                        {proc?.required_documents?.[0]?.created_at
                          ? new Date(proc?.required_documents?.[0]?.created_at)
                              .toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replace("AM", "a.m.")
                              .replace("PM", "p.m.")
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-start">
                        {doc?.name || "-"}
                      </TableCell>
                      <TableCell className="flex items-center gap-3 px-4 py-3">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/process-templates/view/${proc.id}`)
                          }
                        />
                        <Edit
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/manage-process-templates/${proc.id}`)
                          }
                        />
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(proc.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Delete Confirmation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this process template?
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
