/* eslint-disable */
import type { Dayjs } from "dayjs";
import type { DateFrom, DateTo } from "../../hooks/LaunchProps";

export interface FiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  upcoming: string;
  onUpcomingChange: (value: string) => void;
  dateFrom: DateFrom;
  onDateFromChange: (date: Dayjs | null) => void;
  dateTo: DateTo;
  onDateToChange: (date: Dayjs | null) => void;
}
