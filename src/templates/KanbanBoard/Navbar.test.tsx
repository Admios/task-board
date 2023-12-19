import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

jest.mock("./clearCookies.ts");
jest.mock("./kanbanActions.ts");

function setup() {
  act(() => useZustand.getState().setUser({ email: "test" }));
}

function tearDown() {
  act(() => useZustand.getState().clear());
}

it("should show login when there is no user", async () => {
  const { push } = (useRouter as jest.Mock)();
  const { container } = render(<Navbar onOpenStateDialog={jest.fn()} />);
  expect(container).toMatchSnapshot("Default Header");

  // Click the button
  const button = await screen.findByText("Login");

  expect(button).toBeInTheDocument();
});

it("should launch logout when button is pressed", async () => {
  setup();

  const { push } = (useRouter as jest.Mock)();
  const { container } = render(<Navbar onOpenStateDialog={jest.fn()} />);
  expect(container).toMatchSnapshot("Logged in Header");

  // Click the button
  const button = await screen.findByText("Logout");
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(clearCookies).toHaveBeenCalled();

  tearDown();
});
