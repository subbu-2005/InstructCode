import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitCode, getUserSubmissions } from "../api/submissions";
import toast from "react-hot-toast";

/**
 * Hook to submit code
 */
export const useSubmitCode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ problemId, code, language }) =>
            submitCode(problemId, { code, language }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["submissions"] });

            if (data.data.status === "Accepted") {
                toast.success(`✅ All tests passed! +${data.data.pointsEarned} points`);
            } else {
                toast.error(`❌ ${data.data.status}: ${data.data.passedTests}/${data.data.totalTests} tests passed`);
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit code");
        },
    });
};

/**
 * Hook to get user submissions for a problem
 */
export const useUserSubmissions = (problemId) => {
    return useQuery({
        queryKey: ["submissions", problemId],
        queryFn: () => getUserSubmissions(problemId),
        enabled: !!problemId,
    });
};
