export interface LaunchCardProps {
  name: string;
  date_utc: string;
  success: boolean | null;
  upcoming: boolean;
  rocketName: string;
  launchpadName: string;
  patchUrl: string | null;
}
