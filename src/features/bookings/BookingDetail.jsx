import { useNavigate, useParams } from "react-router-dom";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import { useDeleteBooking } from "./useDeleteBooking";

import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import CheckoutButton from "../check-in-out/CheckoutButton";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { bookingId } = useParams();
  const { booking, isLoading } = useBooking(bookingId);

  const navigate = useNavigate();

  const { deleteBooking, isDeleting } = useDeleteBooking();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if(!booking) return <Empty resource="booking" />

  const { status } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        {status === "checked-in" && (
          <CheckoutButton bookingId={bookingId}>Check out</CheckoutButton>
        )}

        <Modal>
          <Modal.Open opens="confirm-delete">
            <Button
              $variation="danger"
              onClick={() => deleteBooking(bookingId)}
            >
              Delete booking
            </Button>
          </Modal.Open>

          <Modal.Window name="confirm-delete">
            <ConfirmDelete
              resourceName={`Booking #${bookingId}`}
              onConfirm={() =>
                deleteBooking(bookingId, {
                  onSettled: () => navigate(-1),
                })
              }
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
