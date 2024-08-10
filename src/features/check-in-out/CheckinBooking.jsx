import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useCheckIn } from "./useCheckIn";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../../features/bookings/useBooking";

import styled from "styled-components";

import { formatCurrency } from "../../utils/helpers";

import BookingDataBox from "../../features/bookings/BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { useSettings } from "../settings/useSettings";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const { bookingId } = useParams();
  const { booking, isLoading } = useBooking(bookingId);

  const { checkIn, isCheckingIn } = useCheckIn();

  const { settings, isLoading: isLoadingSettings } = useSettings();

  const moveBack = useMoveBack();

  // sync local state confirmPaid with remote state isPaid
  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking?.isPaid]);

  if (isLoading || isLoadingSettings) return <Spinner />;

  const { id, guests, totalPrice, numGuests, hasBreakfast, numNights } =
    booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numGuests * numNights;

  function handleCheckin() {
    if (!confirmPaid) return;

    let breakfast = {};

    if (addBreakfast) {
      breakfast.hasBreakfast = true;
      (breakfast.extrasPrice = optionalBreakfastPrice),
        (breakfast.totalPrice = totalPrice + optionalBreakfastPrice);
    }
    checkIn({ bookingId: id, breakfast });
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">
          Check in booking #{id} {booking.status}
        </Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((addBreakfast) => !addBreakfast);
              setConfirmPaid(false);
            }}
            disabled={isCheckingIn}
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirmPaid) => !confirmPaid)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.fullName} has paid the total amount of{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckingIn} onClick={handleCheckin}>
          Check in booking #{id}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
