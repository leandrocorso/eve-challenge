import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import type { FiltersBarProps } from "./FilterBarProps";

export const FiltersBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  upcoming,
  onUpcomingChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: FiltersBarProps) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Buscar por nome"
            variant="outlined"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ex: Falcon, Starlink..."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Sucesso"
              onChange={(e: SelectChangeEvent) =>
                onStatusChange(e.target.value)
              }
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="success">Sucesso</MenuItem>
              <MenuItem value="failed">Falha</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Lançamentos</InputLabel>
            <Select
              value={upcoming}
              label="Tipo"
              onChange={(e: SelectChangeEvent) =>
                onUpcomingChange(e.target.value)
              }
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="upcoming">Próximos</MenuItem>
              <MenuItem value="past">Passados</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <DatePicker
            label="Data início"
            value={dateFrom}
            onChange={onDateFromChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <DatePicker
            label="Data fim"
            value={dateTo}
            onChange={onDateToChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
