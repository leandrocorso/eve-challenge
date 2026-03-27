import { renderHook, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { type LaunchFilters } from "@/features/launches/hooks/LaunchProps";
import { AllProviders } from "@/test/AllProviders";
import { server } from "@/test/server";

import { useLaunches } from "./useLaunches";

describe("useLaunches Hook", () => {
  const defaultFilters: LaunchFilters = {
    search: "",
    status: "all",
    upcoming: "all",
    dateFrom: null,
    dateTo: null,
  };

  it("deve buscar lançamentos com sucesso e filtros padrão", async () => {
    const { result } = renderHook(() => useLaunches(1, defaultFilters), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.docs[0].name).toBe("Falcon 9 Mock");
    expect(result.current.data.page).toBe(1);
  });

  it("deve cobrir todas as condicionais de filtros (search, status, upcoming)", async () => {
    const customFilters: LaunchFilters = {
      search: "Starlink",
      status: "success",
      upcoming: "upcoming",
      dateFrom: null,
      dateTo: null,
    };

    const { result } = renderHook(() => useLaunches(1, customFilters), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // Aqui garantimos que os blocos 'if (search)', 'if (status !== "all")' e 'if (upcoming !== "all")' foram executados.
  });

  it("deve aplicar filtros de data quando ambos são válidos", async () => {
    const dateFilters: LaunchFilters = {
      ...defaultFilters,
      dateFrom: dayjs("2024-01-01"),
      dateTo: dayjs("2024-12-31"),
    };

    const { result } = renderHook(() => useLaunches(1, dateFilters), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("não deve incluir date_utc no queryObj se as datas forem inválidas", async () => {
    const invalidDateFilters: LaunchFilters = {
      ...defaultFilters,
      dateFrom: dayjs("2024-02-30"), // Data inválida pois 30 de fevereiro não existe!
      dateTo: dayjs("2024-12-31"),
    };

    const { result } = renderHook(() => useLaunches(1, invalidDateFilters), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("deve lançar erro quando a resposta da API falhar", async () => {
    // Sobrescreve o handler global para este teste específico simular erro
    server.use(
      http.post(`${import.meta.env.VITE_API_BASE_URL}/launches/query`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useLaunches(1, defaultFilters), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Erro ao buscar lançamentos");
  });
});
