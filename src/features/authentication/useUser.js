import { useQuery } from "@tanstack/react-query";

import { getUser } from "../../services/apiAuth";

export function useUser() {
  const {
    data: { user } = {},
    isLoading,
    error,
  } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: false
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: user?.role === "authenticated",
  };
}
