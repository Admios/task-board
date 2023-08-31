import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddColumnModal } from "./AddColumnModal";
import { useZustand } from "./state";


function setupDialog() {
  useZustand.setState({
    columns: {},
    todos: {},
  });

  const onClose = jest.fn();
  render(<AddColumnModal isOpen={true} onClose={onClose} />);
  return { onClose };
}

function tearDownDialog() {
  useZustand.setState({
    columns: {},
    todos: {},
  });
}

it("should add a column when pressed", async () => {
  const { onClose } = setupDialog();

  await userEvent.type(screen.getByRole("textbox"), "My new column");
  await waitFor(() => {
    expect(screen.getByLabelText("Close").getAttribute("disabled")).toBeNull();
  });
  await userEvent.click(screen.getByText("Add Column", { selector: "button" }));

  expect(onClose).toHaveBeenCalled();
  const columns = useZustand.getState().columns;
  expect(Object.values(columns)).toHaveLength(1);
  const columnId = Object.keys(columns)[0];
  expect(columns[columnId]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Columns Result",
  );

  tearDownDialog();
});

it("should focus on the input component and submit when 'Enter' is pressed", async () => {
  const { onClose } = setupDialog();
  const textbox = screen.getByRole("textbox");

  expect(textbox).toHaveFocus();
  await userEvent.type(textbox, "My new column 2{enter}");
  expect(onClose).toHaveBeenCalled();
  const columns = useZustand.getState().columns;
  expect(Object.values(columns)).toHaveLength(1);
  const columnId = Object.keys(columns)[0];
  expect(columns[columnId]).toMatchSnapshot(
    {
      id: expect.any(String),
    },
    "Columns Result",
  );

  tearDownDialog();
})

