import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDarkMode } from "../../context/DarkModeContext";

import styled from "styled-components";

import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { eachDayOfInterval } from "date-fns/eachDayOfInterval";
import { subDays } from "date-fns/subDays";
import { format } from "date-fns/format";
import { isSameDay } from "date-fns/isSameDay";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ bookings, numDays }) {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  // Minus 1 here to ensure that it return array with length as same as numDays
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  // In total sales & extrasSales we filter all bookings that is same day as (date) in order to calc total Price or extras of that (date)
  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => cur.totalPrice + acc, 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => cur.extrasPrice + acc, 0),
    };
  });

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash; {format(allDates.at(-1), "MMM dd yyyy")}
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{
              fill: colors.text,
            }}
            tickLine={{
              stroke: colors.text,
            }}
          />
          <YAxis
            unit="$"
            tick={{
              fill: colors.text,
            }}
            tickLine={{
              stroke: colors.text,
            }}
          />

          <CartesianGrid strokeDasharray="4" />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background,
            }}
          />

          <Area
            dataKey="totalSales"
            name="Total sales"
            type="monotone"
            fill={colors.totalSales.fill}
            stroke={colors.totalSales.stroke}
            strokeWidth={2}
            unit={"$"}
          />

          <Area
            dataKey="extrasSales"
            name="Extras sales"
            type="monotone"
            fill={colors.extrasSales.fill}
            stroke={colors.extrasSales.stroke}
            strokeWidth={2}
            unit={"$"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
