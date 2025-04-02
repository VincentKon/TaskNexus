import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["log-out"]["$post"]
>;

export const useLogOut = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      try {
        const response = await client.api.auth["log-out"]["$post"]();
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "Unexpected error occurred");
        }
        return await response.json();
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully.");
      queryClient.invalidateQueries({ queryKey: ["current"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  return mutation;
};
