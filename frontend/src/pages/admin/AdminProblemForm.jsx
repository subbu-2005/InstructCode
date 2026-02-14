import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useCreateProblem, useUpdateProblem } from "../../hooks/admin/useAdminProblems";
import { useProblem } from "../../hooks/useProblems";
import { Save, X, Plus, Trash2, Sparkles, Loader, Wand2 } from "lucide-react";
import { generateProblemWithAI, generateTestCasesWithAI } from "../../api/ai";
import toast from "react-hot-toast";

/**
 * Admin Problem Form Page
 * Create or edit a problem with full fields
 */
export default function AdminProblemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const { data: existingProblem, isLoading: loadingProblem } = useProblem(id);
    const createMutation = useCreateProblem();
    const updateMutation = useUpdateProblem();

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        difficulty: "Easy",
        category: "",
        description: {
            text: "",
            notes: [],
        },
        examples: [],
        constraints: [],
        starterCode: {
            javascript: "",
            python: "",
            java: "",
        },
        expectedOutput: {
            javascript: "",
            python: "",
            java: "",
        },
        testCases: [],
        timeLimit: 2000,
        memoryLimit: 256,
    });

    // AI Generation state
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingTestCases, setIsGeneratingTestCases] = useState(false);

    // Load existing problem data when editing
    useEffect(() => {
        if (existingProblem?.data) {
            // Merge with defaults to ensure all fields exist
            setFormData({
                id: existingProblem.data.id || "",
                title: existingProblem.data.title || "",
                difficulty: existingProblem.data.difficulty || "Easy",
                category: existingProblem.data.category || "",
                description: {
                    text: existingProblem.data.description?.text || "",
                    notes: existingProblem.data.description?.notes || [],
                },
                examples: existingProblem.data.examples || [],
                constraints: existingProblem.data.constraints || [],
                starterCode: {
                    javascript: existingProblem.data.starterCode?.javascript || "",
                    python: existingProblem.data.starterCode?.python || "",
                    java: existingProblem.data.starterCode?.java || "",
                },
                expectedOutput: {
                    javascript: existingProblem.data.expectedOutput?.javascript || "",
                    python: existingProblem.data.expectedOutput?.python || "",
                    java: existingProblem.data.expectedOutput?.java || "",
                },
                testCases: existingProblem.data.testCases || [],
                timeLimit: existingProblem.data.timeLimit || 2000,
                memoryLimit: existingProblem.data.memoryLimit || 256,
            });
        }
    }, [existingProblem]);

    // Debug logging
    useEffect(() => {
        console.log("=== AdminProblemForm Debug ===");
        console.log("Form Data:", formData);
        console.log("Description:", formData.description);
        console.log("Starter Code:", formData.starterCode);
        console.log("Expected Output:", formData.expectedOutput);
        console.log("Test Cases:", formData.testCases);
        console.log("Is Editing:", isEditing);
        console.log("Existing Problem:", existingProblem);
        console.log("============================");
    }, [formData, isEditing, existingProblem]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📝 Submitting form...");
        console.log("Form Data to submit:", formData);

        if (isEditing) {
            console.log("✏️ Updating existing problem:", id);
            updateMutation.mutate(
                { id, data: formData },
                {
                    onSuccess: () => {
                        console.log("✅ Problem updated successfully");
                        navigate("/admin/problems");
                    },
                    onError: (error) => {
                        console.error("❌ Update error:", error);
                    },
                }
            );
        } else {
            console.log("➕ Creating new problem");
            createMutation.mutate(formData, {
                onSuccess: () => {
                    console.log("✅ Problem created successfully");
                    navigate("/admin/problems");
                },
                onError: (error) => {
                    console.error("❌ Create error:", error);
                },
            });
        }
    };

    // AI Generation handler
    const handleGenerateWithAI = async () => {
        console.log("🤖 Starting AI generation...");
        if (!aiPrompt.trim()) {
            toast.error("Please enter a prompt");
            return;
        }

        setIsGenerating(true);
        try {
            console.log("📤 Sending prompt to AI:", aiPrompt);
            const response = await generateProblemWithAI(aiPrompt);
            console.log("📥 AI Response received:", response);
            const generatedProblem = response.data;
            console.log("✅ Generated Problem Data:", generatedProblem);

            // Merge with safe defaults to ensure all fields exist
            const safeFormData = {
                id: generatedProblem.id || "",
                title: generatedProblem.title || "",
                difficulty: generatedProblem.difficulty || "Easy",
                category: generatedProblem.category || "",
                description: {
                    text: generatedProblem.description?.text || "",
                    notes: generatedProblem.description?.notes || [],
                },
                examples: generatedProblem.examples || [],
                constraints: generatedProblem.constraints || [],
                starterCode: {
                    javascript: generatedProblem.starterCode?.javascript || "",
                    python: generatedProblem.starterCode?.python || "",
                    java: generatedProblem.starterCode?.java || "",
                },
                expectedOutput: {
                    javascript: generatedProblem.expectedOutput?.javascript || "",
                    python: generatedProblem.expectedOutput?.python || "",
                    java: generatedProblem.expectedOutput?.java || "",
                },
                testCases: generatedProblem.testCases || [],
                timeLimit: generatedProblem.timeLimit || 2000,
                memoryLimit: generatedProblem.memoryLimit || 256,
            };

            console.log("🔒 Safe Form Data (with defaults):", safeFormData);

            // Populate form with AI-generated data
            setFormData(safeFormData);

            toast.success("Problem generated successfully! Review and save.");
            setShowAIModal(false);
            setAiPrompt("");
        } catch (error) {
            console.error("❌ AI generation error:", error);
            console.error("Error details:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to generate problem with AI");
        } finally {
            setIsGenerating(false);
            console.log("🏁 AI generation complete");
        }
    };

    // Test case generation handler
    const handleGenerateTestCases = async () => {
        console.log("🧪 Starting test case generation...");
        if (!formData.title || !formData.description.text) {
            toast.error("Please fill in title and description first");
            return;
        }

        setIsGeneratingTestCases(true);
        try {
            console.log("📤 Generating test cases for:", formData.title);
            const response = await generateTestCasesWithAI(
                formData.title,
                formData.description.text,
                5
            );
            console.log("📥 Test cases response:", response);
            const generatedTestCases = response.data;
            console.log("✅ Generated Test Cases:", generatedTestCases);

            // Add generated test cases to form
            setFormData((prev) => ({
                ...prev,
                testCases: generatedTestCases,
            }));

            toast.success(`Generated ${generatedTestCases.length} test cases!`);
        } catch (error) {
            console.error("❌ Test case generation error:", error);
            console.error("Error details:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to generate test cases");
        } finally {
            setIsGeneratingTestCases(false);
            console.log("🏁 Test case generation complete");
        }
    };

    // Helper functions for dynamic fields
    const addConstraint = () => {
        setFormData({
            ...formData,
            constraints: [...formData.constraints, ""],
        });
    };

    const updateConstraint = (index, value) => {
        const newConstraints = [...formData.constraints];
        newConstraints[index] = value;
        setFormData({ ...formData, constraints: newConstraints });
    };

    const removeConstraint = (index) => {
        setFormData({
            ...formData,
            constraints: formData.constraints.filter((_, i) => i !== index),
        });
    };

    const addExample = () => {
        setFormData({
            ...formData,
            examples: [...formData.examples, { input: "", output: "", explanation: "" }],
        });
    };

    const updateExample = (index, field, value) => {
        const newExamples = [...formData.examples];
        newExamples[index][field] = value;
        setFormData({ ...formData, examples: newExamples });
    };

    const removeExample = (index) => {
        setFormData({
            ...formData,
            examples: formData.examples.filter((_, i) => i !== index),
        });
    };

    if (isEditing && loadingProblem) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isEditing ? "Edit Problem" : "Create New Problem"}
                    </h1>
                    <p className="text-base-content/70">
                        {isEditing ? `Editing: ${formData.title}` : "Add a new coding problem"}
                    </p>
                </div>

                {/* AI Generation Button */}
                {!isEditing && (
                    <button
                        type="button"
                        className="btn btn-primary gap-2"
                        onClick={() => setShowAIModal(true)}
                    >
                        <Sparkles size={18} />
                        Generate with AI
                    </button>
                )}
            </div>

            {/* AI Generation Modal */}
            {showAIModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                            <Sparkles className="text-primary" size={24} />
                            Generate Problem with AI
                        </h3>

                        <div className="space-y-4">
                            <div className="alert alert-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm">
                                    Describe the problem you want to create. AI will generate the complete problem with examples, constraints, and starter code!
                                </span>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Problem Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Example: Create a medium difficulty problem about finding the longest substring without repeating characters in an array"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    disabled={isGenerating}
                                />
                            </div>

                            <div className="text-sm text-base-content/70">
                                <p className="font-semibold mb-1">Example prompts:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>"Create a hard problem about binary tree traversal"</li>
                                    <li>"Easy array problem about finding duplicates"</li>
                                    <li>"Medium difficulty dynamic programming problem"</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowAIModal(false);
                                    setAiPrompt("");
                                }}
                                disabled={isGenerating}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary gap-2"
                                onClick={handleGenerateWithAI}
                                disabled={isGenerating || !aiPrompt.trim()}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => !isGenerating && setShowAIModal(false)}></div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Problem ID</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., two-sum (auto-generated from title)"
                                    className="input input-bordered"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    required
                                    disabled={isEditing}
                                />
                                <label className="label">
                                    <span className="label-text-alt">Auto-filled from title, use lowercase with hyphens</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Two Sum"
                                    className="input input-bordered"
                                    value={formData.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        setFormData({
                                            ...formData,
                                            title,
                                            id: isEditing ? formData.id : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                                        });
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Difficulty</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    required
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Array • Hash Table"
                                    className="input input-bordered"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-32"
                                placeholder="Problem description..."
                                value={formData.description.text}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: { ...formData.description, text: e.target.value },
                                    })
                                }
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Constraints */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Constraints</h2>
                            <button type="button" className="btn btn-sm btn-primary" onClick={addConstraint}>
                                <Plus size={16} /> Add Constraint
                            </button>
                        </div>

                        {formData.constraints.length === 0 ? (
                            <p className="text-base-content/50 text-sm">No constraints added yet</p>
                        ) : (
                            <div className="space-y-2">
                                {formData.constraints.map((constraint, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            placeholder="e.g., 1 <= nums.length <= 10^4"
                                            value={constraint}
                                            onChange={(e) => updateConstraint(index, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-error btn-sm"
                                            onClick={() => removeConstraint(index)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Examples */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">Examples</h2>
                            <button type="button" className="btn btn-sm btn-primary" onClick={addExample}>
                                <Plus size={16} /> Add Example
                            </button>
                        </div>

                        {formData.examples.length === 0 ? (
                            <p className="text-base-content/50 text-sm">No examples added yet</p>
                        ) : (
                            <div className="space-y-4">
                                {formData.examples.map((example, index) => (
                                    <div key={index} className="border border-base-300 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">Example {index + 1}</h3>
                                            <button
                                                type="button"
                                                className="btn btn-error btn-sm"
                                                onClick={() => removeExample(index)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="input input-bordered w-full"
                                                placeholder="Input (e.g., nums = [2,7,11,15], target = 9)"
                                                value={example.input}
                                                onChange={(e) => updateExample(index, "input", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="input input-bordered w-full"
                                                placeholder="Output (e.g., [0,1])"
                                                value={example.output}
                                                onChange={(e) => updateExample(index, "output", e.target.value)}
                                            />
                                            <textarea
                                                className="textarea textarea-bordered w-full"
                                                placeholder="Explanation (optional)"
                                                value={example.explanation}
                                                onChange={(e) => updateExample(index, "explanation", e.target.value)}
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Starter Code */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Starter Code</h2>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">JavaScript</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-32"
                                    placeholder="function twoSum(nums, target) {&#10;  // Write your solution here&#10;}"
                                    value={formData.starterCode.javascript}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            starterCode: { ...formData.starterCode, javascript: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Python</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-32"
                                    placeholder="def two_sum(nums, target):&#10;    # Write your solution here&#10;    pass"
                                    value={formData.starterCode.python}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            starterCode: { ...formData.starterCode, python: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Java</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-32"
                                    placeholder="class Solution {&#10;    public int[] twoSum(int[] nums, int target) {&#10;        // Write your solution here&#10;    }&#10;}"
                                    value={formData.starterCode.java}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            starterCode: { ...formData.starterCode, java: e.target.value },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expected Output (for testing) */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Expected Output (for test validation)</h2>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">JavaScript Expected Output</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-24"
                                    placeholder="[0, 1]&#10;[1, 2]&#10;[0, 1]"
                                    value={formData.expectedOutput.javascript}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            expectedOutput: { ...formData.expectedOutput, javascript: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Python Expected Output</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-24"
                                    placeholder="[0, 1]&#10;[1, 2]&#10;[0, 1]"
                                    value={formData.expectedOutput.python}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            expectedOutput: { ...formData.expectedOutput, python: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Java Expected Output</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered font-mono text-sm h-24"
                                    placeholder="[0, 1]&#10;[1, 2]&#10;[0, 1]"
                                    value={formData.expectedOutput.java}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            expectedOutput: { ...formData.expectedOutput, java: e.target.value },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        {createMutation.isPending || updateMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <Save size={18} />
                                {isEditing ? "Update Problem" : "Create Problem"}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate("/admin/problems")}
                    >
                        <X size={18} />
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
