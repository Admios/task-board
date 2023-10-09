import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Layout } from "./Layout";
import { useZustand } from "./model";

jest.mock("./clearCookies.ts");
jest.mock("./kanbanActions.ts");

afterEach(() => {
  useZustand.setState({
    states: {},
    tasks: {},
    user: {
      username: "test",
    },
  });
});

function setInitialState() {
  // NOTE: The state's positions are not in order!
  // They should get sorted by the component itself
  act(() => {
    useZustand.setState({
      states: {
        "state-1": {
          id: "state-1",
          name: "To do",
          position: 100,
          color: "red",
          owner: "test",
        },
        "state-2": {
          id: "state-2",
          name: "In progress",
          position: 0,
          color: "blue",
          owner: "test",
        },
        "state-3": {
          id: "state-3",
          name: "Done",
          position: 3,
          color: "green",
          owner: "test",
        },
      },
      tasks: {
        "state-1": [],
        "state-2": [],
        "state-3": [],
      },
    });
  });
}

it("should render the sorted states", () => {
  setInitialState();

  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot("Default Kanban Page");

  ["In progress", "To do", "Done"].forEach((stateTitle) => {
    const element = screen.queryByText(stateTitle);
    expect(element).toBeInTheDocument();
  });
});

// it should render when empty
it("should render when empty", () => {
  const { container } = render(<Layout />);
  expect(container).toMatchSnapshot("Empty Kanban Page");

  ["In progress", "To do", "Done"].forEach((stateTitle) => {
    const element = screen.queryByText(stateTitle);
    expect(element).not.toBeInTheDocument();
  });
});

it("should open the AddStateModal when button is pressed", async () => {
  render(<Layout />);

  // Click the button
  const button = await screen.findByTestId("add-state-button")
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  const modal = screen.getByRole("dialog");
  modal.setAttribute("style", ""); // This value has animation! We don't want that in our snapshot
  expect(modal).toMatchSnapshot("AddStateModal");
});

describe("sould create 10 random tasks when button is pressed", () => {
  it("should add new tasks on the first state", async () => {
    setInitialState();
    render(<Layout />);

    const createRandomTasksButton = await screen.findByTestId("create-random-task-button")
    expect(createRandomTasksButton).toBeInTheDocument();

    const state = screen.getByTitle("In progress");
    expect(state).toBeInTheDocument();

    expect(within(state).queryAllByTitle("task")).toHaveLength(0);

    await userEvent.click(createRandomTasksButton);

    await waitFor(() =>
      expect(within(state).getAllByTitle("task")).toHaveLength(10),
    );
  });

  it("should add new tasks on a new state", async () => {
    render(<Layout />);

    const createRandomTasksButton = await screen.findByTestId("create-random-task-button")
    expect(createRandomTasksButton).toBeInTheDocument();

    let randomState: HTMLElement | null;

    randomState = screen.queryByTitle("Random State");
    expect(randomState).not.toBeInTheDocument();

    await userEvent.click(createRandomTasksButton);

    randomState = screen.getByTitle("Random State");
    await waitFor(() => expect(randomState).toBeInTheDocument());
    expect(within(randomState).getAllByTitle("task")).toHaveLength(10);
  });
});
