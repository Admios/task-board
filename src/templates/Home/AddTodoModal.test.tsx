import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useZustand } from "./state";
import { AddTodoModal } from "./AddTodoModal";

function setupDialog() {
  const columnId = "column-1";
  useZustand.setState({
    columns: {
      [columnId]: {
        id: columnId,
        name: "To do",
        position: 100,
        color: "red",
        backendId: "1",
      },
    },
    todos: {
      [columnId]: [],
    },
  });

  const onClose = jest.fn();
  render(<AddTodoModal isOpen={true} onClose={onClose} columnId={columnId} />);

  return { onClose, columnId };
}

function tearDownDialog() {
  useZustand.setState({
    columns: {},
    todos: {},
  });
}

it("should add a task when pressed", async () => {
  const { columnId, onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Add Task", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(1);
  expect(todos[columnId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Todos Result",
  );

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose, columnId } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new task 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos[columnId])).toHaveLength(1);
  expect(todos[columnId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Columns Result",
  );

  tearDownDialog();
})
