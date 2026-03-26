import { useQuery } from "@tanstack/react-query";

export const useLaunch = (id: string | undefined) => {
  return useQuery({
    queryKey: ["launch", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não encontrado");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/launches/${id}`,
      );

      if (!response.ok) throw new Error("Erro ao buscar detalhes");

      return response.json();
    },

    enabled: !!id,
  });
};
