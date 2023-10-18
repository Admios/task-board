import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditTaskModal } from "./EditTaskModal";
import { Task, useZustand } from "./model";

jest.mock("./kanbanActions.ts");

function setupDialog(task: Task) {
  act(() => {
    useZustand.setState({
      tasks: {},
    });
  });
  const onClose = jest.fn();
  render(<EditTaskModal isOpen={true} onClose={onClose} task={task} />);
  return { onClose };
}

function tearDownDialog() {
  act(() => useZustand.getState().clear());
}

it("should edit a task when pressed", async () => {
  const mockTask = {
    id: "1",
    text: "Test Task",
    stateId: "1",
    position: 0,
    owner: "test",
  };
  const { onClose } = setupDialog(mockTask);

  await userEvent.type(screen.getByRole("textbox"), "Updated Text");
  await waitFor(() => {
    userEvent.click(screen.getByText("Edit Task", { selector: "button" }));
  });

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  tearDownDialog();
});

it("should submit when 'Enter' is pressed", async () => {
  const mockTask = {
    id: "1",
    text: "Test Task",
    stateId: "1",
    position: 0,
    owner: "test",
  };
  const { onClose } = setupDialog(mockTask);

  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "Updated Text{enter}");

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  tearDownDialog();
});
