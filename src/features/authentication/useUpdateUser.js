import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateUser as updateUserApi } from "../../services/apiAuth";



export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      toast.success("User updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateUser, isUpdating };
}
