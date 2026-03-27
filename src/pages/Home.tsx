import { Container, Grid, Pagination, Box, Alert } from "@mui/material";
import { Helmet } from "react-helmet-async";

import { Header } from "@/common/components/Header";
import { Loading } from "@/common/components/Loading";
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
    <>
      <Helmet>
        <title>Lançamentos SpaceX - Home</title>
        <meta
          name="description"
          content="Bem-vindo à lista de lançamentos da SpaceX"
        />
      </Helmet>

      <Container sx={{ py: 4 }}>
        <Header />

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
          <Loading />
        ) : isError ? (
          <Alert severity="error">Erro ao carregar dados.</Alert>
        ) : !data.docs.length ? (
          <Alert severity="info">Nenhum lançamento encontrado.</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {data.docs.map((launch: LaunchProps) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={launch.id}>
                  <LaunchCard {...launch} />
                </Grid>
              ))}
            </Grid>

            {data.totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};
