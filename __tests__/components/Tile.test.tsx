import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Tile from "@/components/ui/Tile";

describe("Tile", () => {
  it("renders children", () => {
    render(<Tile>Hello</Tile>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies tile base class", () => {
    const { container } = render(<Tile>Content</Tile>);
    expect(container.firstChild).toHaveClass("tile");
  });

  it("applies accent hover classes when accent prop is set", () => {
    const { container } = render(<Tile accent="cyan">Content</Tile>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("hover:border-neon-cyan");
  });

  it("does not apply accent classes when accent is not set", () => {
    const { container } = render(<Tile>Content</Tile>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain("hover:border-neon");
  });

  it("merges custom className", () => {
    const { container } = render(<Tile className="custom-class">Content</Tile>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("tile");
    expect(el).toHaveClass("custom-class");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Tile ref={ref}>Content</Tile>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes through HTML attributes", () => {
    render(<Tile data-testid="my-tile">Content</Tile>);
    expect(screen.getByTestId("my-tile")).toBeInTheDocument();
  });

  it("supports all accent colors", () => {
    const accents = ["cyan", "purple", "green", "yellow", "pink", "orange"] as const;
    for (const accent of accents) {
      const { container, unmount } = render(<Tile accent={accent}>Content</Tile>);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain(`hover:border-neon-${accent}`);
      unmount();
    }
  });
});
