import styled from "styled-components";

import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading: isLoadingBookings } = useRecentBookings();
  const {
    numDays,
    confiremedStays,
    isLoading: isLoadingStays,
  } = useRecentStays();

  const {cabins, isLoading: isLoadingCabins} = useCabins();

  if (isLoadingBookings || isLoadingStays || isLoadingCabins) return <Spinner />;


  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confiremedStays={confiremedStays}
        numDays={numDays}
        numCabins={cabins.length}
      />

      <TodayActivity />

      <DurationChart confirmedStays={confiremedStays} />

      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
