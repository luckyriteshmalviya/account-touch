import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentTypeForm from "./DocumentTypeForm";

import Swal from "sweetalert2";
import { addDocumentTypeService, getDocumentTypeDetailsService, updateDocumentTypeService } from "../../../services/restApi/documentTypes";

const AddOrEditDocumentType = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [documentType, setDocumentType] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      getDocumentTypeDetailsService(id).then((res:any) => {
        if (res) {
          setDocumentType({
            name: res.name || "",
            description: res.description || "",
            isActive: res.is_active ?? true,
          });
        }
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", documentType.name);
    formData.append("description", documentType.description || "");
    formData.append("is_active", documentType.isActive.toString());

    const response = isEditMode
      ? await updateDocumentTypeService(id!, formData)
      : await addDocumentTypeService(formData);

    if (response) {
      const successMsg = isEditMode
        ? "Document type updated!"
        : "Document type created!";
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/document-type-list");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the document type.",
      });
    }
  };

  return (
    <DocumentTypeForm
      documentType={documentType}
      setDocumentType={setDocumentType}
      onSubmit={handleSubmit}
      editMode={isEditMode}
    />
  );
};

export default AddOrEditDocumentType;
