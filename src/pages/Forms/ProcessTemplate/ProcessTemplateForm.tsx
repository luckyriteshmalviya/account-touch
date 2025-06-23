import React, { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Select from "react-select";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import { useNavigate } from "react-router";

interface Questionnaire {
  id: string;
  title: string;
}

interface ProcessTemplatFormProps {
  processTemplat: {
    title: string;
    description?: string;
    process_type: string;
  };
  setProcessTemplat: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  editMode?: boolean;
  questionnaireList: Questionnaire[];
  setSelectedQuestionnaire: React.Dispatch<React.SetStateAction<string>>;
  selectedQuestionnaire: string;
  documentList: any[];
  setSelectedDocumentType: React.Dispatch<React.SetStateAction<any[]>>;
  selectedDocumentType: string[];
}

const ProcessTemplatForm = ({
  processTemplat,
  setProcessTemplat,
  onSubmit,
  editMode = false,
  questionnaireList,
  setSelectedQuestionnaire,
  selectedQuestionnaire,
  documentList,
  setSelectedDocumentType,
  selectedDocumentType,
}: ProcessTemplatFormProps) => {
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    questionnaire_id?: string;
    process_type?: string;
    documentation_id?: string;
  }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!processTemplat.title.trim()) {
      newErrors.title = "Title is required.";
    }
    // if (!processTemplat.description?.trim()) {
    //   newErrors.description = "Description is required.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ComponentCard
        title={editMode ? "Edit Process Template" : "Add New Process Template"}
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
          {/* Title Field */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={processTemplat.title}
              type="text"
              id="title"
              onChange={(e) =>
                setProcessTemplat((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <TextArea
              rows={6}
              value={processTemplat.description}
              error
              onChange={(value) =>
                setProcessTemplat((prev: any) => ({
                  ...prev,
                  description: value,
                }))
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Process type */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="process_type">
              Process Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="process_type"
              className="w-full border rounded px-3 py-2"
              value={processTemplat.process_type}
              onChange={(e) => {
                const type = e.target.value;
                setProcessTemplat((prev: any) => ({
                  ...prev,
                  process_type: type,
                }));
                // Reset state on type change
                setSelectedQuestionnaire("");
                setSelectedDocumentType([]);
              }}
              required
            >
              <option value="">Select Process</option>
              <option value="questionnaire">Questionnaire</option>
              <option value="documentation">Documentation</option>
              <option value="payment">Payment</option>
              <option value="document_preparation">Document Preparation</option>
            </select>
            {errors.process_type && (
              <p className="text-red-500 text-sm">{errors.process_type}</p>
            )}
          </div>

          {/* Questionnaire Dropdown - Single select */}
          {processTemplat.process_type === "questionnaire" && (
            <div className="space-y-2 col-span-2">
              <Label htmlFor="questionnaire_id">
                Questionnaire <span className="text-red-500">*</span>
              </Label>
              <select
                id="questionnaire_id"
                className="w-full border rounded px-3 py-2"
                value={selectedQuestionnaire}
                onChange={(e) => setSelectedQuestionnaire(e.target.value)}
                required
              >
                <option value="">-- Select Questionnaire --</option>
                {questionnaireList.map((q: any) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
              {errors.questionnaire_id && (
                <p className="text-red-500 text-sm">
                  {errors.questionnaire_id}
                </p>
              )}
            </div>
          )}

          {/* Documentation Dropdown - Multi select
          {processTemplat.process_type === "documentation" && (
            <div className="space-y-2 col-span-2">
              <Label htmlFor="documentation_id">
                Documents <span className="text-red-500">*</span>
              </Label>
              <select
                id="documentation_id"
                className="w-full border rounded px-3 py-2 h-40"
                multiple
                value={selectedDocumentType}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  );
                  setSelectedDocumentType([...selected]);
                }}
                required
              >
                {documentList?.map((doc: any) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              {errors.documentation_id && (
                <p className="text-red-500 text-sm">
                  {errors.documentation_id}
                </p>
              )}
            </div>
          )} */}

          {/* Document Preparation Dropdown - Multi select */}
          {processTemplat.process_type === "document_preparation" ||
          processTemplat.process_type === "documentation" ||
          processTemplat.process_type === "payment" ? (
            <div className="space-y-2 col-span-2">
              <Label htmlFor="documentation_id">
                {processTemplat.process_type === "documentation"
                  ? "Documents"
                  : "Document Preparation"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                isMulti={
                  processTemplat.process_type === "payment" ? false : true
                }
                id="documentation_id"
                name="documents"
                options={documentList.map((doc) => ({
                  value: doc.id,
                  label: doc.name,
                }))}
                value={documentList
                  .filter((doc) => selectedDocumentType.includes(doc.id))
                  .map((doc) => ({ value: doc.id, label: doc.name }))}
                onChange={(selectedOptions: any) => {
                  let selectedIds: string[] = [];

                  if (Array.isArray(selectedOptions)) {
                    selectedIds = selectedOptions.map(
                      (option: any) => option.value
                    );
                  } else if (selectedOptions) {
                    selectedIds = [selectedOptions.value];
                  }

                  // Find Payment Receipt doc id
                  const paymentReceiptDoc = documentList.find(
                    (doc) => doc.name === "Payment Receipt"
                  );

                  // If process_type is payment — always include it
                  if (
                    processTemplat.process_type === "payment" &&
                    paymentReceiptDoc &&
                    !selectedIds.includes(paymentReceiptDoc.id)
                  ) {
                    selectedIds = [...selectedIds, paymentReceiptDoc.id];
                  }

                  setSelectedDocumentType(selectedIds);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />

              {/* Show selected documents preparation*/}
              <div className="flex flex-col flex-wrap gap-2 mt-2">
                {documentList
                  ?.filter((item: any) =>
                    selectedDocumentType.includes(item.id)
                  )
                  ?.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex justify-between bg-blue-100 text-blue-800 px-3 py-1 rounded-full items-center"
                    >
                      <div>{doc.name}</div>
                      {!(
                        processTemplat.process_type === "payment" &&
                        doc.name === "Payment Receipt"
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDocumentType((prev: string[]) =>
                              prev.filter((id) => id !== doc.id)
                            )
                          }
                          className="ml-2 text-red-500 hover:text-red-700"
                          aria-label={`Remove ${doc.name}`}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  ))}
              </div>

              {errors.documentation_id && (
                <p className="text-red-500 text-sm">
                  {errors.documentation_id}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editMode ? "Save Changes" : "Save"}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={() => navigate("/process-templates-list")}
              className="px-6 py-2 border border-1 border-zinc-400 hover:bg-blue-400 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </ComponentCard>
    </form>
  );
};

export default ProcessTemplatForm;
