import { Link } from "react-router-dom";

import styled from "styled-components";

import Button from "../../ui/Button";
import { Flag } from "../../ui/Flag";
import Tag from "../../ui/Tag";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({
  recentStay: {
    id,
    status,
    numNights,
    guests: { fullName, countryFlag, nationality },
  },
}) {
  const isArriving = status === "unconfirmed";

  return (
    <StyledTodayItem>
      <Tag type={isArriving ? "green" : "blue"}>
        {isArriving ? "Arriving" : "Departing"}
      </Tag>

      <Flag src={countryFlag} alt={`Flag of ${nationality}`} />

      <Guest>{fullName}</Guest>

      <div>{numNights} nights</div>

      {/* Button will receive all props of Link */}
      {isArriving ? (
        <Button $size="small" as={Link} to={`/checkin/${id}`}>Check in</Button>
      ) : (
        <CheckoutButton bookingId={id} />
      )}
    </StyledTodayItem>
  );
}

export default TodayItem;
