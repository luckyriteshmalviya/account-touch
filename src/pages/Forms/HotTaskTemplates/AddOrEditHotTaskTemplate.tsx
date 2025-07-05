import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import HotTaskTemplatForm from "./HotTaskTemplateForm";
import { useEffect, useState } from "react";
import {
  addHotTaskTemplateService,
  getHotTaskTemplateDetailsService,
  updateHotTaskTemplateService,
} from "../../../services/restApi/hotTaskTemplate";

export default function AddOrEditHotTaskTemplatPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [existingData, setExistingData] = useState<any>(null);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getHotTaskTemplateDetailsService(id as string);
          setExistingData(data);
        } catch (error) {
          Swal.fire(
            "Error",
            "Failed to load Hot Task Template details",
            "error"
          );
        }
      })();
    }
  }, [id, isEdit]);

  const handleCreateOrUpdateHotTaskTemplate = async (payload: {
    task_template: number;
    featured_order: number;
  }) => {
    try {
      const service = isEdit
        ? updateHotTaskTemplateService(id as string, payload)
        : addHotTaskTemplateService(payload);

      const response = await service;

      if (response?.id) {
        await Swal.fire({
          icon: "success",
          title: `Hot Task Template ${isEdit ? "Updated" : "Created"}`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/hot-task-list");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <HotTaskTemplatForm
      onSubmit={handleCreateOrUpdateHotTaskTemplate}
      editMode={isEdit}
      existingData={existingData}
    />
  );
}
