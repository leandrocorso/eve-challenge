import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, type Mock } from "vitest";

import {
  useLaunch,
  useRocket,
  useLaunchpad,
} from "@/features/launches/hooks/useLaunch";
import { AllProviders } from "@/test/AllProviders";

import { LaunchDetails } from "./LaunchesDetails";

// Mocks dos hooks e componentes
vi.mock("@/features/launches/hooks/useLaunch");
vi.mock("@/common/components/Header", () => ({
  Header: () => <header>Header</header>,
}));

const mockLaunch = {
  id: "1",
  name: "FalconSat",
  date_utc: "2006-03-24T22:30:00.000Z",
  flight_number: 1,
  success: false,
  upcoming: false,
  details: "Engine failure at 33 seconds.",
  rocket: "5e9d0d95eda69955f709d1eb",
  launchpad: "5e9e4502f5bd9995810b4561",
  links: {
    patch: { small: "small.png", large: "large.png" },
    flickr: { original: ["img1.jpg", "img2.jpg"] },
    webcast: "https://youtu.be/0aTQ7nJGma0",
    wikipedia: "https://en.wikipedia.org/wiki/FalconSat",
  },
};

const mockRocket = { name: "Falcon 1", type: "rocket" };
const mockLaunchpad = { name: "Kwajalein Atoll" };

describe("LaunchDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (id = "1") =>
    render(
      <AllProviders initialEntries={[`/launch/${id}`]}>
        <HelmetProvider>
          <Routes>
            <Route path="/launch/:id" element={<LaunchDetails />} />
          </Routes>
        </HelmetProvider>
      </AllProviders>,
    );

  it("deve exibir o componente de loading quando qualquer dado estiver carregando", () => {
    (useLaunch as Mock).mockReturnValue({ isLoading: true });
    (useRocket as Mock).mockReturnValue({ isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({ isLoading: false });

    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("deve exibir mensagem de 'não encontrado' se o lançamento for nulo", () => {
    (useLaunch as Mock).mockReturnValue({ data: null, isLoading: false });
    (useRocket as Mock).mockReturnValue({ data: null, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({ data: null, isLoading: false });

    renderComponent();
    expect(screen.getByText(/Lançamento não encontrado/i)).toBeInTheDocument();
  });

  it("deve renderizar todos os detalhes da missão, foguete e local com sucesso", () => {
    (useLaunch as Mock).mockReturnValue({ data: mockLaunch, isLoading: false });
    (useRocket as Mock).mockReturnValue({ data: mockRocket, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({
      data: mockLaunchpad,
      isLoading: false,
    });

    renderComponent();

    // Textos principais
    expect(screen.getByText("FalconSat")).toBeInTheDocument();
    expect(screen.getByText("Falcon 1")).toBeInTheDocument();
    expect(screen.getByText("(rocket)")).toBeInTheDocument();
    expect(screen.getByText("Kwajalein Atoll")).toBeInTheDocument();
    expect(screen.getByText(mockLaunch.details)).toBeInTheDocument();

    // Chips e Voo
    expect(screen.getByText("Falha")).toBeInTheDocument();
    expect(screen.getByText("Voo #1")).toBeInTheDocument();

    // Imagem do Patch
    const patchImg = screen.getByAltText(/Patch da missão FalconSat/i);
    expect(patchImg).toHaveAttribute("src", "large.png");

    // Galeria
    expect(screen.getByText("Galeria")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(2); // Patch + Galeria
  });

  it("deve exibir o status 'Sucesso' quando o lançamento for bem sucedido", () => {
    const successLaunch = { ...mockLaunch, success: true };
    (useLaunch as Mock).mockReturnValue({
      data: successLaunch,
      isLoading: false,
    });
    (useRocket as Mock).mockReturnValue({ data: mockRocket, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({
      data: mockLaunchpad,
      isLoading: false,
    });

    renderComponent();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
  });

  it("deve exibir o status 'Upcoming' quando o lançamento ainda não ocorreu", () => {
    const upcomingLaunch = { ...mockLaunch, success: null, upcoming: true };
    (useLaunch as Mock).mockReturnValue({
      data: upcomingLaunch,
      isLoading: false,
    });
    (useRocket as Mock).mockReturnValue({ data: mockRocket, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({
      data: mockLaunchpad,
      isLoading: false,
    });

    renderComponent();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
  });

  it("deve usar imagem de placeholder quando não houver patch", () => {
    const noImageLaunch = {
      ...mockLaunch,
      links: { ...mockLaunch.links, patch: { small: null, large: null } },
    };
    (useLaunch as Mock).mockReturnValue({
      data: noImageLaunch,
      isLoading: false,
    });
    (useRocket as Mock).mockReturnValue({ data: mockRocket, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({
      data: mockLaunchpad,
      isLoading: false,
    });

    renderComponent();
    const patchImg = screen.getByAltText(/Patch da missão FalconSat/i);
    expect(patchImg).toHaveAttribute(
      "src",
      expect.stringContaining("placehold.co"),
    );
  });

  it("não deve renderizar botões de links ou galeria se eles não existirem", () => {
    const minimalLaunch = {
      ...mockLaunch,
      details: null,
      links: {
        ...mockLaunch.links,
        webcast: null,
        wikipedia: null,
        flickr: { original: [] },
      },
    };
    (useLaunch as Mock).mockReturnValue({
      data: minimalLaunch,
      isLoading: false,
    });
    (useRocket as Mock).mockReturnValue({ data: mockRocket, isLoading: false });
    (useLaunchpad as Mock).mockReturnValue({
      data: mockLaunchpad,
      isLoading: false,
    });

    renderComponent();

    expect(screen.queryByText("YouTube")).not.toBeInTheDocument();
    expect(screen.queryByText("Wikipedia")).not.toBeInTheDocument();
    expect(screen.queryByText("Galeria")).not.toBeInTheDocument();
    expect(
      screen.getByText("Sem detalhes adicionais disponíveis."),
    ).toBeInTheDocument();
  });
});
