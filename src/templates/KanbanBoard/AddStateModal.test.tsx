import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddStateModal } from "./AddStateModal";
import { useZustand } from "./model";

jest.mock("./kanbanActions.ts");

function setupDialog() {
  act(() => {
    useZustand.setState({
      states: {},
      tasks: {},
      user: { email: "test" },
    });
  });
  const onClose = jest.fn();
  render(<AddStateModal isOpen={true} onClose={onClose} />);
  return { onClose };
}

function tearDownDialog() {
  act(() => useZustand.getState().clear());
}

it("should add a state when pressed", async () => {
  const { onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new state");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Add State", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const states = useZustand.getState().states;
  expect(Object.values(states)).toHaveLength(1);
  const stateId = Object.keys(states)[0];
  expect(states[stateId]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "States Result",
  );

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new state 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const states = useZustand.getState().states;
  expect(Object.values(states)).toHaveLength(1);
  const stateId = Object.keys(states)[0];
  expect(states[stateId]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "States Result",
  );

  tearDownDialog();
});
