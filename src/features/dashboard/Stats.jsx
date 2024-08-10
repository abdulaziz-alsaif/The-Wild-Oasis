import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";

import Stat from "./Stat";

import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confiremedStays, numDays, numCabins }) {
  const numBookings = bookings.length;

  const sales = bookings.reduce((acc, cur) => cur.totalPrice + acc, 0);

  // Total number of guests visit the hotel which should include checked-in + checked-out
  const checkIns = confiremedStays.length;

  // Occupancy rate = nights have been occupied by guests divided to the total number of nights available in all cabins (num of cabins * num of filtered days)
  const occupation =
    confiremedStays.reduce((acc, cur) => acc + cur.numNights, 0) /
    (numDays * numCabins);

  return (
    <>
      <Stat
        title={"bookings"}
        value={numBookings}
        color="blue"
        icon={<HiOutlineBriefcase />}
      />
      <Stat
        title={"sales"}
        value={formatCurrency(sales)}
        color="green"
        icon={<HiOutlineBanknotes />}
      />
      <Stat
        title={"check ins"}
        value={checkIns}
        color="indigo"
        icon={<HiOutlineCalendarDays />}
      />
      <Stat
        title={"occupancy rate"}
        value={Math.round(occupation * 100) + "%"}
        color="blue"
        icon={<HiOutlineChartBar />}
      />
    </>
  );
}

export default Stats;
