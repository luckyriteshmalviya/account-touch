import { useState } from "react";

interface PaymentProps {
    process: any;
    onComplete: () => void;
    onPrevious?: () => void;
}

export default function Payment({ process, onComplete, onPrevious }: PaymentProps) {
    if (!process.process_template_detail) {
        return <div className="text-red-500">No payment details found for this process</div>;
    }

    const minimumFees = process?.template?.fees || 0.0;
    const [fees, setFees] = useState(minimumFees);

    const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue) && newValue >= minimumFees) {
            setFees(newValue);
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
                    Process Type: <span className="font-medium">{process.process_template_detail.process_type}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Title: <span className="font-medium">{process.process_template_name || "Payment Process"}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Payment Status: <span className="font-medium">{process.status}</span>
                </p>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-auto"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
}
