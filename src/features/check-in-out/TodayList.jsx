import { useTodayActivity } from "./useTodayActivity";

import styled from "styled-components";

import Spinner from "../../ui/Spinner";
import TodayItem from "./TodayItem";

const StyledTodayList = styled.ul`
  overflow: scroll;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function TodayList() {
  const { recentStays, isLoading } = useTodayActivity();

  if (isLoading) return <Spinner />;

  return (
    <StyledTodayList>
      {recentStays.length !== 0 ? (
        recentStays.map((stay) => <TodayItem key={stay.id} recentStay={stay} />)
      ) : (
        <NoActivity>No activity today</NoActivity>
      )}
    </StyledTodayList>
  );
}

export default TodayList;
