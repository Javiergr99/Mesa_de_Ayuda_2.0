import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAttentions, updateAttention } from "@/features/attentions/api/attentions.service";

export const attentionKeys = {
  all: ["attentions"] as const,
};

export function useAttentions() {
  return useQuery({ queryKey: attentionKeys.all, queryFn: getAttentions });
}

export function useUpdateAttention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttention,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attentionKeys.all });
    },
  });
}
