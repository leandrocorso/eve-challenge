import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useLaunch = (id: string | undefined) => {
  return useQuery({
    queryKey: ["launch", id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/launches/${id}`);
      if (!res.ok) throw new Error("Lançamento não encontrado");
      return res.json();
    },
    enabled: !!id,
  });
};

export const useRocket = (id: string | undefined) => {
  return useQuery({
    queryKey: ["rocket", id],
    queryFn: () => fetch(`${BASE_URL}/rockets/${id}`).then((res) => res.json()),
    enabled: !!id,
  });
};

export const useLaunchpad = (id: string | undefined) => {
  return useQuery({
    queryKey: ["launchpad", id],
    queryFn: () =>
      fetch(`${BASE_URL}/launchpads/${id}`).then((res) => res.json()),
    enabled: !!id,
  });
};
