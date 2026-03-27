import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { createTestQueryClient } from "./utils";

interface AllProvidersProps {
  children: ReactNode;
  initialEntries?: string[];
}

export const AllProviders = ({
  children,
  initialEntries = ["/"],
}: AllProvidersProps) => {
  const queryClient = useMemo(() => createTestQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};
