import { useQuery } from "@tanstack/react-query";

import type { LaunchStatus, LaunchUpcoming } from "./LaunchProps";

export interface QueryObjProps {
  name?: { $regex: string; $options: "i" };
  success?: boolean;
  upcoming?: boolean;
}

export const useLaunches = (
  page: number,
  search: string,
  status: LaunchStatus,
  upcoming: LaunchUpcoming,
) => {
  return useQuery({
    queryKey: ["launches", page, search, status, upcoming],
    queryFn: async ({ signal }) => {
      const queryObj: QueryObjProps = {};

      if (search) queryObj.name = { $regex: search, $options: "i" };
      if (status !== "all") queryObj.success = status === "success";
      if (upcoming !== "all") queryObj.upcoming = upcoming === "upcoming";

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
