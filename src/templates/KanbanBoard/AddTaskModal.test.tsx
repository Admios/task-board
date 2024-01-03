import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTaskModal } from "./AddTaskModal";
import { useZustand } from "./model";

jest.mock("./kanbanActions.ts");

function setupDialog() {
  const stateId = "state-1";
  act(() => {
    useZustand.getState().setUser({ email: "test" });
    useZustand.getState().initialize(
      [],
      [
        {
          id: stateId,
          name: "To do",
          boardId: "board-1",
          position: 100,
          color: "red",
        },
      ],
    );
  });
  const onClose = jest.fn();
  render(<AddTaskModal isOpen={true} onClose={onClose} stateId={stateId} />);

  return { onClose, stateId };
}

function tearDownDialog() {
  act(() => useZustand.getState().clear());
}

it("should add a task when pressed", async () => {
  const { stateId, onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await userEvent.click(screen.getByText("Add Task", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const tasks = useZustand.getState().tasks;
  const tasksOrder = useZustand.getState().tasksOrder[stateId];
  expect(Object.keys(tasks)).toHaveLength(1);
  expect(tasksOrder).toHaveLength(1);
  tasksOrder.forEach((taskId) => {
    expect(tasks[taskId]).toMatchSnapshot(
      { id: expect.any(String) },
      "Tasks Result",
    );
  });

  tearDownDialog();
});

it("should not add a task when stateId is undefined", async () => {
  const onClose = jest.fn();
  render(<AddTaskModal isOpen={true} onClose={onClose} />);

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await userEvent.click(screen.getByText("Add Task", { selector: "button" }));

  expect(onClose).not.toHaveBeenCalled();
  const tasks = useZustand.getState().tasks;
  expect(Object.values(tasks)).toHaveLength(0);

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose, stateId } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new task 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const tasks = useZustand.getState().tasks;
  const tasksOrder = useZustand.getState().tasksOrder[stateId];
  expect(Object.keys(tasks)).toHaveLength(1);
  expect(tasksOrder).toHaveLength(1);
  tasksOrder.forEach((taskId) => {
    expect(tasks[taskId]).toMatchSnapshot(
      { id: expect.any(String) },
      "Tasks Result after pressing enter",
    );
  });

  tearDownDialog();
});
