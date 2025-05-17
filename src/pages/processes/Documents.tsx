import { useState, useRef, useEffect } from "react";
import { uploadDocumentService } from "../../services/restApi/task";

interface DocumentsProps {
    process: any;
    onComplete: () => void;
    onPrevious?: () => void;
}

type UploadStatusType = Record<string, { 
    status: 'idle' | 'uploading' | 'success' | 'error', 
    message?: string 
}>;

export default function Documents({ process, onComplete, onPrevious }: DocumentsProps) {
    const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
    const [allUploaded, setAllUploaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    console.log("setRefreshing", setRefreshing);

    // Check if there are already uploaded documents
    useEffect(() => {
        if (process.uploaded_documents && process.uploaded_documents.length > 0) {
            // Create a map of document types to their upload status
            const statusMap: UploadStatusType = {};
            
            // Mark documents that are already uploaded as successful
            process.uploaded_documents.forEach((doc: any) => {
                const docTypeSlug = doc.document_type?.slug || '';
                if (docTypeSlug) {
                    statusMap[docTypeSlug] = { status: 'success' };
                }
            });
            
            setUploadStatus(statusMap);
            
            // Check if all required documents are uploaded
            if (process.process_template_detail?.required_documents) {
                const allDone = process.process_template_detail.required_documents.every(
                    (doc: { slug?: string; name: string }) => {
                        const docId = doc.slug || doc.name;
                        return statusMap[docId]?.status === 'success';
                    }
                );
                
                setAllUploaded(allDone);
            }
        }
    }, [process]);

    if (!process.process_template_detail || !process.process_template_detail.required_documents) {
        return <div className="text-red-500">No document requirements found for this process</div>;
    }

    const requiredDocuments = process.process_template_detail.required_documents;

    const handleFileChange = async (documentType: any, event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        // Make sure we're using the slug as the document type identifier
        const documentTypeIdentifier = documentType.slug;
        
        console.log("Uploading document:", {
            processId: process.id,
            documentTypeIdentifier,
            documentType,
            processType: process.process_template_detail?.process_type
        });

        // Validate that we have a valid document type identifier
        if (!documentTypeIdentifier) {
            console.error("Missing document type slug", documentType);
            setUploadStatus(prev => ({
                ...prev,
                [documentType.name]: { 
                    status: 'error', 
                    message: "Invalid document type configuration. Missing slug." 
                }
            }));
            return;
        }

        setUploadStatus(prev => ({
            ...prev,
            [documentTypeIdentifier]: { status: 'uploading' }
        }));

        try {
            // Make sure we're using the correct process ID
            const result = await uploadDocumentService(
                process.id,
                documentTypeIdentifier,
                file
            );

            console.log("Upload result:", result);

            // FIXED CODE:
            if (result && !result.error) {
                // Create the updated status object first
                const updatedStatus: UploadStatusType = {
                    ...uploadStatus,
                    [documentTypeIdentifier]: { status: 'success' }
                };
                
                // Check if all documents are uploaded using the updated status
                const allDone = requiredDocuments.every((doc: { slug?: string; name: string; id: string }) => {
                    const docId = doc.slug || doc.name;
                    return updatedStatus[docId]?.status === 'success';
                });
            
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
                console.error("Document upload failed:", {
                    error: errorMessage,
                    status: result?.status,
                    data: result?.data
                });
                
                setUploadStatus(prev => ({
                    ...prev,
                    [documentTypeIdentifier]: { 
                        status: 'error', 
                        message: errorMessage
                    }
                }));
            }
        } catch (error) {
            console.error("Error uploading document:", error);
            setUploadStatus(prev => ({
                ...prev,
                [documentTypeIdentifier]: { 
                    status: 'error', 
                    message: "An error occurred during upload" 
                }
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
        
        return process.uploaded_documents.find((doc: any) => 
            doc.document_type?.slug === documentType.slug || 
            doc.document_type?.name === documentType.name
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please upload all the required documents to proceed.
            </p>

            {refreshing && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    const status = uploadStatus[documentId]?.status || 'idle';
                    const uploadedDoc = findUploadedDocument(document);

                    return (
                        <div key={document.id} className="border rounded-lg p-4 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white">{document.name}</h3>
                                    {document.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{document.description}</p>
                                    )}
                                    
                                    {/* Show uploaded document info */}
                                    {uploadedDoc && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Uploaded: {new Date(uploadedDoc.uploaded_at).toLocaleString()}
                                            </p>
                                            <a 
                                                href={uploadedDoc.file_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 inline-block"
                                            >
                                                View/Download Document
                                            </a>
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
                                        disabled={status === 'uploading'}
                                        className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            status === 'success'
                                                ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                                                : status === 'error'
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                                        } disabled:opacity-50`}
                                    >
                                        {status === 'uploading'
                                            ? 'Uploading...'
                                            : status === 'success'
                                            ? uploadedDoc ? 'Replace' : 'Uploaded ✓'
                                            : status === 'error'
                                            ? 'Try Again'
                                            : 'Upload File'}
                                    </button>
                                </div>
                            </div>
                            
                            {status === 'error' && uploadStatus[documentId]?.message && (
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
        </div>
    );
}