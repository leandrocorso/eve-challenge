import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="center" py={10}>
      <CircularProgress />
    </Box>
  );
};
