import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditTodoModal } from "./EditTodoModal";
import { useZustand } from "./state";

jest.mock("./serverActions.ts");

function setupDialog(todo: any) {
  useZustand.setState({
    todos: {},
  });

  const onClose = jest.fn();
  render(<EditTodoModal isOpen={true} onClose={onClose} todo={todo} />);
  return { onClose };
}

function tearDownDialog() {
  useZustand.setState({
    todos: {},
  });
}

it("should edit a task when pressed", async () => {
  const mockTodo = { id: '1', text: 'Test Todo' };
  const { onClose } = setupDialog(mockTodo);

  await userEvent.type(screen.getByRole("textbox"), "Updated Text");
  await waitFor(() => {
    userEvent.click(screen.getByText("Edit Todo", { selector: "button" }));
  });

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  tearDownDialog();
});

it("should submit when 'Enter' is pressed", async () => {
  const mockTodo = { id: '1', text: 'Test Todo' };
  const { onClose } = setupDialog(mockTodo);

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "Updated Text{enter}");

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  tearDownDialog();
});
