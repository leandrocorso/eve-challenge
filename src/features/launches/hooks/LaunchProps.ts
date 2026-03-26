import type { Dayjs } from "dayjs";

export type LaunchFilters = {
  search: string;
  status: "success" | "failed" | "all";
  upcoming: "upcoming" | "past" | "all";
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
};

export interface QueryObjProps {
  name?: { $regex: string; $options: "i" };
  success?: boolean;
  upcoming?: boolean;
  date_utc?: { $gte?: string; $lte?: string };
}

export type LaunchProps = {
  id: string;
  name: string;
  date_utc: string;
  rocket: { name: string };
  launchpad: { name: string };
  success: boolean;
  upcoming: boolean;
  links: { patch: { small: string } };
};
