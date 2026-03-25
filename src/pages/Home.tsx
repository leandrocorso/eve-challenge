import {
  Container,
  Grid,
  Typography,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

import { FiltersBar } from "@/features/launches/components/FilterBar";
import { LaunchCard } from "@/features/launches/components/LaunchCard";
import { useLaunches } from "@/features/launches/hooks/useLaunches";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [upcoming, setUpcoming] = useState("all");

  const { data, isLoading, isError } = useLaunches(
    page,
    search,
    // status,
    // upcoming,
  );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Lançamentos SpaceX
      </Typography>

      <FiltersBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        upcoming={upcoming}
        onUpcomingChange={(val) => {
          setUpcoming(val);
          setPage(1);
        }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error">Erro ao carregar dados.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {data.docs.map((launch: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={launch.id}>
                <LaunchCard
                  name={launch.name}
                  date_utc={launch.date_utc}
                  success={launch.success}
                  upcoming={launch.upcoming}
                  rocketName={launch.rocket?.name || "N/A"}
                  launchpadName={launch.launchpad?.name || "N/A"}
                  patchUrl={launch.links.patch.small}
                />
              </Grid>
            ))}
          </Grid>

          {/* Paginação (Requisito 147) */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={data.totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};
