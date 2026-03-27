import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Home } from "@/pages/Home";
import { LaunchDetails } from "@/pages/LaunchesDetails";

import { ErrorFallback } from "./common/components/ErrorFallback";
import { ColorModeProvider } from "./features/colorMode/contexts/ColorModeProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.replace("/")} // O que fazer ao resetar
        >
          <ColorModeProvider>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/launch/:id" element={<LaunchDetails />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </BrowserRouter>
            </LocalizationProvider>
          </ColorModeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
