import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "./TaskList";
import { useZustand } from "./state";

jest.mock("./serverActions.ts");

afterEach(() => {
  useZustand.setState({
    columns: {},
    todos: {},
  });
});

it("should render the sorted columns", () => {
  // NOTE: The column's positions are not in order!
  // They should get sorted by the component itself
  useZustand.setState({
    columns: {
      "column-1": {
        id: "column-1",
        name: "To do",
        position: 100,
        color: "red",
      },
      "column-2": {
        id: "column-2",
        name: "In progress",
        position: 0,
        color: "blue",
      },
      "column-3": {
        id: "column-3",
        name: "Done",
        position: 3,
        color: "green",
      },
    },
    todos: {
      "column-1": [],
      "column-2": [],
      "column-3": [],
    },
  });

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
