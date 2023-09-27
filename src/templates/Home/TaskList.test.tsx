import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "./TaskList";
import { useZustand } from "./state";

jest.mock("./serverActions.ts");
jest.mock("./clearCookies.ts");

afterEach(() => {
  useZustand.setState({
    columns: [],
    todos: [],
  });
});

function setInitialState() {
  // NOTE: The column's positions are not in order!
  // They should get sorted by the component itself
  useZustand.setState({
    columns: [
      {
        id: "column-1",
        name: "To do",
        position: 100,
        color: "red",
      },
       {
        id: "column-2",
        name: "In progress",
        position: 0,
        color: "blue",
      },
      {
        id: "column-3",
        name: "Done",
        position: 3,
        color: "green",
      },
    ],
    todos: [],
  });
}

it("should render the sorted columns", () => {
  setInitialState();

  const { container } = render(<TaskList />);
  expect(container).toMatchSnapshot("Default Home Page");

  ["In progress", "To do", "Done"].forEach((columnTitle) => {
    const element = screen.queryByText(columnTitle);
    expect(element).toBeInTheDocument();
  });
});

// it should render when empty
it("should render when empty", () => {
  const { container } = render(<TaskList />);
  expect(container).toMatchSnapshot("Empty Home Page");

  ["In progress", "To do", "Done"].forEach((columnTitle) => {
    const element = screen.queryByText(columnTitle);
    expect(element).not.toBeInTheDocument();
  });
});

it("should open the AddColumnModal when button is pressed", async () => {
  render(<TaskList />);

  // Click the button
  const button = screen.getByRole("button", { name: "Add Column" });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  const modal = screen.getByRole("dialog");
  modal.setAttribute("style", ""); // This value has animation! We don't want that in our snapshot
  expect(modal).toMatchSnapshot("AddColumnModal");
});

describe("sould create 10 random tasks when button is pressed", () => {
  it("should add new tasks on the first column", async () => {
    setInitialState();
    render(<TaskList />);

    const createRandomTasksButton = screen.getByRole("button", {
      name: "Create 10 random tasks",
    });
    expect(createRandomTasksButton).toBeInTheDocument();

    const column = screen.getByTitle("In progress");
    expect(column).toBeInTheDocument();

    expect(within(column).queryAllByTitle("task")).toHaveLength(0);

    await userEvent.click(createRandomTasksButton);

    await waitFor(() =>
      expect(within(column).getAllByTitle("task")).toHaveLength(10),
    );
  });

  it("should add new tasks on a new column", async () => {
    render(<TaskList />);

    const createRandomTasksButton = screen.getByRole("button", {
      name: "Create 10 random tasks",
    });
    expect(createRandomTasksButton).toBeInTheDocument();

    let randomColumn: HTMLElement | null;

    randomColumn = screen.queryByTitle("Random Column");
    expect(randomColumn).not.toBeInTheDocument();

    await userEvent.click(createRandomTasksButton);

    randomColumn = screen.getByTitle("Random Column");
    await waitFor(() => expect(randomColumn).toBeInTheDocument());
    expect(within(randomColumn).getAllByTitle("task")).toHaveLength(10);
  });
});
