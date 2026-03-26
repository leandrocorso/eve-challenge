import {
  ArrowBack,
  YouTube,
  Article,
  RocketLaunch,
  Place,
} from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Chip,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Divider,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  useLaunch,
  useRocket,
  useLaunchpad,
} from "@/features/launches/hooks/useLaunch";

export const LaunchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: launch, isLoading: loadingLaunch } = useLaunch(id);

  const { data: rocket, isLoading: loadingRocket } = useRocket(launch?.rocket);
  const { data: launchpad, isLoading: loadingPad } = useLaunchpad(
    launch?.launchpad,
  );

  const isLoading = loadingLaunch || loadingRocket || loadingPad;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!launch) return <Alert severity="info">Lançamento não encontrado.</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }} textAlign="center">
            <Box
              component="img"
              src={launch.links.patch.large || launch.links.patch.small}
              sx={{ width: "100%", maxWidth: 300, mb: 2 }}
            />
            <Stack direction="row" justifyContent="center" spacing={1}>
              <Chip
                label={
                  launch.success
                    ? "Sucesso"
                    : launch.upcoming
                      ? "Upcoming"
                      : "Falha"
                }
                color={
                  launch.success
                    ? "success"
                    : launch.upcoming
                      ? "info"
                      : "error"
                }
              />
              <Chip label={`Voo #${launch.flight_number}`} variant="outlined" />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {launch.name}
            </Typography>

            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <RocketLaunch color="action" />
                <Typography>{rocket?.name || "Carregando..."}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Place color="action" />
                <Typography>{launchpad?.name || "Carregando..."}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" color="text.secondary" paragraph>
              {launch.details || "Sem detalhes adicionais disponíveis."}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              {launch.links.webcast && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<YouTube />}
                  href={launch.links.webcast}
                  target="_blank"
                >
                  Webcast
                </Button>
              )}
              {launch.links.wikipedia && (
                <Button
                  variant="outlined"
                  startIcon={<Article />}
                  href={launch.links.wikipedia}
                  target="_blank"
                >
                  Wikipedia
                </Button>
              )}
            </Stack>
          </Grid>

          {/* Galeria de Fotos */}
          {launch.links.flickr.original.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" gutterBottom>
                Galeria
              </Typography>
              <ImageList cols={3} gap={16}>
                {launch.links.flickr.original.map((img: string, i: number) => (
                  <ImageListItem
                    key={i}
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                  >
                    <img src={img} alt="Mission" loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
