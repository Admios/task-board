import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useZustand } from "./model";
import { AddTodoModal } from "./AddTodoModal";

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
      todos: {
        [stateId]: [],
      },
      user: {
        username: "test",
      },
    });
  });
  const onClose = jest.fn();
  render(<AddTodoModal isOpen={true} onClose={onClose} stateId={stateId} />);

  return { onClose, stateId };
}

function tearDownDialog() {
  act(() => {
    useZustand.setState({
      states: {},
      todos: {},
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
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(1);
  expect(todos[stateId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Todos Result",
  );

  tearDownDialog();
});

it("should not add a task when stateId is undefined", async () => {
  const onClose = jest.fn();
  render(<AddTodoModal isOpen={true} onClose={onClose} />);

  await userEvent.type(screen.getByRole("textbox"), "My new task");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Add Task", { selector: "button" }));

  expect(onClose).not.toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos)).toHaveLength(0);

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose, stateId } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new task 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const todos = useZustand.getState().todos;
  expect(Object.values(todos[stateId])).toHaveLength(1);
  expect(todos[stateId][0]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "States Result",
  );

  tearDownDialog();
});
