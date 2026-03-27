import { ArrowBack, Brightness4, Brightness7 } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useColorMode } from "@/features/colorMode/hooks/useColorMode";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleColorMode } = useColorMode();

  const isHome = location.pathname === "/";

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Lançamentos SpaceX
        </Typography>

        <Button
          variant="text"
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        >
          Modo {mode === "light" ? "Escuro" : "Claro"}
        </Button>
      </Box>

      {!isHome && (
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Voltar
        </Button>
      )}
    </>
  );
};
