import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createEditCabin } from "../../services/apiCabins";

export function useCreateEditCabin(isEditForm = false) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ newCabin, id }) => createEditCabin(newCabin, id),
    onSuccess: () => {
      toast.success(
        isEditForm
          ? "Cabin edited successfully"
          : "New cabin created successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { mutate, isLoading };
}
