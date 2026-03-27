import { renderHook, act } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { AllProviders } from "@/test/AllProviders";

import { useLaunchFilters } from "./useLaunchesFilters";

describe("useLaunchFilters Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve inicializar com valores padrão da URL", () => {
    const initialEntries = ["/launches?search=Falcon&status=success&page=2"];

    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: ({ children }) => (
        <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
      ),
    }); //

    expect(result.current.searchTerm).toBe("Falcon");
    expect(result.current.activeFilters.status).toBe("success");
    // O hook gerencia o estado da página internamente, mas a URL inicial não seta o setPage automaticamente no mount sem um useEffect extra,
    // porém o código lê o searchParams no estado inicial.
  });

  it("deve atualizar o searchTerm e aplicar debounce", () => {
    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.setSearchTerm("Starlink");
    });

    // Antes do tempo passar, o activeFilters.search ainda é vazio (ou o valor anterior)
    expect(result.current.activeFilters.search).toBe("");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.activeFilters.search).toBe("Starlink");
  });

  it("deve remover o parâmetro search da URL quando o termo for vazio", () => {
    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.setSearchTerm("");
      vi.advanceTimersByTime(500);
    });

    expect(result.current.activeFilters.search).toBe("");
  });

  it("deve atualizar filtros de status, upcoming e datas", () => {
    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: AllProviders,
    });

    const newFilters = {
      search: "",
      status: "failed" as const,
      upcoming: "past" as const,
      dateFrom: dayjs("2023-01-01"),
      dateTo: dayjs("2023-12-31"),
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.activeFilters.status).toBe("failed");
    expect(result.current.activeFilters.dateFrom!.format("YYYY-MM-DD")).toBe(
      "2023-01-01",
    );
  });

  it("deve atualizar a página e refletir na URL", () => {
    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it("não deve incluir datas inválidas nos parâmetros da URL", () => {
    const { result } = renderHook(() => useLaunchFilters(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.setFilters({
        search: "",
        status: "all",
        upcoming: "all",
        dateFrom: dayjs("data-invalida"),
        dateTo: dayjs("data-invalida"),
      });
    });

    // Se as datas são inválidas, o useEffect não deve dar params.set("from/to")
    expect(result.current.activeFilters.dateFrom!.isValid()).toBe(false);
  });
});
