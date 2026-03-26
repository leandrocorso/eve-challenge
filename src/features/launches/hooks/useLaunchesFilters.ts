import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

import type { LaunchFilters } from "./LaunchProps";

export const useLaunchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState<LaunchFilters>({
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as LaunchFilters["status"]) || "all",
    upcoming:
      (searchParams.get("upcoming") as LaunchFilters["upcoming"]) || "all",
    dateFrom: dayjs(searchParams.get("from")),
    dateTo: dayjs(searchParams.get("to")),
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.upcoming !== "all") params.set("upcoming", filters.upcoming);

    if (filters.dateFrom && filters.dateFrom.isValid()) {
      params.set("from", filters.dateFrom.format("YYYY-MM-DD"));
    }

    if (filters.dateTo && filters.dateTo.isValid()) {
      params.set("to", filters.dateTo.format("YYYY-MM-DD"));
    }

    if (page > 1) params.set("page", String(page));

    setSearchParams(params);
  }, [debouncedSearch, filters, page, setSearchParams]);

  return {
    searchTerm,
    setSearchTerm,
    activeFilters: { ...filters, search: debouncedSearch },
    setFilters,
    page,
    setPage,
  };
};
