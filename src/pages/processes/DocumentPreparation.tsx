import { useState, useRef, useEffect } from "react";
import { submitDocumentPreparationService } from "../../services/restApi/task";
import { uploadDocumentService } from "../../services/restApi/task";

interface DocumentPreparationProps {
    process: any;
    taskId: string;
    onComplete: () => void;
    onPrevious?: () => void;
}

type UploadStatusType = Record<string, { 
    status: 'idle' | 'uploading' | 'success' | 'error', 
    message?: string 
}>;

export default function DocumentPreparation({ process, onComplete, onPrevious }: DocumentPreparationProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
    const [allUploaded, setAllUploaded] = useState(false);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Check if we have any uploaded documents already
    useEffect(() => {
        if (process.uploaded_documents && process.uploaded_documents.length > 0) {
            const newUploadStatus: UploadStatusType = { ...uploadStatus };
            
            process.uploaded_documents.forEach((doc: any) => {
                if (doc.document_type && doc.document_type.slug) {
                    newUploadStatus[doc.document_type.slug] = { status: 'success' };
                }
            });
            
            setUploadStatus(newUploadStatus);
        }
    }, [process.uploaded_documents]);

    // Check if all required documents are uploaded
    useEffect(() => {
        if (!process.process_template_detail?.required_documents) return;
        
        const requiredDocuments = process.process_template_detail.required_documents;
        const allDone = requiredDocuments.every((doc: { slug?: string; name: string; id: string }) => {
            const docId = doc.slug || doc.name;
            return uploadStatus[docId]?.status === 'success';
        });
        
        if (allDone && requiredDocuments.length > 0) {
            setAllUploaded(true);
        }
    }, [uploadStatus, process.process_template_detail]);

    if (!process.process_template_detail || process.process_template_detail.process_type !== "document_preparation") {
        return <div className="text-red-500">No document preparation details found for this process</div>;
    }

    // This would need to be adjusted based on the actual structure of your document preparation process
    const requiredFields = process.process_template_detail.required_fields || [];
    const requiredDocuments = process.process_template_detail.required_documents || [];

    const handleInputChange = (fieldId: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const result = await submitDocumentPreparationService(process.id, formData);
            
            if (result && !result.error) {
                setSuccess(true);
                setTimeout(() => {
                    onComplete();
                }, 1500);
            } else {
                setError(result?.error || "Failed to submit document preparation");
            }
        } catch (err) {
            setError("An error occurred while submitting document preparation");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    message: "An error occurred while uploading the document" 
                }
            }));
        }
    };

    const handleUploadClick = (documentId: string) => {
        if (fileInputRefs.current[documentId]) {
            fileInputRefs.current[documentId]?.click();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Document Preparation</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please provide the required information and upload all the required documents to proceed.
            </p>

            {success ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Document preparation submitted successfully!
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {requiredFields.map((field: any) => (
                        <div key={field.id} className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                {field.name}
                                {field.is_required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            {field.description && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{field.description}</p>
                            )}

                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                required={field.is_required}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                            />
                        </div>
                    ))}

                    <div className="space-y-4">
                        {requiredDocuments.map((document: any) => {
                            const documentId = document.slug || document.name;
                            const status = uploadStatus[documentId]?.status || 'idle';

                            return (
                                <div key={document.id} className="border rounded-lg p-4 dark:border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800 dark:text-white">{document.name}</h3>
                                            {document.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{document.description}</p>
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
                                                disabled={status === 'uploading' || status === 'success'}
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
                                                    ? 'Uploaded ✓'
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

                    {/* Show uploaded documents if any */}
                    {process.uploaded_documents && process.uploaded_documents.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Uploaded Documents</h3>
                            <div className="space-y-4">
                                {process.uploaded_documents.map((document: any) => (
                                    <div key={document.id} className="border rounded-lg p-4 dark:border-gray-700 border-green-300 bg-green-50 dark:bg-green-900/20">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-800 dark:text-white">
                                                    {document.document_type?.name || "Document"}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Uploaded: {new Date(document.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {document.file_url && (
                                                <a 
                                                    href={document.file_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    View Document
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        {onPrevious && (
                            <button
                                type="button"
                                onClick={onPrevious}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || !allUploaded}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}