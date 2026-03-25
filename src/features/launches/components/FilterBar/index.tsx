import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  type SelectChangeEvent,
} from "@mui/material";

import type { FiltersBarProps } from "./FilterBarProps";

export const FiltersBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  upcoming,
  onUpcomingChange,
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
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          fullWidth
          label="Buscar por nome"
          variant="outlined"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ex: Falcon, Starlink..."
        />

        <FormControl fullWidth>
          <InputLabel>Sucesso</InputLabel>
          <Select
            value={status}
            label="Sucesso"
            onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="success">Sucesso</MenuItem>
            <MenuItem value="failed">Falha</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Tipo</InputLabel>
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
      </Stack>
    </Box>
  );
};
