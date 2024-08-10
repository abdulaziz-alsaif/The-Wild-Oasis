import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {email: "becoca7336@almaxen.com", password: "passpass"}
  });

  const { login, isLoading } = useLogin()

  function onSubmit(data) {
    login(data, {
      onError: () => reset() 
    })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          disabled={isLoading}
          {...register("email", {
            required: "this field is required",
          })}
        />
      </FormRowVertical>
      <FormRowVertical label="Password" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register("password", {
            required: "this field is required",
          })}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large">{isLoading ? <SpinnerMini /> : "Login"}</Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
