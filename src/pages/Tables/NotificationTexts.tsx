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
  deleteNotificationTextService,
  getNotificationTextListService,
} from "../../services/restApi/notificationTexts";

function NotificationTextsTable() {
  const [texts, setTexts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchTexts = async () => {
    try {
      const res = await getNotificationTextListService();
      if (res?.results) {
        setTexts(res.results);
      }
    } catch (err) {
      console.error("Failed to fetch notification texts", err);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const filteredTexts = texts.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.body.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        const success = await deleteNotificationTextService(deleteId);
        if (success) {
          setTexts((prev) => prev.filter((q) => q.id !== deleteId));
          Swal.fire(
            "Deleted!",
            "Notification Text deleted successfully.",
            "success"
          );
        } else {
          Swal.fire("Failed", "Could not delete notification text.", "error");
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
          placeholder="Search notifications..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate("/add-notification-text")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Notification
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100">
                <TableRow>
                  {["Title", "Body", "Is Active", "Actions"].map((header) => (
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
                {filteredTexts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No notifications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTexts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3">{item.title}</TableCell>
                      <TableCell className="px-4 py-3">{item.body}</TableCell>
                      <TableCell className="px-4 py-3">
                        {item.is_active ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="flex items-center gap-3 px-4 py-3">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/view-notification-text/${item.id}`)
                          }
                        />
                        <Edit
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/edit-notification-text/${item.id}`)
                          }
                        />
                        <Trash
                          className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => setDeleteId(item.id)}
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

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p className="mb-6">
              Are you sure you want to delete this notification?
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

export default NotificationTextsTable;
