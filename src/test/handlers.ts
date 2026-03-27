import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(`${import.meta.env.VITE_API_BASE_URL}/launches/query`, async () => {
    return HttpResponse.json({
      docs: [
        {
          id: "1",
          name: "Falcon 9 Mock",
          success: true,
          upcoming: false,
          details: "Missão de teste com mock",
          links: {
            patch: {
              small: "https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png",
            },
          },
        },
      ],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    });
  }),
];
