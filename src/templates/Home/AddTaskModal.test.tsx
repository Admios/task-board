import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useZustand } from "./model";
import { AddTaskModal } from "./AddTaskModal";

jest.mock("./homeServerActions.ts");

function setupDialog() {
  const stateId = "state-1";
  act(() => {
    useZustand.setState({
      states: {
        [stateId]: {
          id: stateId,
          name: "To do",
          position: 100,
          color: "red",
          owner: "test",
        },
      },
      tasks: {
        [stateId]: [],
      },
      user: {
        username: "test",
      },
    });
  });
  const onClose = jest.fn();
  render(<AddTaskModal isOpen={true} onClose={onClose} stateId={stateId} />);

  return { onClose, stateId };
}

function tearDownDialog() {
  act(() => {
    useZustand.setState({
      states: {},
      tasks: {},
    });
  });
}

it("should add a task when pressed", async () => {
  const { stateId, onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Add Task", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const tasks = useZustand.getState().tasks;
  expect(Object.values(tasks)).toHaveLength(1);
  expect(tasks[stateId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Tasks Result",
  );

  tearDownDialog();
});

it("should not add a task when stateId is undefined", async () => {
  const onClose = jest.fn();
  render(<AddTaskModal isOpen={true} onClose={onClose} />);

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
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
  expect(Object.values(tasks[stateId])).toHaveLength(1);
  expect(tasks[stateId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "States Result",
  );

  tearDownDialog();
});
