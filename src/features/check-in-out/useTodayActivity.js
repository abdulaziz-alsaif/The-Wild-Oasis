import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

export function useTodayActivity() {
  const { data: recentStays, isLoading } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["todayActivity"],
  });

  return { recentStays, isLoading };
}
