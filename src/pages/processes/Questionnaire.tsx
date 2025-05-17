import { useState, useEffect } from "react";
import { submitQuestionnaireService } from "../../services/restApi/task";

interface QuestionnaireProps {
    process: any;
    taskId: string;
    onComplete: () => void;
    onPrevious?: () => void;
}

export default function Questionnaire({ process, taskId, onComplete, onPrevious }: QuestionnaireProps) {
    const [responses, setResponses] = useState<Record<number, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const questionnaire = process.process_template_detail.questionnaire;
    const existingSubmission = process.questionnaire_submission;
    
    // Check if there are existing responses
    const hasExistingResponses = existingSubmission && existingSubmission.responses && existingSubmission.responses.length > 0;
    
    // Initialize responses from existing submission if available
    useEffect(() => {
        if (hasExistingResponses && !isEditing) {
            const initialResponses: Record<number, any> = {};
            existingSubmission.responses.forEach((response: any) => {
                initialResponses[response.question] = response.text_response !== null
                    ? { text_response: response.text_response }
                    : { selected_choice: response.selected_choice };
            });
            setResponses(initialResponses);
            
            // If process is completed, mark as success
            if (process.status === 'completed') {
                setSuccess(true);
            }
        }
    }, [existingSubmission, process.status, isEditing]);
    
    if (!questionnaire) {
        return <div className="text-red-500">No questionnaire found for this process</div>;
    }

    const handleInputChange = (questionId: number, value: string | number, type: string) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: type === 'text' ? { text_response: value } : { selected_choice: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const responseData = Object.entries(responses).map(([questionId, response]) => ({
                question: parseInt(questionId),
                ...(response.text_response !== undefined ? { text_response: response.text_response } : {}),
                ...(response.selected_choice !== undefined ? { selected_choice: response.selected_choice } : {})
            }));

            const payload = {
                questionnaire_id: questionnaire.id,
                process_id: process.id,
                task_id: taskId,
                response_data: responseData
            };

            const result = await submitQuestionnaireService(payload);
            
            if (result && !result.error) {
                setSuccess(true);
                setIsEditing(false);
                setTimeout(() => {
                    onComplete();
                }, 1500);
            } else {
                // Handle specific error cases
                if (result?.status === 403) {
                    setError(`Permission denied: ${result.error || "You do not have permission to submit this questionnaire"}. Please contact an administrator.`);
                } else {
                    setError(result?.error || "Failed to submit questionnaire. Please try again later.");
                }
                console.error("Questionnaire submission failed:", result);
            }
        } catch (err) {
            setError("An error occurred while submitting the questionnaire");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess(false);
    };

    // Find the existing response for a question
    const getExistingResponse = (questionId: number) => {
        if (!hasExistingResponses) return null;
        return existingSubmission.responses.find((r: any) => r.question === questionId);
    };

    // Check if all required questions have responses
    const areAllRequiredFieldsFilled = () => {
        if (!hasExistingResponses) return false;
        
        // Get all required questions
        const requiredQuestions = questionnaire.questions.filter((q: any) => q.is_required);
        
        // Check if all required questions have responses
        return requiredQuestions.every((q: any) => {
            const response = getExistingResponse(q.id);
            return response && (
                (response.text_response !== null && response.text_response !== '') || 
                response.selected_choice !== null
            );
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{questionnaire.title}</h2>
            {questionnaire.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-6">{questionnaire.description}</p>
            )}

            {success && !isEditing ? (
                <div>
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Questionnaire submitted successfully!
                    </div>
                    
                    {/* Display submitted responses in read-only mode */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Your Responses:</h3>
                        {questionnaire.questions.map((question: any) => {
                            const response = getExistingResponse(question.id);
                            if (!response) return null;
                            
                            return (
                                <div key={question.id} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{question.text}</p>
                                    {response.question_type === 'multiple_choice' ? (
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {response.selected_choice_text}
                                        </p>
                                    ) : (
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {response.text_response}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-end flex-col">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Edit Responses
                            </button>
                            {hasExistingResponses && !isEditing && (
                                <button
                                    type="button"
                                    onClick={() => onComplete()}
                                    className={`px-4 py-2 ml-2 ${areAllRequiredFieldsFilled() 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-gray-400 cursor-not-allowed'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                                    disabled={!areAllRequiredFieldsFilled()}
                                    title={!areAllRequiredFieldsFilled() ? "Please complete all required fields before proceeding" : ""}
                                >
                                    Next
                                </button>
                            )}
                            {onPrevious && (
                                <button
                                    type="button"
                                    onClick={onPrevious}
                                    className="px-4 py-2 ml-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Previous
                                </button>
                            )}
                        </div>
                        {hasExistingResponses && !isEditing && !areAllRequiredFieldsFilled() && (
                            <p className="text-red-500 text-sm mt-2 text-right">Please complete all required fields before proceeding.</p>
                        )}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {questionnaire.questions.map((question: any) => {
                        const existingResponse = getExistingResponse(question.id);
                        
                        return (
                            <div key={question.id} className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    {question.text}
                                    {question.is_required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {question.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{question.description}</p>
                                )}

                                {question.question_type === 'text' || question.question_type === 'descriptive' ? (
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        rows={3}
                                        required={question.is_required}
                                        onChange={(e) => handleInputChange(question.id, e.target.value, 'text')}
                                        defaultValue={existingResponse?.text_response || ''}
                                    />
                                ) : question.question_type === 'multiple_choice' ? (
                                    <div className="space-y-2">
                                        {question.choices.map((choice: any) => (
                                            <div key={choice.id} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`choice-${choice.id}`}
                                                    name={`question-${question.id}`}
                                                    value={choice.id}
                                                    required={question.is_required}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                                    onChange={() => handleInputChange(question.id, choice.id, 'choice')}
                                                    defaultChecked={existingResponse?.selected_choice === choice.id}
                                                />
                                                <label htmlFor={`choice-${choice.id}`} className="ml-2 block text-gray-700 dark:text-gray-300">
                                                    {choice.text}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}

                    <div className="flex justify-end flex-col">
                        <div className="flex justify-end">
                            {hasExistingResponses && isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setSuccess(true);
                                        }}
                                        className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Updating..." : "Update Responses"}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
                                </button>
                            )}
                            {hasExistingResponses && !isEditing && (
                                <button
                                    type="button"
                                    onClick={() => onComplete()}
                                    className={`px-4 py-2 ml-2 ${areAllRequiredFieldsFilled() 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-gray-400 cursor-not-allowed'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                                    disabled={!areAllRequiredFieldsFilled()}
                                    title={!areAllRequiredFieldsFilled() ? "Please complete all required fields before proceeding" : ""}
                                >
                                    Next
                                </button>
                            )}
                            {onPrevious && (
                                <button
                                    type="button"
                                    onClick={onPrevious}
                                    className="px-4 py-2 ml-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Previous
                                </button>
                            )}
                        </div>
                        {hasExistingResponses && !isEditing && !areAllRequiredFieldsFilled() && (
                            <p className="text-red-500 text-sm mt-2 text-right">Please complete all required fields before proceeding.</p>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
