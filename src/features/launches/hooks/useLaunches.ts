import { useQuery } from "@tanstack/react-query";

import type { LaunchStatus, LaunchUpcoming } from "./LaunchProps";

export interface QueryObjProps {
  name?: { $regex: string; $options: "i" };
  success?: boolean;
  upcoming?: boolean;
  date_utc?: { $gte?: string; $lte?: string };
}

export const useLaunches = (
  page: number,
  search: string,
  status: LaunchStatus,
  upcoming: LaunchUpcoming,
  dateFrom: string,
  dateTo: string,
) => {
  return useQuery({
    queryKey: ["launches", page, search, status, upcoming, dateFrom, dateTo],
    queryFn: async ({ signal }) => {
      const queryObj: QueryObjProps = {};

      if (search) queryObj.name = { $regex: search, $options: "i" };
      if (status !== "all") queryObj.success = status === "success";
      if (upcoming !== "all") queryObj.upcoming = upcoming === "upcoming";

      if (dateFrom || dateTo) {
        queryObj.date_utc = {};
        if (dateFrom) {
          queryObj.date_utc.$gte = `${dateFrom}T00:00:00.000Z`;
        }
        if (dateTo) {
          queryObj.date_utc.$lte = `${dateTo}T23:59:59.999Z`;
        }
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
              sort: { date_utc: "asc" },
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
