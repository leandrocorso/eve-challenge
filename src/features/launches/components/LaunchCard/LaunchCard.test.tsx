import { render, screen } from "@testing-library/react";
import type React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { type LaunchProps } from "../../hooks/LaunchProps";

import { LaunchCard } from "./";

const mockProps: LaunchProps = {
  id: "5eb87cd9ffd86e000604b32a",
  name: "Falcon Sat",
  date_utc: "2006-03-24T22:30:00.000Z",
  success: true,
  upcoming: false,
  rocket: { name: "Falcon 1" },
  launchpad: { name: "Kwajalein Atoll" },
  links: {
    patch: { small: "https://images2.imgbox.com/3c/0d/2mYgS1n8_o.png" },
    flickr: { original: [] },
  },
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe("LaunchCard Component", () => {
  it("deve renderizar as informações básicas corretamente (nome, foguete e local)", () => {
    renderWithRouter(<LaunchCard {...mockProps} />);

    expect(screen.getByText("Falcon Sat")).toBeInTheDocument();
    expect(screen.getByText("Falcon 1")).toBeInTheDocument();
    expect(screen.getByText("Kwajalein Atoll")).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockProps.date_utc).toLocaleDateString()),
    ).toBeInTheDocument();
  });

  it("deve exibir o link correto para a página de detalhes", () => {
    renderWithRouter(<LaunchCard {...mockProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/launch/${mockProps.id}`);
  });

  describe("Lógica de Status (Badges)", () => {
    it('deve exibir status "Upcoming" quando upcoming for true', () => {
      renderWithRouter(<LaunchCard {...mockProps} upcoming={true} />);
      expect(screen.getByText("Upcoming")).toBeInTheDocument();
    });

    it('deve exibir status "Success" quando success for true e upcoming for false', () => {
      renderWithRouter(
        <LaunchCard {...mockProps} success={true} upcoming={false} />,
      );
      expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it('deve exibir status "Failed" quando success for false e upcoming for false', () => {
      renderWithRouter(
        <LaunchCard {...mockProps} success={false} upcoming={false} />,
      );
      expect(screen.getByText("Failed")).toBeInTheDocument();
    });
  });

  describe("Lógica de Imagens (Fallback)", () => {
    it("deve usar links.patch.small se disponível", () => {
      renderWithRouter(<LaunchCard {...mockProps} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", mockProps.links.patch.small);
    });

    it("deve usar links.flickr.original[0] se patch.small for null", () => {
      const propsWithoutPatch: LaunchProps = {
        ...mockProps,
        links: {
          patch: { small: undefined },
          flickr: { original: ["https://flickr-image.jpg"] },
        },
      };
      renderWithRouter(<LaunchCard {...propsWithoutPatch} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://flickr-image.jpg");
    });

    it("deve usar o placeholder padrão se nenhuma imagem for fornecida", () => {
      const propsWithoutImages: LaunchProps = {
        ...mockProps,
        links: {
          patch: { small: undefined },
          flickr: { original: [] },
        },
      };
      renderWithRouter(<LaunchCard {...propsWithoutImages} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute(
        "src",
        "https://placehold.co/120?text=Sem%20imagem",
      );
    });
  });

  it("deve ter o atributo alt correto para acessibilidade", () => {
    renderWithRouter(<LaunchCard {...mockProps} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", `Patch da missão ${mockProps.name}`);
  });
});
