import type { Dayjs } from "dayjs";

export type LaunchStatus = "success" | "failed" | "all";
export type LaunchUpcoming = "upcoming" | "past" | "all";
export type DateFrom = Dayjs | null;
export type DateTo = Dayjs | null;

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
