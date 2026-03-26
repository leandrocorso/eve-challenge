import { RocketLaunch, Place } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Stack,
} from "@mui/material";

import type { LaunchCardProps } from "./LaunchCardProps";

export const LaunchCard = ({
  name,
  date_utc,
  success,
  upcoming,
  rocketName,
  launchpadName,
  patchUrl,
}: LaunchCardProps) => {
  const getStatus = () => {
    if (upcoming) return { label: "Upcoming", color: "info" as const };
    if (success) return { label: "Success", color: "success" as const };
    return { label: "Failed", color: "error" as const };
  };

  const status = getStatus();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          bgcolor: "grey.100",
        }}
      >
        <CardMedia
          component="img"
          image={patchUrl || "https://placehold.co/150?text=Sem%20imagem"}
          alt={`Patch of ${name}`}
          sx={{ width: 120, height: 120, objectFit: "contain" }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", lineHeight: 1.2 }}
            >
              {name}
            </Typography>
            <Chip label={status.label} color={status.color} size="small" />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {new Date(date_utc).toLocaleDateString()}{" "}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <RocketLaunch fontSize="inherit" color="action" />
            <Typography variant="body2">{rocketName}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Place fontSize="inherit" color="action" />
            <Typography variant="body2" color="text.secondary">
              {launchpadName}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
