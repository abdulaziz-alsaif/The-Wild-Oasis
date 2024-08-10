import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const {
    mutate: deleteBooking,
    isLoading: isDeleting,
    error,
  } = useMutation({
    mutationFn: (bookingId) => deleteBookingApi(bookingId),
    onSuccess: (newData) => {
      toast.success(`Booking #${newData.id} successfully deleted`);

        // invalidate all queries that have "bookings" so even if array contain more than "bookings"
        queryClient.invalidateQueries({
            queryKey: ["bookings"]
        })
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteBooking, isDeleting, error };
}
