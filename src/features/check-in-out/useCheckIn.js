import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router-dom";

export function useCheckIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkIn, isLoading: isCheckingIn, error } = useMutation({
    mutationFn: ({bookingId, breakfast = {}}) => updateBooking(bookingId, {
        isPaid: true,
        status: "checked-in",
        ...breakfast
    }),
    onSuccess: (newData) => {
      toast.success(`Booking #${newData.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate("/")
    },
    onError: () => {
      toast.success("There was an error while checking in");
    },
  });

  return { checkIn, isCheckingIn, error };
}
