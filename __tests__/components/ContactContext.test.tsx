import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { ContactModalProvider, useContactModal } from "@/lib/contact-context";

afterEach(() => {
  cleanup();
});

function TestConsumer() {
  const { isOpen, open, close } = useContactModal();
  return (
    <div>
      <span data-testid="status">{isOpen ? "open" : "closed"}</span>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
}

describe("ContactModalProvider", () => {
  it("starts closed", () => {
    render(
      <ContactModalProvider>
        <TestConsumer />
      </ContactModalProvider>
    );
    expect(screen.getByTestId("status")).toHaveTextContent("closed");
  });

  it("opens when open() is called", () => {
    render(
      <ContactModalProvider>
        <TestConsumer />
      </ContactModalProvider>
    );
    act(() => fireEvent.click(screen.getByText("Open")));
    expect(screen.getByTestId("status")).toHaveTextContent("open");
  });

  it("closes when close() is called", () => {
    render(
      <ContactModalProvider>
        <TestConsumer />
      </ContactModalProvider>
    );
    act(() => fireEvent.click(screen.getByText("Open")));
    expect(screen.getByTestId("status")).toHaveTextContent("open");
    act(() => fireEvent.click(screen.getByText("Close")));
    expect(screen.getByTestId("status")).toHaveTextContent("closed");
  });

  it("throws when used outside provider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useContactModal must be used within ContactModalProvider"
    );
  });
});
