import { useMutation, useQuery } from "@tanstack/react-query";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { getSettings, updateSetting } from "../../services/apiSettings";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";

function UpdateSettingsForm() {
  const {
    data: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerNight,
      breakfastPrice,
    } = {},
    isLoading,
  } = useQuery({
    queryFn: getSettings,
    queryKey: ["settings"],
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: (newSettings) => updateSetting(newSettings),
    onSuccess: () => {
      toast.success("Settings updated successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleUpdateSetting(e) {
    const { value, id, defaultValue } = e.target;
 
    if (!value.trim() || !id || defaultValue === value) return;
    mutate({ [id]: value });
    e.target.defaultValue = value;
  }

  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="minBookingLength"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={handleUpdateSetting}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="maxBookingLength"
          defaultValue={maxBookingLength}
          onBlur={handleUpdateSetting}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="maxGuestsPerNight"
          defaultValue={maxGuestsPerNight}
          onBlur={handleUpdateSetting}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfastPrice"
          defaultValue={breakfastPrice}
          onBlur={handleUpdateSetting}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
