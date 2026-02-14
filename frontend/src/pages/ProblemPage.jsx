import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useProblems, useProblem } from "../hooks/useProblems";
import { useCheckBookmark, useAddBookmark, useRemoveBookmark } from "../hooks/useBookmarks";
import { useSubmitCode } from "../hooks/useSubmissions";
import { useGetHint, useGetCodeReview } from "../hooks/useAI";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import TestResultsPanel from "../components/TestResultsPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { Bookmark, BookmarkCheck, Lightbulb, MessageSquare } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch all problems for the dropdown
  const { data: allProblemsData } = useProblems();
  const allProblems = allProblemsData?.data || [];

  // Fetch current problem
  const currentProblemId = id || "two-sum";
  const { data: problemData, isLoading } = useProblem(currentProblemId);
  const currentProblem = problemData?.data;

  // Bookmark functionality
  const { data: bookmarkData } = useCheckBookmark(currentProblemId);
  const isBookmarked = bookmarkData?.data?.isBookmarked || false;
  const addBookmarkMutation = useAddBookmark();
  const removeBookmarkMutation = useRemoveBookmark();

  // Submission functionality
  const submitCodeMutation = useSubmitCode();

  // AI functionality
  const getHintMutation = useGetHint();
  const getCodeReviewMutation = useGetCodeReview();

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [currentHint, setCurrentHint] = useState(null);
  const [codeReview, setCodeReview] = useState(null);

  // Update code when problem or language changes
  useEffect(() => {
    if (currentProblem?.starterCode) {
      setCode(currentProblem.starterCode[selectedLanguage] || "");
      setOutput(null);
      setTestResults(null);
      setCurrentHint(null);
      setCodeReview(null);
    }
  }, [currentProblem, selectedLanguage]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleProblemChange = (newProblemId) => {
    navigate(`/problem/${newProblemId}`);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setTestResults(null);

    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result);
    } catch (error) {
      setOutput({
        success: false,
        error: error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(currentProblemId);
    } else {
      addBookmarkMutation.mutate({ problemId: currentProblemId, data: {} });
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);
    setTestResults(null);

    try {
      const result = await submitCodeMutation.mutateAsync({
        problemId: currentProblemId,
        code,
        language: selectedLanguage,
      });

      // Set test results
      setTestResults(result.data);

      // Trigger confetti if all tests passed
      if (result.data.status === "Accepted") {
        triggerConfetti();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      const result = await getHintMutation.mutateAsync({
        problemId: currentProblemId,
        code,
        hintLevel,
      });
      setCurrentHint(result.data.hint);
      toast.success(`Hint level ${hintLevel} generated!`);
    } catch (error) {
      console.error("Hint error:", error);
    }
  };

  const handleGetCodeReview = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }
    try {
      const result = await getCodeReviewMutation.mutateAsync({
        problemId: currentProblemId,
        code,
        language: selectedLanguage,
      });
      setCodeReview(result.data);
    } catch (error) {
      console.error("Code review error:", error);
    }
  };

  if (isLoading || !currentProblem) {
    return (
      <div className="h-screen bg-base-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={allProblems}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              onGetHint={handleGetHint}
              onGetCodeReview={handleGetCodeReview}
              hintLevel={hintLevel}
              onHintLevelChange={setHintLevel}
              currentHint={currentHint}
              codeReview={codeReview}
              isGettingHint={getHintMutation.isPending}
              isReviewingCode={getCodeReviewMutation.isPending}
              hasCode={code.trim().length > 0}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output/Test Results Panel*/}
              <Panel defaultSize={30} minSize={30}>
                {testResults ? (
                  <TestResultsPanel
                    testResults={testResults.testResults}
                    status={testResults.status}
                    passedTests={testResults.passedTests}
                    totalTests={testResults.totalTests}
                    runtime={testResults.runtime}
                  />
                ) : (
                  <OutputPanel output={output} />
                )}
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
export default ProblemPage;
