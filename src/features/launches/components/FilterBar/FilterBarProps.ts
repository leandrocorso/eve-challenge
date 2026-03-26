/* eslint-disable */
import type { Dayjs } from "dayjs";

export interface FiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  upcoming: string;
  onUpcomingChange: (value: string) => void;
  dateFrom: Dayjs | null;
  onDateFromChange: (date: Dayjs | null) => void;
  dateTo: Dayjs | null;
  onDateToChange: (date: Dayjs | null) => void;
}
