import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter></BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
