import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Imported Swal
import CategoryForm from "./CategoryForm";
import {
  addCategoryService,
  updateCategoryService,
  getCategoryDetailsService,
} from "../../../services/restApi/category";

export default function AddOrEditCategoryPage() {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: null as File | null,
    imageUrl: "", // ✅ For preview in edit mode
  });

  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getCategoryDetailsService(id as string);
          setCategory({
            name: data.name || "",
            description: data.description || "",
            image: null,
            imageUrl: data.image || "",
          });
        } catch (error) {
          console.error("Error fetching category details:", error);
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch category details.",
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!category.name.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Category name is required!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description || "");
    if (category.image) {
      formData.append("image", category.image);
    }

    try {
      const result = isEdit
        ? await updateCategoryService(id as string, formData)
        : await addCategoryService(formData);

      if (result?.id) {
        await Swal.fire({
          icon: "success",
          title: `Category ${isEdit ? "Updated" : "Added"}`,
          text: `Category ${isEdit ? "updated" : "added"} successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/category-list"); // ✅ Go back to category list
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <CategoryForm
      category={category}
      setCategory={setCategory}
      onSubmit={handleSubmit}
      editMode={isEdit}
    />
  );
}
