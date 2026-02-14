import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

/**
 * Test Results Panel
 * Displays detailed test results after code submission
 */
export default function TestResultsPanel({ testResults, status, passedTests, totalTests, runtime }) {
    if (!testResults) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case "Accepted":
                return <CheckCircle2 className="text-success" size={24} />;
            case "Wrong Answer":
                return <XCircle className="text-error" size={24} />;
            case "Runtime Error":
                return <AlertCircle className="text-warning" size={24} />;
            case "Time Limit Exceeded":
                return <Clock className="text-warning" size={24} />;
            default:
                return <XCircle className="text-error" size={24} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Accepted":
                return "text-success";
            case "Wrong Answer":
                return "text-error";
            case "Runtime Error":
            case "Time Limit Exceeded":
                return "text-warning";
            default:
                return "text-error";
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                        <h3 className={`text-xl font-bold ${getStatusColor(status)}`}>{status}</h3>
                        <p className="text-sm text-base-content/70">
                            {passedTests}/{totalTests} tests passed • Avg runtime: {runtime}ms
                        </p>
                    </div>
                </div>
            </div>

            {/* Individual Test Results */}
            <div className="space-y-2">
                <h4 className="font-semibold text-base-content">Test Results:</h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {testResults.map((test, idx) => (
                        <div
                            key={idx}
                            className={`collapse collapse-arrow bg-base-200 ${test.passed ? "border-l-4 border-success" : "border-l-4 border-error"
                                }`}
                        >
                            <input type="checkbox" />
                            <div className="collapse-title flex items-center gap-2">
                                {test.passed ? (
                                    <CheckCircle2 className="text-success" size={18} />
                                ) : (
                                    <XCircle className="text-error" size={18} />
                                )}
                                <span className="font-medium">
                                    Test {test.testNumber} - {test.passed ? "Passed" : "Failed"}
                                </span>
                                <span className="text-sm text-base-content/60 ml-auto">
                                    {test.runtime}ms
                                </span>
                            </div>
                            <div className="collapse-content">
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-semibold">Input:</span>
                                        <pre className="bg-base-300 p-2 rounded mt-1 overflow-x-auto">
                                            {test.input || "No input"}
                                        </pre>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Expected Output:</span>
                                        <pre className="bg-base-300 p-2 rounded mt-1 overflow-x-auto">
                                            {test.expectedOutput}
                                        </pre>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Your Output:</span>
                                        <pre
                                            className={`p-2 rounded mt-1 overflow-x-auto ${test.passed ? "bg-success/10" : "bg-error/10"
                                                }`}
                                        >
                                            {test.actualOutput}
                                        </pre>
                                    </div>
                                    {test.error && !test.passed && (
                                        <div>
                                            <span className="font-semibold text-error">Error:</span>
                                            <pre className="bg-error/10 p-2 rounded mt-1 overflow-x-auto text-error">
                                                {test.error}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
