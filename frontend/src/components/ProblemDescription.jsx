import { getDifficultyBadgeClass } from "../lib/utils";
import { Bookmark, BookmarkCheck, Lightbulb, MessageSquare } from "lucide-react";

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
  isBookmarked,
  onToggleBookmark,
  // AI props
  onGetHint,
  onGetCodeReview,
  hintLevel,
  onHintLevelChange,
  currentHint,
  codeReview,
  isGettingHint,
  isReviewingCode,
  hasCode,
}) {
  return (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* HEADER SECTION */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            {/* Bookmark Button */}
            <button
              onClick={onToggleBookmark}
              className={`btn btn-sm btn-circle ${isBookmarked ? 'btn-primary' : 'btn-ghost'}`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this problem"}
            >
              {isBookmarked ? (
                <BookmarkCheck size={18} />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>
        <p className="text-base-content/60">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="select select-sm w-full"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold text-base-content">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-base-content/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-base-content/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <p className="font-semibold text-base-content">Example {idx + 1}</p>
                </div>
                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2">
                      <span className="text-base-content/60 font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
          <ul className="space-y-2 text-base-content/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* AI HELPER SECTION */}
        {onGetHint && (
          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300 space-y-2">
            <h2 className="text-xl font-bold mb-3 text-base-content">AI Helper</h2>

            <div className="flex gap-2">
              <button
                onClick={onGetHint}
                disabled={isGettingHint}
                className="btn btn-sm btn-outline flex-1 gap-2"
              >
                <Lightbulb size={16} />
                {isGettingHint ? "Getting Hint..." : `Get Hint (Level ${hintLevel})`}
              </button>
              <select
                className="select select-sm w-20"
                value={hintLevel}
                onChange={(e) => onHintLevelChange(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <button
              onClick={onGetCodeReview}
              disabled={isReviewingCode || !hasCode}
              className="btn btn-sm btn-outline w-full gap-2"
            >
              <MessageSquare size={16} />
              {isReviewingCode ? "Reviewing..." : "Review My Code"}
            </button>

            {/* Display Hint */}
            {currentHint && (
              <div className="alert alert-info text-sm">
                <Lightbulb size={16} />
                <span>{currentHint}</span>
              </div>
            )}

            {/* Display Code Review */}
            {codeReview && (
              <div className="space-y-2 text-sm">
                <div className="alert alert-success">
                  <span>Score: {codeReview.overallScore}/10</span>
                </div>
                <div className="bg-base-200 p-3 rounded space-y-1">
                  <p><strong>Time:</strong> {codeReview.timeComplexity}</p>
                  <p><strong>Space:</strong> {codeReview.spaceComplexity}</p>
                  {codeReview.improvements?.length > 0 && (
                    <div className="mt-2">
                      <strong>Improvements:</strong>
                      <ul className="list-disc list-inside">
                        {codeReview.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;
