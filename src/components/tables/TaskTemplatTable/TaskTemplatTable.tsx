import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import {
    getTaskTemplatListService,
    deleteTaskTemplatService,
    getTaskTemplatCategory
} from "../../../services/restApi/taskTemplat";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Edit, Eye, Trash } from "lucide-react";

interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
}

interface TaskTemplat {
    id: number;
    title: string;
    priority: string;
    is_active: boolean;
    category: Category;
    order: number;
    fees: any;
    image: string;
}


export default function TaskTemplatTable() {
    const [taskTemplat, setTaskTemplat] = useState<TaskTemplat[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [isReady, setIsReady] = useState<boolean | undefined>(undefined);
    const page_size = 10
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getTaskTemplatCategory();
            if (res?.results) {
                setCategories(res?.results);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchTaskTemplat();
    }, [page, search, isReady, isActive, selectedCategory]);

    const fetchTaskTemplat = async () => {
        const res = await getTaskTemplatListService({ page, search, selectedCategory, isActive, isReady, page_size });
        if (res?.results) {
            setTaskTemplat(res.results);
            setTotalPages(Math.ceil(res.count / 10)); // assuming 10 per page
        }
    };

    const handleDelete = async () => {
        console.log(deleteId)
        // if (deleteId !== null) {
        //     const success = await deleteTaskTemplatService(deleteId);
        //     if (success) {
        //         setTaskTemplat(prev => prev.filter(proc => proc.id !== deleteId));
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Deleted!',
        //             text: 'Deleted Successfully!',
        //         });
        //     } else {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Error!',
        //             text: 'Something went wrong!',
        //         });
        //     }
        //     setDeleteId(null);
        // }
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
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option disabled value="">
                            --------
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="relative inline-block w-72">
                    <select
                        value={isActive === undefined ? "" : String(isActive)} // handle undefined
                        onChange={(e) => {
                            const val = e.target.value;
                            setIsActive(val === "true" ? true : val === "false" ? false : undefined);
                        }}
                        className="block w-full px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option disabled value="">Select Status</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
                <div className="relative inline-block w-72">
                    <select
                        value={isReady === undefined ? "" : String(isReady)} // convert boolean to string for matching
                        onChange={(e) => {
                            const val = e.target.value;
                            setIsReady(val === "true" ? true : val === "false" ? false : undefined);
                        }}
                        className="block w-full px-4 py-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option disabled value="">Select Status</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[850px]">
                        <Table className="w-full text-sm text-left text-gray-700">
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    {["Title", "PRIORITY", "Is Active", "CATEGORY", "ORDER", "FEES", "IMAGE", "Action"].map((header) => (
                                        <TableCell key={header} className="font-bold text-black py-3 px-4">
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {taskTemplat.map((proc) => (
                                    <TableRow key={proc.id} className="border-b hover:bg-gray-50">
                                        <TableCell className="px-4 py-4 bold text-[#417893]">{proc.title}</TableCell>
                                        <TableCell className="py-3 px-4 capitalize">{proc.priority}</TableCell>
                                        <TableCell className="py-3 px-4">
                                            {proc.is_active ? (
                                                <span className="text-green-600 text-lg">✅</span>
                                            ) : (
                                                <span className="text-red-600 text-lg">❌</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-4">{proc.category?.name || "-"}</TableCell>
                                        <TableCell className="py-3 px-4">{proc.order}</TableCell>
                                        <TableCell className="py-3 px-4">{proc.fees}</TableCell>
                                        <TableCell className="py-3 px-4">
                                            {proc.image ? (
                                                <img
                                                    src={proc.image}
                                                    alt="Task Template"
                                                    className="w-10 h-10 rounded object-cover border"
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 flex items-center gap-2">
                                            <Eye
                                                className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                                                onClick={() => navigate(`/task-templates/view/${proc.id}`)}
                                            />
                                            <Edit
                                                className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                                                onClick={() => navigate(`/manage-task-templates/${proc.id}`)}
                                            />
                                            <Trash
                                                className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                                                onClick={() => setDeleteId(proc.id)}
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
                            Are you sure you want to delete this task template?
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
