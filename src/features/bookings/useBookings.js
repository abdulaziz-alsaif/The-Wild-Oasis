import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Filter
  const filterValue = searchParams.get("status");
  const filter =
    filterValue && filterValue !== "all"
      ? { field: "status", value: filterValue }
      : null;

  // sort by
  const sortByValue = searchParams.get("sortBy") || "startDate-desc";

  const [field, direction] = sortByValue.split("-");
  const sortBy = sortByValue ? { field, value: direction } : null;

  // Pagination
  const currentPage = Number(searchParams.get("page") || 1);

  // Query
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, currentPage],
    queryFn: () => getBookings({ filter, sortBy, page: currentPage }),
  });

  // Pre-Fetching next page
  const pageCount = Math.ceil(count / PAGE_SIZE)

  if(currentPage < pageCount)
  queryClient.prefetchQuery({
    queryKey: ["bookings", filter, sortBy, currentPage + 1],
    queryFn: () => getBookings({ filter, sortBy, page: currentPage + 1  }),
  })

  // Pre-Fetching prev page

  if(currentPage > 1)
  queryClient.prefetchQuery({
    queryKey: ["bookings", filter, sortBy, currentPage - 1],
    queryFn: () => getBookings({ filter, sortBy, page: currentPage - 1 }),
  })

  return { isLoading, bookings, count, error };
}
