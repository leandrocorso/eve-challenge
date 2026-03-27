import { screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, it, expect, vi } from "vitest";

import { render } from "@/test/utils";

import { FiltersBar } from "./";

describe("FiltersBar", () => {
  const defaultProps = {
    search: "",
    onSearchChange: vi.fn(),
    status: "all",
    onStatusChange: vi.fn(),
    upcoming: "all",
    onUpcomingChange: vi.fn(),
    dateFrom: null,
    onDateFromChange: vi.fn(),
    dateTo: null,
    onDateToChange: vi.fn(),
  };

  it("deve renderizar todos os campos de filtro corretamente", () => {
    render(<FiltersBar {...defaultProps} />);

    expect(screen.getByLabelText(/buscar por nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lançamentos/i)).toBeInTheDocument();

    expect(screen.getAllByLabelText(/data início/i)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(/data fim/i)[0]).toBeInTheDocument();
  });

  it("deve chamar onSearchChange quando o usuário digita no campo de busca", () => {
    render(<FiltersBar {...defaultProps} />);

    const input = screen.getByLabelText(/buscar por nome/i);
    fireEvent.change(input, { target: { value: "Falcon" } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("Falcon");
  });

  it("deve chamar onStatusChange ao alterar o valor do select de status", () => {
    render(<FiltersBar {...defaultProps} />);

    const select = screen.getByLabelText(/status/i);
    fireEvent.mouseDown(select);

    const option = screen.getByRole("option", { name: /sucesso/i });
    fireEvent.click(option);

    expect(defaultProps.onStatusChange).toHaveBeenCalledWith("success");
  });

  it("deve chamar onUpcomingChange ao alterar o valor do select de lançamentos", () => {
    render(<FiltersBar {...defaultProps} />);

    const select = screen.getByLabelText(/lançamentos/i);
    fireEvent.mouseDown(select);

    const option = screen.getByRole("option", { name: /próximos/i });
    fireEvent.click(option);

    expect(defaultProps.onUpcomingChange).toHaveBeenCalledWith("upcoming");
  });

  it("deve exibir mensagem de erro quando o intervalo de datas for inválido", () => {
    const invalidProps = {
      ...defaultProps,
      dateFrom: dayjs("2026-03-27"),
      dateTo: dayjs("2026-03-20"), // Data fim anterior à data início
    };

    render(<FiltersBar {...invalidProps} />);

    expect(
      screen.getByText(/data início deve ser anterior à data fim/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/data fim deve ser posterior à data início/i),
    ).toBeInTheDocument();
  });

  it("não deve exibir erro quando o intervalo de datas for válido", () => {
    const validProps = {
      ...defaultProps,
      dateFrom: dayjs("2026-03-20"),
      dateTo: dayjs("2026-03-27"),
    };

    render(<FiltersBar {...validProps} />);

    expect(
      screen.queryByText(/data início deve ser anterior à data fim/i),
    ).not.toBeInTheDocument();
  });

  it("deve chamar onDateFromChange ao alterar a data de início", async () => {
    const user = userEvent.setup();
    render(<FiltersBar {...defaultProps} />);

    const container = document.querySelector(".date-from");

    const sections = within(container as HTMLElement).getAllByRole(
      "spinbutton",
    );

    await user.click(sections[0]);
    await user.keyboard("20032026");
    await user.keyboard("{Tab}");

    expect(defaultProps.onDateFromChange).toHaveBeenCalled();
  });

  it("deve chamar onDateToChange ao alterar a data de fim", async () => {
    const user = userEvent.setup();
    render(<FiltersBar {...defaultProps} />);

    const container = document.querySelector(".date-to");

    const sections = within(container as HTMLElement).getAllByRole(
      "spinbutton",
    );

    await user.click(sections[0]);
    await user.keyboard("21032026");
    await user.keyboard("{Tab}");

    expect(defaultProps.onDateToChange).toHaveBeenCalled();
  });
});
