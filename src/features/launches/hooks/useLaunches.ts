import { useQuery } from "@tanstack/react-query";

export const useLaunches = (page: number, filters: any) => {
  return useQuery({
    queryKey: ["launches", page, filters],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/launches/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: {},
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
