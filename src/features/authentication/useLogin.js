import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../../services/apiAuth";

export function useLogin() {
    const navigate = useNavigate();

    const { mutate: login, isLoading } = useMutation({
        mutationFn: (credentials) => loginApi(credentials),
        onSuccess: () => {
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
            console.log(err);
            toast.error("Provided email or password are incorrect")
        }
    })

    return { login, isLoading }
}

