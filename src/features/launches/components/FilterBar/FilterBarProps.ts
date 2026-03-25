export interface FiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  upcoming: string;
  onUpcomingChange: (value: string) => void;
}
