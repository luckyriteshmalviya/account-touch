import { useState, useRef, useEffect } from "react";
import {
  uploadDocumentService,
  updatePaymentStatusService,
  requestPaymentService,
  updateTaskDetails,
} from "../../services/restApi/task";

interface PaymentProps {
  task: any;
  process: any;
  onComplete: () => void;
  onPrevious?: () => void;
  refreshProcess?: () => void;
}

type UploadStatusType = Record<
  string,
  {
    status: "idle" | "uploading" | "success" | "error";
    message?: string;
  }
>;

export default function Payment({
  process,
  onComplete,
  onPrevious,
  refreshProcess,
  task,
}: PaymentProps) {
  if (!process.process_template_detail) {
    return (
      <div className="text-red-500">
        No payment details found for this process
      </div>
    );
  }

  const [fees, setFees] = useState(task.fees);
  const [originalFees, setOriginalFees] = useState(task.fees);
  const [feesError, setFeesError] = useState("");
  const [isUpdatingFees, setIsUpdatingFees] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [allUploaded, setAllUploaded] = useState(false);

  const requiredDocuments =
    process.process_template_detail.required_documents || [];
  const paymentStatus = process.status || "PENDING";

  // Check if task is completed
  const isTaskCompleted = task.status?.toLowerCase() === "completed";

  const checkFees = (value: string = fees) => {
    const numericValue = parseFloat(value) || 0;
    const numericTaskFees = parseFloat(task.fees) || 0;

    if (numericValue < numericTaskFees) {
      setFeesError(`Fees must be at least ${numericTaskFees}`);
      return false;
    }
    setFeesError("");
    return true;
  };

  // Check if the fees have meaningfully changed (ignoring decimal .00)
  const hasFeesChanged = () => {
    const currentFees = parseFloat(fees) || 0;
    const originalFeesNum = parseFloat(originalFees) || 0;
    return Math.abs(currentFees - originalFeesNum) >= 1;
  };

  useEffect(() => {
    if (process.uploaded_documents && process.uploaded_documents.length > 0) {
      // Create a map of document types to their upload status
      const statusMap: UploadStatusType = {};

      // Mark documents that are already uploaded as successful
      process.uploaded_documents.forEach((doc: any) => {
        const docTypeSlug = doc.document_type?.slug || "";
        if (docTypeSlug) {
          statusMap[docTypeSlug] = { status: "success" };
        }
      });

      setUploadStatus(statusMap);

      // Check if all required documents are uploaded
      if (process.process_template_detail?.required_documents) {
        const allDone =
          process.process_template_detail.required_documents.every(
            (doc: { slug?: string; name: string }) => {
              const docId = doc.slug || doc.name;
              return statusMap[docId]?.status === "success";
            }
          );

        setAllUploaded(allDone);
      }
    }
  }, [process]);

  useEffect(() => {
    if (process.uploaded_documents && process.uploaded_documents.length > 0) {
      const statusMap: UploadStatusType = {};

      process.uploaded_documents.forEach((doc: any) => {
        const docTypeSlug = doc.document_type?.slug || "";
        if (docTypeSlug) {
          statusMap[docTypeSlug] = { status: "success" };
        }
      });

      setUploadStatus(statusMap);
    }
  }, [process]);

  const handleFileChange = async (
    documentType: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    // Make sure we're using the slug as the document type identifier
    const documentTypeIdentifier = documentType.slug;

    // Validate that we have a valid document type identifier
    if (!documentTypeIdentifier) {
      setUploadStatus((prev) => ({
        ...prev,
        [documentType.name]: {
          status: "error",
          message: "Invalid document type configuration. Missing slug.",
        },
      }));
      return;
    }

    setUploadStatus((prev) => ({
      ...prev,
      [documentTypeIdentifier]: { status: "uploading" },
    }));

    try {
      // Make sure we're using the correct process ID
      const result = await uploadDocumentService(
        process.id,
        documentTypeIdentifier,
        file
      );

      // FIXED CODE:
      if (result && !result.error) {
        // Create the updated status object first
        const updatedStatus: UploadStatusType = {
          ...uploadStatus,
          [documentTypeIdentifier]: { status: "success" },
        };

        // Check if all documents are uploaded using the updated status
        const allDone = requiredDocuments.every(
          (doc: { slug?: string; name: string; id: string }) => {
            const docId = doc.slug || doc.name;
            return updatedStatus[docId]?.status === "success";
          }
        );

        // Update the state
        setUploadStatus(updatedStatus);

        if (allDone) {
          setAllUploaded(true);
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      } else {
        const errorMessage = result?.error || "Failed to upload document";

        setUploadStatus((prev) => ({
          ...prev,
          [documentTypeIdentifier]: {
            status: "error",
            message: errorMessage,
          },
        }));
      }
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [documentTypeIdentifier]: {
          status: "error",
          message: "An error occurred during upload",
        },
      }));
    }
  };

  const handleUploadClick = (documentId: string) => {
    const fees = checkFees();
    if (!fees) return;

    if (fileInputRefs.current[documentId]) {
      fileInputRefs.current[documentId]?.click();
    }
  };

  const findUploadedDocument = (documentType: any) => {
    if (!process.uploaded_documents) return null;

    return process.uploaded_documents.find(
      (doc: any) =>
        doc.document_type?.id === documentType.id ||
        doc.document_type?.slug === documentType.slug
    );
  };

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
  };

  const getPreviewIframeSrc = (url: string) => {
    const extension = url.split(".").pop()?.split("?")[0]?.toLowerCase();

    // Handle image files
    if (
      ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(extension || "")
    ) {
      return url;
    }

    if (extension === "docx" || extension === "doc") {
      return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url
      )}`;
    }

    if (extension === "pdf") {
      return url;
    }

    return null;
  };

  // Handle status update
  const handleStatusUpdate = async (
    newStatus:
      | "PENDING"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "REJECTED"
      | "CANCELLED"
  ) => {
    setIsLoading(true);
    setStatusUpdateMessage(null);

    try {
      const result = await updatePaymentStatusService(process.id, newStatus);

      if (result && !result.error) {
        setStatusUpdateMessage({
          type: "success",
          text: `Payment status updated to ${newStatus} successfully`,
        });

        // Refresh the process data
        if (refreshProcess) {
          refreshProcess();
        }
      } else {
        setStatusUpdateMessage({
          type: "error",
          text: result?.error || "Failed to update payment status",
        });
      }
    } catch (err) {
      setStatusUpdateMessage({
        type: "error",
        text: "An error occurred while updating payment status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment request
  const handleRequestPayment = async () => {
    const fees = checkFees();
    if (!fees) return;

    setIsLoading(true);
    setStatusUpdateMessage(null);

    try {
      const result = await requestPaymentService(process.id);

      if (result && !result.error) {
        setStatusUpdateMessage({
          type: "success",
          text: "Payment request sent successfully",
        });

        // Refresh the process data
        if (refreshProcess) {
          refreshProcess();
        }
      } else {
        setStatusUpdateMessage({
          type: "error",
          text: result?.error || "Failed to request payment",
        });
      }
    } catch (err) {
      setStatusUpdateMessage({
        type: "error",
        text: "An error occurred while requesting payment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        <p className="text-gray-600 dark:text-gray-300 ">
          Payment Status:{" "}
          <span
            className={`font-medium ${
              paymentStatus === "completed"
                ? "text-green-600"
                : paymentStatus === "rejected"
                ? "text-red-600"
                : paymentStatus === "cancelled"
                ? "text-gray-500"
                : ""
            }`}
          >
            {paymentStatus}
          </span>
        </p>
      </div>

      {/* fees */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
            Fees:{" "}
            <input
              className={`font-medium border rounded px-2 py-1 w-32 ${
                feesError ? "border-red-500" : "border-gray-300"
              }`}
              type="number"
              value={fees}
              onChange={(e) => {
                const newValue = e.target.value;
                setFees(newValue);
                checkFees(newValue);
              }}
              onBlur={() => checkFees()}
              min={task.fees}
              step="0.01"
            />
          </label>
          {hasFeesChanged() && !feesError && (
            <button
              onClick={async () => {
                try {
                  setIsUpdatingFees(true);
                  await updateTaskDetails(task.id, { fees: fees });
                  setOriginalFees(fees);
                  setStatusUpdateMessage({
                    type: "success",
                    text: "Fees updated successfully",
                  });
                } catch (error) {
                  setStatusUpdateMessage({
                    type: "error",
                    text: "Failed to update fees",
                  });
                } finally {
                  setIsUpdatingFees(false);
                }
              }}
              disabled={isUpdatingFees}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingFees ? "Updating..." : "Update Fees"}
            </button>
          )}
        </div>
        {feesError && <div className="text-red-600 mt-1">{feesError}</div>}
      </div>

      {allUploaded && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          All documents uploaded successfully!
        </div>
      )}

      <div className="space-y-4">
        {requiredDocuments.map((document: any) => {
          const documentId = document.slug || document.name;
          const status = uploadStatus[documentId]?.status || "idle";
          const uploadedDoc = findUploadedDocument(document);

          return (
            <div
              key={document.id}
              className="border rounded-lg p-4 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {document.name}
                  </h3>
                  {document.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {document.description}
                    </p>
                  )}

                  {/* Show uploaded document info */}
                  {uploadedDoc && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Uploaded:{" "}
                        {new Date(uploadedDoc.uploaded_at).toLocaleString()}
                      </p>

                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 inline-block cursor-pointer"
                        onClick={() => openPreview(uploadedDoc.file_url)}
                      >
                        View/Download Document
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  {/* Only show upload/replace button if task is not completed */}
                  {!isTaskCompleted && (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(document, e)}
                        ref={(el) => {
                          fileInputRefs.current[documentId] = el;
                        }}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <button
                        type="button"
                        onClick={() => handleUploadClick(documentId)}
                        disabled={status === "uploading"}
                        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          status === "success"
                            ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                            : status === "error"
                            ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
                            : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                        } disabled:opacity-50`}
                      >
                        {status === "uploading"
                          ? "Uploading..."
                          : status === "success"
                          ? uploadedDoc
                            ? "Replace"
                            : "Uploaded ✓"
                          : status === "error"
                          ? "Try Again"
                          : "Upload File"}
                      </button>
                    </>
                  )}

                  {/* Show status indicator when task is completed */}
                  {isTaskCompleted && status === "success" && (
                    <div className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700">
                      Document Uploaded ✓
                    </div>
                  )}
                </div>
              </div>

              {status === "error" && uploadStatus[documentId]?.message && (
                <div className="mt-2 text-sm text-red-600">
                  {uploadStatus[documentId].message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status update message */}
      {statusUpdateMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            statusUpdateMessage.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {statusUpdateMessage.text}
        </div>
      )}

      {/* Payment action buttons */}
      <div className="flex justify-end gap-2 mt-6 mb-4">
        {/* PENDING / REJECTED */}
        {["pending", "rejected"].includes(process.status) && (
          <>
            <button
              onClick={handleRequestPayment}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Request Payment"}
            </button>
            <button
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Cancel"}
            </button>
          </>
        )}

        {/* IN_PROGRESS */}
        {process.status === "in_progress" && (
          <>
            <button
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Completed"}
            </button>
            <button
              onClick={() => handleStatusUpdate("REJECTED")}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Reject"}
            </button>
            <button
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={isLoading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Cancel"}
            </button>
          </>
        )}

        {/* CANCELLED */}
        {process.status === "cancelled" && (
          <button
            onClick={() => handleStatusUpdate("PENDING")}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Activate"}
          </button>
        )}
      </div>

      <div className="flex justify-between mt-8">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Previous Step
          </button>
        )}

        <button
          onClick={() => {
            onComplete();
          }}
          disabled={!allUploaded}
          className={`px-4 py-2 rounded-md ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            allUploaded
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-600"
          }`}
          title={
            !allUploaded
              ? "Please upload all required documents to proceed"
              : ""
          }
        >
          Next Step
        </button>
      </div>

      {isModalOpen && previewUrl && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex items-start justify-start min-h-screen pl-8 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal Container - Stretches to right edge and full height */}
            <div className="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all h-screen flex flex-col relative left-0 w-full sm:left-64 sm:w-[calc(100%-16rem)]">
              {/* Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={closePreview}
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Documents
                  </button>
                  <button
                    onClick={closePreview}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close preview"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  Document Preview
                </h3>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto bg-gray-50 p-4">
                {(() => {
                  const iframeSrc = getPreviewIframeSrc(previewUrl);
                  const isImage = previewUrl?.match(
                    /\.(jpeg|jpg|png|gif|webp)$/i
                  );

                  if (isImage && previewUrl) {
                    return (
                      <div className="flex items-center justify-center h-full">
                        <img
                          src={previewUrl}
                          alt="Document Preview"
                          className="max-w-full max-h-[70vh] object-contain shadow-lg rounded bg-white p-4"
                          onError={(e) => {
                            console.error("Error loading image:", e);
                            console.error(
                              "Image URL that failed to load:",
                              previewUrl
                            );
                          }}
                        />
                      </div>
                    );
                  }

                  if (iframeSrc) {
                    return (
                      <div className="w-full h-full bg-white shadow-lg rounded overflow-hidden">
                        <iframe
                          src={iframeSrc}
                          title="Document Preview"
                          className="w-full h-[70vh] border-0"
                        />
                      </div>
                    );
                  }

                  return (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          Preview not available
                        </h3>
                        <p className="mt-1 text-gray-500">
                          This file type cannot be previewed in the browser.
                        </p>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <a
                  href={previewUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download Document
                </a>
                <button
                  type="button"
                  onClick={closePreview}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
