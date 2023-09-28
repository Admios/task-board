import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useZustand } from "./state";
import { EditTodoModal } from "./EditTodoModal";

jest.mock("./serverActions.ts");

function setupDialog() {
  const columnId = "column-1";
  const todo = {
    id: "todo-1",
    text: "My task",
    position: 100,
    columnId,
  }
  act(() => {
    useZustand.setState({
      columns: [{
        id: columnId,
        name: "To do",
        position: 100,
        color: "red",
      }],
      todos:  [todo],
    });
  });

  const onClose = jest.fn();
  render(<EditTodoModal isOpen={true} onClose={onClose} todo={todo} />);

  return { onClose, columnId };
}

function tearDownDialog() {
  act(() => {
    useZustand.setState({
      columns: [],
      todos: [],
    });
  });
}

it("should add a task when pressed", async () => {
  const { columnId, onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Edit Todo", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(1);
  expect(todos[0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Todos Result",
  );

  tearDownDialog();
});

it("should not edit a task when todo is undefined", async () => {
  const onClose = jest.fn();
  render(<EditTodoModal isOpen={true} onClose={onClose} />);

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Edit Todo", { selector: "button" }));

  expect(onClose).not.toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(0);

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose, columnId } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new task 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(1);
  expect(todos[0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Columns Result",
  );

  tearDownDialog();
});