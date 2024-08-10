import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

import { logout } from "../../services/apiAuth";

import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";

function Logout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // remove all cached data  
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      toast.success("Log out successfully");
    },
    onError: () => {
      toast.error("Somthing went wrong!");
    },
  });

  return (
    <ButtonIcon onClick={mutate} disabled={isLoading}>
      {!isLoading ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
