import { useState, useRef } from "react";

interface PaymentProps {
    process: any;
    onComplete: () => void;
    onPrevious?: () => void;
}

type UploadStatusType = Record<string, {
    status: 'idle' | 'uploading' | 'success' | 'error',
    message?: string
}>;

export default function Payment({ process, onComplete, onPrevious }: PaymentProps) {
    if (!process.process_template_detail) {
        return <div className="text-red-500">No payment details found for this process</div>;
    }

    const minimumFees = process?.template?.fees || 0.0;
    const [fees, setFees] = useState(minimumFees);
    const [uploadStatus, setUploadStatus] = useState<UploadStatusType>({});
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const requiredDocuments = process.process_template_detail?.required_documents || [];

    const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= minimumFees) {
            setFees(newValue);
        }
    };

    const handleFileChange = async (documentType: any, event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        const file = event.target.files[0];
        const documentTypeIdentifier = documentType.slug;
        setUploadStatus(prev => ({
            ...prev,
            [documentTypeIdentifier]: { status: 'uploading' }
        }));
        try {
            // Replace this with your actual upload API call
            // e.g. await uploadDocumentService(process.id, documentTypeIdentifier, file);
            await new Promise(res => setTimeout(res, 1000)); // fake upload delay
            setUploadStatus(prev => ({
                ...prev,
                [documentTypeIdentifier]: { status: 'success' }
            }));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 1200);
        } catch (err) {
            setUploadStatus(prev => ({
                ...prev,
                [documentTypeIdentifier]: { status: 'error', message: 'Upload failed' }
            }));
            setError('Failed to upload document');
        }
    };

    const handleUploadClick = (documentId: string) => {
        if (fileInputRefs.current[documentId]) {
            fileInputRefs.current[documentId]?.click();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            
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
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Payment Status: <span className="font-medium">{process.status}</span>
                </p>
            </div>

            {/* Required Documents Upload Section */}
            {requiredDocuments.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-2">Required Documents</h3>
                    <div className="space-y-4">
                        {requiredDocuments.map((document: any) => {
                            const documentId = document.slug || document.name;
                            const status = uploadStatus[documentId]?.status || 'idle';
                            return (
                                <div key={document.id} className="border rounded-lg p-4 dark:border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-800 dark:text-white">{document.name}</h4>
                                            {document.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{document.description}</p>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(document, e)}
                                                ref={(el) => { fileInputRefs.current[documentId] = el; }}
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
                </div>
            )}

            {/* Uploaded Documents Section */}
            {process.uploaded_documents && process.uploaded_documents.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Uploaded Documents</h3>
                    <div className="space-y-4">
                        {process.uploaded_documents.map((document: any) => (
                            <div key={document.id} className="border rounded-lg p-4 dark:border-gray-700 border-green-300 bg-green-50 dark:bg-green-900/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-800 dark:text-white">
                                            {document.document_type?.name || "Document"}
                                        </h4>
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
        </div>
    );
}
