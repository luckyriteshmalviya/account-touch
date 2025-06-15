import { useState, useRef, useEffect } from "react";
import { uploadDocumentService } from "../../services/restApi/task";

interface DocumentsProps {
  process: any;
  onComplete: () => void;
  onPrevious?: () => void;
}

type UploadStatusType = Record<
  string,
  {
    status: "idle" | "uploading" | "success" | "error";
    message?: string;
  }
>;

export default function Documents({
  process,
  onComplete,
  onPrevious,
}: DocumentsProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
  const [allUploaded, setAllUploaded] = useState(false);
  const [refreshing] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if there are already uploaded documents
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

  if (
    !process.process_template_detail ||
    !process.process_template_detail.required_documents
  ) {
    return (
      <div className="text-red-500">
        No document requirements found for this process
      </div>
    );
  }

  const requiredDocuments = process.process_template_detail.required_documents;

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
    if (fileInputRefs.current[documentId]) {
      fileInputRefs.current[documentId]?.click();
    }
  };

  // Find uploaded document by type
  const findUploadedDocument = (documentType: any) => {
    if (!process.uploaded_documents) return null;

    return process.uploaded_documents.find(
      (doc: any) =>
        doc.document_type?.slug === documentType.slug ||
        doc.document_type?.name === documentType.name
    );
  };

  //preview document

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setIsModalOpen(false);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Please upload all the required documents to proceed.
      </p>

      {refreshing && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Refreshing document status...
        </div>
      )}

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
                        // href={uploadedDoc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 inline-block cursor-pointer"
                        onClick={() => openPreview(uploadedDoc.file_url)}
                      >
                        View/Download Document
                      </a>

                      {/* <button
        onClick={() =>
          openPreview(uploadedDoc.file_url)
        }
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View .docx Document
      </button> */}
                    </div>
                  )}
                </div>
                <div>
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

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Previous Step
          </button>
        )}

        {/* Show Next button if all documents are uploaded */}
        {allUploaded && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-auto"
          >
            Next Step
          </button>
        )}
      </div>

      {/* Modal */}
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
