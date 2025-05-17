import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye, Pencil } from "lucide-react";
import { deleteDocumentTypeService, getDocumentTypeListService } from "../../../services/restApi/documentTypes";

interface DocumentType {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export default function DocumentTypeTable() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocumentTypes();
  }, [page, search]);

  const fetchDocumentTypes = async () => {
    const res = await getDocumentTypeListService({ page, search });
    if (res?.results) {
      setDocumentTypes(res.results);
      setTotalPages(Math.ceil(res.count / 10));
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this document type?");
    if (!confirm) return;

    const res = await deleteDocumentTypeService(id);
    if (res) {
      fetchDocumentTypes(); // Refresh the list
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(documentTypes.map((doc) => doc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search document types..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {/* <button
          onClick={() => navigate("/add-document-type")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>Add</span>
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === documentTypes.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell isHeader>Name</TableCell>
                  <TableCell isHeader>Slug</TableCell>
                  <TableCell isHeader>Created At</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(doc.id)}
                        onChange={() => handleSelectOne(doc.id)}
                      />
                    </TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.slug}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          title="View"
                          className="text-green-600 hover:text-green-800"
                          onClick={() => navigate(`/view-document-type/${doc.id}`)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => navigate(`/manage-document-type/${doc.id}`)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
