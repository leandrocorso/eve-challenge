import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Lançamentos SpaceX
      </Typography>

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
