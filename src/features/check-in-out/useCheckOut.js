import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";

function useCheckOut() {
  const queryClient = useQueryClient();
  const {
    mutate: checkOut,
    isLoading: isCheckingOut,
    error,
  } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (newData) => {
      toast.success(`Booking #${newData.id} successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => {
      toast.error("There was an error while checking out");
    },
  });

  return { checkOut, isCheckingOut, error };
}

export default useCheckOut;
