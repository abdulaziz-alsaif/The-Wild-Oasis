import { useForm } from "react-hook-form";
import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const { updateUser, isUpdating } = useUpdateUser();

  const { register, handleSubmit, reset } = useForm();

  function onSubmit(data) {
    const avatar = data.avatar.length === 0 ? null : data.avatar[0];
    updateUser(
      { fullName: data.fullName, avatar },
      {
        onSuccess: reset,
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          id="fullName"
          disabled={isUpdating}
          defaultValue={currentFullName}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdating}
          {...register("avatar")}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" $variation="secondary" disabled={isUpdating}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
