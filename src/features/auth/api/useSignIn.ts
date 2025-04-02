import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      try {
        const response = await client.api.auth["sign-in"]["$post"]({ json });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "Invalid credentials");
        }

        return await response.json();
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unexpected error occurred"
        );
      }
    },
    onSuccess: () => {
      toast.success("Signed in successfully.");
      queryClient.invalidateQueries({ queryKey: ["current"] });

      setTimeout(() => {
        router.refresh();
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Sign-in failed: ${error.message}`);
    },
  });

  return mutation;
};
