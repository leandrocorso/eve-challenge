import { RocketLaunch, Place } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Stack,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";

import type { LaunchProps } from "../../hooks/LaunchProps";

export const LaunchCard = ({
  id,
  name,
  date_utc,
  success,
  upcoming,
  rocket,
  launchpad,
  links,
}: LaunchProps) => {
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
      <CardActionArea component={Link} to={`/launch/${id}`}>
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
            image={
              links.patch.small ||
              links.flickr.original?.[0] ||
              "https://placehold.co/120?text=Sem%20imagem"
            }
            alt={`Patch da missão ${name}`}
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

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <RocketLaunch fontSize="inherit" color="action" />
              <Typography variant="body2">{rocket.name}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Place fontSize="inherit" color="action" />
              <Typography variant="body2" color="text.secondary">
                {launchpad.name}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
