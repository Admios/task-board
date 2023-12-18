import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Layout } from "./Layout";
import { useZustand } from "./model";

jest.mock("./clearCookies.ts");
jest.mock("./kanbanActions.ts");

function setup() {
  act(() => useZustand.getState().setUser({ email: "test" }));
}

function tearDown() {
  act(() => useZustand.getState().clear());
}

function initialize() {
  // NOTE: The state's positions are not in order!
  // They should get sorted by the component itself
  act(() => {
    useZustand.getState().initialize(
      [],
      [
        {
          id: "state-1",
          name: "To do",
          position: 100,
          color: "red",
          owner: "test",
        },
        {
          id: "state-2",
          name: "In progress",
          position: 0,
          color: "blue",
          owner: "test",
        },
        {
          id: "state-3",
          name: "Done",
          position: 3,
          color: "green",
          owner: "test",
        },
      ],
    );
  });
}

it("should render the sorted states", () => {
  setup();
  initialize();

  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot("Default Kanban Page");

  ["In progress", "To do", "Done"].forEach((stateTitle) => {
    const element = screen.queryByText(stateTitle);
    expect(element).toBeInTheDocument();
  });

  tearDown();
});

it("should render when empty", () => {
  setup();
  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot("Empty Kanban Page");

  ["In progress", "To do", "Done"].forEach((stateTitle) => {
    const element = screen.queryByText(stateTitle);
    expect(element).not.toBeInTheDocument();
  });
  tearDown();
});

it("should open the AddStateModal when button is pressed", async () => {
  setup();
  render(<Layout />);

  // Click the button
  const button = await screen.findByText("add state", {
    exact: false,
    selector: ".navbar-item",
  });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  const modal = await screen.findByRole("dialog", { name: "Add State" });
  expect(modal).toMatchSnapshot("AddStateModal");

  tearDown();
});
