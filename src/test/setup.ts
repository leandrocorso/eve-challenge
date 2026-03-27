import "@testing-library/jest-dom/vitest";
import dayjs from "dayjs";
import { beforeAll, afterEach, afterAll } from "vitest";

import { server } from "./server";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
