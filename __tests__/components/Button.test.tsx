import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("defaults to primary variant", () => {
    const { container } = render(<Button>Primary</Button>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-neon-cyan");
  });

  it("applies accent variant classes", () => {
    const { container } = render(<Button variant="accent">Accent</Button>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("border-neon-cyan/30");
    expect(el.className).toContain("bg-transparent");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-dark-800");
  });

  it("applies ghost variant classes", () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("text-neon-cyan");
    expect(el.className).not.toContain("bg-neon-cyan");
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByText("Disabled");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Button className="extra">Styled</Button>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("extra");
    expect(el).toHaveClass("rounded");
  });
});
