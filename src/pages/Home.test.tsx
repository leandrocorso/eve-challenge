import { render, screen, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
import { HelmetProvider } from "react-helmet-async";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";

import type { FiltersBarProps } from "@/features/launches/components/FilterBar/FilterBarProps";
import { useLaunches } from "@/features/launches/hooks/useLaunches";
import { useLaunchFilters } from "@/features/launches/hooks/useLaunchesFilters";
import { AllProviders } from "@/test/AllProviders";

import { Home } from "./Home";

// Mocks dos hooks
vi.mock("@/features/launches/hooks/useLaunches");
vi.mock("@/features/launches/hooks/useLaunchesFilters");

// Mocks de componentes que não queremos testar profundamente
vi.mock("@/common/components/Header", () => ({
  Header: () => <div>Header</div>,
}));
vi.mock("@/features/launches/components/FilterBar", () => ({
  FiltersBar: ({
    onSearchChange,
    onStatusChange,
    onUpcomingChange,
    onDateFromChange,
    onDateToChange,
  }: FiltersBarProps) => (
    <div>
      <input
        data-testid="search-input"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        data-testid="status-btn"
        onClick={() => onStatusChange("success")}
      >
        Filtrar Status
      </button>
      <button data-testid="upcoming-btn" onClick={() => onUpcomingChange("ok")}>
        Upcoming
      </button>
      <input
        data-testid="date-from"
        onChange={(e) => onDateFromChange(dayjs(e.target.value))}
      />
      <input
        data-testid="date-to"
        onChange={(e) => onDateToChange(dayjs(e.target.value))}
      />
    </div>
  ),
}));

const mockSetFilters = vi.fn();
const mockSetPage = vi.fn();
const mockSetSearchTerm = vi.fn();

// Mock de um objeto de lançamento
const mockLaunch = {
  id: "1",
  name: "Falcon 1",
  links: {
    patch: { small: "https://image.com/small.png", large: null },
    flickr: { original: [] },
  },
  rocket: {
    name: "Falcon 1",
  },
  launchpad: {
    name: "Kwajalein Atoll",
  },
  date_utc: "2006-03-24T22:30:00.000Z",
  success: true,
  details: "Engine failure at 33 seconds.",
  flight_number: 1,
  upcoming: false,
};

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock para os filtros
    (useLaunchFilters as Mock).mockReturnValue({
      searchTerm: "",
      setSearchTerm: mockSetSearchTerm,
      setFilters: mockSetFilters,
      activeFilters: { status: null, upcoming: null, dateFrom: "", dateTo: "" },
      page: 1,
      setPage: mockSetPage,
    });
  });

  const renderHome = () =>
    render(
      <AllProviders>
        <HelmetProvider>
          <Home />
        </HelmetProvider>
      </AllProviders>,
    );

  it("deve exibir o componente de loading quando isLoading for true", () => {
    (useLaunches as Mock).mockReturnValue({ isLoading: true });
    renderHome();
    // Assumindo que o componente Loading tem um role ou testid
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("deve exibir alerta de erro quando isError for true", () => {
    (useLaunches as Mock).mockReturnValue({ isError: true, isLoading: false });
    renderHome();
    expect(screen.getByText(/Erro ao carregar dados/i)).toBeInTheDocument();
  });

  it("deve exibir mensagem informativa quando a lista de documentos estiver vazia", () => {
    (useLaunches as Mock).mockReturnValue({
      data: { docs: [], totalPages: 0 },
      isLoading: false,
      isError: false,
    });
    renderHome();
    expect(
      screen.getByText(/Nenhum lançamento encontrado/i),
    ).toBeInTheDocument();
  });

  it("deve renderizar a lista de lançamentos e paginação corretamente", () => {
    const mockData = {
      docs: [
        mockLaunch,
        {
          ...mockLaunch,
          id: "2",
          name: "Falcon 9",
          rocket: { name: "Falcon 9" },
        },
      ],
      totalPages: 5,
    };

    (useLaunches as Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    renderHome();

    // aparece no título E no nome do foguete.
    const falcon1Elements = screen.getAllByText(/Falcon 1/i);
    expect(falcon1Elements.length).toBeGreaterThan(0);

    const falcon9Elements = screen.getAllByText(/Falcon 9/i);
    expect(falcon9Elements.length).toBeGreaterThan(0);

    // Verifica se a paginação está presente
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("deve chamar setSearchTerm quando o valor da busca mudar", () => {
    (useLaunches as Mock).mockReturnValue({
      data: { docs: [] },
      isLoading: false,
    });
    renderHome();

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "Starlink" } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith("Starlink");
  });

  it("deve atualizar filtros e resetar para página 1 ao mudar um filtro", () => {
    (useLaunches as Mock).mockReturnValue({
      data: { docs: [] },
      isLoading: false,
    });
    renderHome();

    const btn = screen.getByTestId("status-btn");
    fireEvent.click(btn);

    expect(mockSetFilters).toHaveBeenCalled();
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("deve mudar a página ao interagir com a paginação", () => {
    const mockData = {
      docs: [mockLaunch],
      totalPages: 2,
    };

    (useLaunches as Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    renderHome();

    const page2Button = screen.getByLabelText(/Go to page 2/i);
    fireEvent.click(page2Button);

    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("deve atualizar filtros de data e upcoming", () => {
    (useLaunches as Mock).mockReturnValue({
      data: { docs: [] },
      isLoading: false,
    });
    renderHome();

    fireEvent.click(screen.getByTestId("upcoming-btn"));
    expect(mockSetFilters).toHaveBeenCalled();

    fireEvent.change(screen.getByTestId("date-from"), {
      target: { value: "2023-01-01" },
    });
    expect(mockSetFilters).toHaveBeenCalled();

    fireEvent.change(screen.getByTestId("date-to"), {
      target: { value: "2023-12-31" },
    });
    expect(mockSetFilters).toHaveBeenCalled();

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });
});
