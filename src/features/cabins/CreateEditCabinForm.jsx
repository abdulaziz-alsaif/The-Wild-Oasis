import { useForm } from "react-hook-form";

import { useCreateEditCabin } from "./useCreateEditCabin";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";
import FormRow from "../../ui/FormRow";

function CreateEditCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditForm = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: isEditForm ? editValues : {},
  });

  const { mutate, isLoading } = useCreateEditCabin(isEditForm);

  const onSubmit = (data) => {
    // in case user clicks on Edit Form. Click on choose File. But changed mind and did not select any image
    let image =
      typeof data.image === "object" && data.image.length > 0
        ? data.image[0]
        : editValues.image;

    mutate(
      { newCabin: { ...data, image: image }, id: editId },
      {
        // for reference data returned from api function is passed to onSuccess
        onSuccess: () => {
          reset(); // reset all input fields values
          onCloseModal?.();
        },
      }
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isLoading}
          {...register("name", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isLoading}
          {...register("maxCapacity", {
            required: "this field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isLoading}
          {...register("regularPrice", {
            required: "this field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isLoading}
          {...register("discount", {
            required: "this field is required",
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isLoading}
          {...register("description", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditForm ? false : "this field is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type attribute is an HTML attribute that reset all form inputs */}
        <Button
          $variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>{isEditForm ? "Edit cabin" : "Create new cabin"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateEditCabinForm;
