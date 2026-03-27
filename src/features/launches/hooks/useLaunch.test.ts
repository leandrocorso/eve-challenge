import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";

import { AllProviders } from "@/test/AllProviders";
import { server } from "@/test/server";

import { useLaunch, useLaunchpad, useRocket } from "./useLaunch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

describe("useLaunch", () => {
  it("deve retornar dados com sucesso ao passar um id válido", async () => {
    const mockData = { id: "1", mission_name: "Starlink" };

    server.use(
      http.get(`${BASE_URL}/launches/1`, () => {
        return HttpResponse.json(mockData);
      }),
    );

    const { result } = renderHook(() => useLaunch("1"), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("deve disparar erro 'Lançamento não encontrado' quando res.ok for false", async () => {
    // Simula um erro 404 da API
    server.use(
      http.get(`${BASE_URL}/launches/999`, () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const { result } = renderHook(() => useLaunch("999"), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("Lançamento não encontrado");
  });

  it("deve manter a query desabilitada (enabled: false) se o id for undefined", () => {
    const { result } = renderHook(() => useLaunch(undefined), {
      wrapper: AllProviders,
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useRocket", () => {
  it("deve retornar dados do foguete com sucesso", async () => {
    const mockRocket = { id: "falcon9", name: "Falcon 9" };
    server.use(
      http.get("*/rockets/falcon9", () => HttpResponse.json(mockRocket)),
    );

    const { result } = renderHook(() => useRocket("falcon9"), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockRocket);
  });

  it("não deve disparar se o id for undefined", () => {
    const { result } = renderHook(() => useRocket(undefined), {
      wrapper: AllProviders,
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useLaunchpad", () => {
  it("deve retornar dados da plataforma de lançamento com sucesso", async () => {
    const mockPad = { id: "vafb", full_name: "Vandenberg" };
    server.use(http.get("*/launchpads/vafb", () => HttpResponse.json(mockPad)));

    const { result } = renderHook(() => useLaunchpad("vafb"), {
      wrapper: AllProviders,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPad);
  });

  it("não deve disparar se o id for undefined", () => {
    const { result } = renderHook(() => useLaunchpad(undefined), {
      wrapper: AllProviders,
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});
