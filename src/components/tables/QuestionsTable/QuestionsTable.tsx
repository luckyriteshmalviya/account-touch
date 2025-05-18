import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";

import { Edit, Trash, Eye } from "lucide-react";
import Swal from "sweetalert2";
import {
  deleteQuestionService,
  getQuestionListService,
} from "../../../services/restApi/Questions";

interface Question {
  id: number;
  text: string;
  question_type: "Descriptive" | "Multiple Choice";
  created_at: string;
}

function QuestionsTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [page, search]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await getQuestionListService({ page, search });
      if (res?.results) {
        setQuestions(res.results);
        setTotalPages(Math.ceil(res.count / 10));
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load questions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        const result = await deleteQuestionService(deleteId);
        if (result) {
          setQuestions((prev) => prev.filter((q) => q.id !== deleteId));
          Swal.fire("Deleted!", "Question deleted successfully.", "success");
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
          placeholder="Search questions..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100">
                <TableRow>
                  {["#", "Text", "Type", "Created At", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        isHeader
                        className="px-4 py-3 font-medium text-gray-500 text-start"
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {loading ? (
                  <TableRow>
                    <TableCell className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-6">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="px-4 py-3">{q.id}</TableCell>
                      <TableCell className="px-4 py-3">{q.text}</TableCell>
                      <TableCell className="px-4 py-3">
                        {q.question_type
                          .split("_")
                          .map((item) => item[0].toUpperCase() + item.slice(1))
                          .join(" ")}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {new Date(q.created_at).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell className="flex items-center gap-3 px-4 py-3">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => navigate(`/question/view/${q.id}`)}
                        />
                        <Edit
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => navigate(`/manage-question/${q.id}`)}
                        />
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(q.id)}
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
            <p className="mb-6">
              Are you sure you want to delete this question?
            </p>
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

export default QuestionsTable;
