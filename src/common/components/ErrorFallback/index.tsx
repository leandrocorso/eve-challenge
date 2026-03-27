import { Box, Typography, Button } from "@mui/material";
import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const errorMessage = (error as Error).message;

  return (
    <Box
      sx={{ p: 4, textAlign: "center", bgcolor: "#fff5f5", borderRadius: 2 }}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Algo deu errado:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {errorMessage}
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary}>
        Tentar novamente
      </Button>
    </Box>
  );
};
