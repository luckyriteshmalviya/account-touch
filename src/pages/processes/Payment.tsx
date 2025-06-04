import { useState, useRef, useEffect } from "react";
import {
  uploadDocumentService,
  updatePaymentStatusService,
  requestPaymentService,
} from "../../services/restApi/task";

interface PaymentProps {
  task: any;
  process: any;
  onComplete: () => void;
  onPrevious?: () => void;
  userRole?: string;
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
  userRole,
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

  // Check different possible paths for fees in the process object
  const minimumFees = task.fees;
  process?.process_template_detail?.fees ||
    process?.template?.fees ||
    process?.fees ||
    process?.amount ||
    0.0;
  console.log("tk", task);
  console.log("Process object:", process);
  console.log("Process template detail:", process?.process_template_detail);
  console.log("Minimum fees value:", minimumFees);

  const [fees, setFees] = useState(minimumFees);
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [, setError] = useState<string | null>(null);
  const [, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const requiredDocuments = process.required_documents || [];
  const paymentStatus = process.status || "PENDING";

  // Check if user is admin or checker
  const isAdminOrChecker =
    userRole === "super-admin" ||
    userRole === "admin" ||
    userRole === "checker";
  console.log("fees", fees);
  console.log("userRole in payment", userRole);

  console.log("requiredDocuments in payment", requiredDocuments);
  console.log("process in payment", process);

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

  const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= minimumFees) {
      setFees(newValue);
    }
  };

  const handleFileChange = async (
    documentType: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const documentTypeIdentifier = documentType.slug;

    if (!documentTypeIdentifier) {
      console.error("Missing document type slug", documentType);
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
      const result = await uploadDocumentService(
        process.id,
        documentTypeIdentifier,
        file
      );

      if (result && !result.error) {
        setUploadStatus((prev) => ({
          ...prev,
          [documentTypeIdentifier]: { status: "success" },
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1200);

        // Refresh the process data to show the newly uploaded document
        // In a real implementation, you would want to update the process state with the new document
      } else {
        setUploadStatus((prev) => ({
          ...prev,
          [documentTypeIdentifier]: {
            status: "error",
            message: result?.error || "Upload failed",
          },
        }));
        setError(result?.error || "Failed to upload document");
      }
    } catch (err) {
      setUploadStatus((prev) => ({
        ...prev,
        [documentTypeIdentifier]: { status: "error", message: "Upload failed" },
      }));
      setError("Failed to upload document");
    }
  };

  const handleUploadClick = (documentId: string) => {
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
    if (url.toLowerCase().endsWith(".pdf")) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(
        url
      )}&embedded=true`;
    }

    if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(url)) {
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
          Payment Status: <span className="font-medium">{paymentStatus}</span>
        </p>
      </div>

      <div className="mb-6">
        <label className="text-gray-600 dark:text-gray-300">
          Minimum Fees:{" "}
          <input
            className="font-medium border rounded px-2 py-1 w-32"
            type="number"
            value={fees}
            onChange={handleFeesChange}
            min={minimumFees}
          />
        </label>
      </div>

      {requiredDocuments.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Required Documents</h3>
          <div className="space-y-4">
            {requiredDocuments.map((document: any) => {
              const documentId = document.slug || document.name;
              const status = uploadStatus[documentId]?.status || "idle";
              const uploadedDoc = findUploadedDocument(document);

              return (
                <div
                  key={documentId}
                  className={`border rounded-lg p-4 ${
                    status === "success" || uploadedDoc
                      ? "dark:border-green-700 border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "dark:border-gray-700 border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {document.name}
                      </h4>
                      {document.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {document.description}
                        </p>
                      )}
                    </div>

                    {uploadedDoc ? (
                      <button
                        onClick={() => openPreview(uploadedDoc.file_url)}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Document
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`file-${documentId}`}
                          className="hidden"
                          onChange={(e) => handleFileChange(document, e)}
                          ref={(el) => {
                            fileInputRefs.current[documentId] = el;
                          }}
                        />
                        <button
                          onClick={() => handleUploadClick(documentId)}
                          disabled={status === "uploading"}
                          className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            status === "uploading"
                              ? "bg-gray-400 cursor-not-allowed"
                              : status === "success"
                              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                              : status === "error"
                              ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                          }`}
                        >
                          {status === "uploading"
                            ? "Uploading..."
                            : status === "success"
                            ? "Uploaded ✓"
                            : status === "error"
                            ? "Try Again"
                            : "Upload File"}
                        </button>
                      </div>
                    )}
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
        </div>
      )}

      {process.uploaded_documents && process.uploaded_documents.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium text-gray-800 dark:text-white mb-3">
            Uploaded Documents
          </h3>
          <div className="space-y-4">
            {process.uploaded_documents.map((document: any) => (
              <div
                key={document.id}
                className="border rounded-lg p-4 dark:border-gray-700 border-green-300 bg-green-50 dark:bg-green-900/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {document.document_type?.name || "Document"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded:{" "}
                      {new Date(document.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  {document.file_url && (
                    <button
                      onClick={() => openPreview(document.file_url)}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Document
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
        {/* Request Payment button - visible to all users */}
        <button
          onClick={handleRequestPayment}
          disabled={isLoading}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Request Payment"}
        </button>

        {/* Completed button - only visible to Admin and Checker */}
        {isAdminOrChecker && (
          <button
            onClick={() => handleStatusUpdate("COMPLETED")}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Completed"}
          </button>
        )}

        {/* Rejected button - only visible to Admin and Checker */}
        {isAdminOrChecker && (
          <button
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Rejected"}
          </button>
        )}

        {/* Cancelled button - only visible to Admin and Checker */}
        {isAdminOrChecker && (
          <button
            onClick={() => handleStatusUpdate("CANCELLED")}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Cancelled"}
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
          onClick={onComplete}
          className="px-4 py-2 rounded-md ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Next Step
        </button>
      </div>

      {isModalOpen && previewUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Document Preview
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                {(() => {
                  const iframeSrc = getPreviewIframeSrc(previewUrl);

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
