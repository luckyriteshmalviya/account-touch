import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  getHotTaskTemplateListService,
  deleteHotTaskTemplateService,
} from "../../../services/restApi/hotTaskTemplate";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Trash } from "lucide-react";
import Swal from "sweetalert2";
import useIsSuperAdmin from "../../../hooks/useIsSuperAdmin";

interface HotTaskTemplat {
  id: number;
  task_template: number;
  task_template_title: string;
  image: string;
  featured_order: number;
  created_by: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export default function HotTaskTemplatTable() {
  const isSuperAdmin = useIsSuperAdmin();
  const [hotTaskTemplats, setHotTaskTemplats] = useState<HotTaskTemplat[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const page_size = 10;
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotTaskTemplats();
  }, [page, search]);

  const fetchHotTaskTemplats = async () => {
    const res = await getHotTaskTemplateListService({
      page,
      page_size,
      search,
    });
    if (res?.results) {
      setHotTaskTemplats(res.results);
      setTotalPages(Math.ceil(res.count / page_size));
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const success = await deleteHotTaskTemplateService(deleteId);
      if (success) {
        setHotTaskTemplats((prev) =>
          prev.filter((item) => item.id !== deleteId)
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
      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Title..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[850px]">
            <Table className="w-full text-sm text-left text-gray-700">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {[
                    "Title",
                    "Image",
                    "Featured Order",
                    "Created At",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      className="font-bold text-black py-3 px-4"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {hotTaskTemplats.map((item) => (
                  <TableRow key={item.id} className="border-b hover:bg-gray-50">
                    <TableCell className="px-4 py-4 text-[#417893] font-medium">
                      {item.task_template_title}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="Template"
                          className="w-10 h-10 rounded object-cover border"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {item.featured_order}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 px-4 flex items-center gap-2">
                      <Eye
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() =>
                          navigate(`/hot-task-templates/view/${item.id}`)
                        }
                      />
                      <Edit
                        className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() =>
                          navigate(`/manage-hot-task-templates/${item.id}`)
                        }
                      />
                      {isSuperAdmin && (
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(item.id)}
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Confirmation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this hot task template?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
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
