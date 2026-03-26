import {
  Container,
  Grid,
  Typography,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";

import { FiltersBar } from "@/features/launches/components/FilterBar";
import { LaunchCard } from "@/features/launches/components/LaunchCard";
import {
  type LaunchProps,
  type LaunchFilters,
} from "@/features/launches/hooks/LaunchProps";
import { useLaunches } from "@/features/launches/hooks/useLaunches";
import { useLaunchFilters } from "@/features/launches/hooks/useLaunchesFilters";

export const Home = () => {
  const {
    searchTerm,
    setSearchTerm,
    setFilters,
    activeFilters,
    page,
    setPage,
  } = useLaunchFilters();

  const handleChangeFilter = (param: Partial<LaunchFilters>) => {
    setFilters((prev) => ({ ...prev, ...param }));
    setPage(1);
  };

  const { data, isLoading, isError } = useLaunches(page, activeFilters);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Lançamentos SpaceX
      </Typography>

      <FiltersBar
        search={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
        status={activeFilters.status}
        onStatusChange={(val) =>
          handleChangeFilter({ status: val as LaunchFilters["status"] })
        }
        upcoming={activeFilters.upcoming}
        onUpcomingChange={(val) =>
          handleChangeFilter({ upcoming: val as LaunchFilters["upcoming"] })
        }
        dateFrom={activeFilters.dateFrom}
        onDateFromChange={(val) =>
          handleChangeFilter({ dateFrom: val as LaunchFilters["dateFrom"] })
        }
        dateTo={activeFilters.dateTo}
        onDateToChange={(val) =>
          handleChangeFilter({ dateTo: val as LaunchFilters["dateTo"] })
        }
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
            {data.docs.map((launch: LaunchProps) => (
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
