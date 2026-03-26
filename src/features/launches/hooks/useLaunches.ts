import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import type { LaunchFilters, QueryObjProps } from "./LaunchProps";

export const useLaunches = (page: number, filters: LaunchFilters) => {
  return useQuery({
    queryKey: ["launches", page, filters],
    queryFn: async ({ signal }) => {
      const queryObj: QueryObjProps = {};
      const { search, status, upcoming, dateFrom, dateTo } = filters;

      if (search) queryObj.name = { $regex: search, $options: "i" };
      if (status !== "all") queryObj.success = status === "success";
      if (upcoming !== "all") queryObj.upcoming = upcoming === "upcoming";

      const dFrom = dayjs(dateFrom);
      const dTo = dayjs(dateTo);

      if (dFrom.isValid() && dTo.isValid()) {
        queryObj.date_utc = {};
        queryObj.date_utc.$gte = dFrom.startOf("day").toISOString();
        queryObj.date_utc.$lte = dTo.endOf("day").toISOString();
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/launches/query`,
        {
          signal,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryObj,
            options: {
              page,
              limit: 12,
              sort: { date_utc: "desc" },
              populate: [
                { path: "rocket", select: "name" },
                { path: "launchpad", select: ["name", "locality"] },
              ],
            },
          }),
        },
      );

      if (!response.ok) throw new Error("Erro ao buscar lançamentos");

      return response.json();
    },
  });
};
