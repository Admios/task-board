import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from ".";
import { useRouter } from "next/navigation";

it("should render", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot("Default Home Page");
});

it("should open the AddColumnModal when button is pressed", async () => {
  const { container } = render(<Home />);

  // Click the button
  const button = screen
    .getAllByRole("button")
    .find((button) => button.textContent === "Add Column");
  if (!button) {
    throw new Error("Button not found");
  }
  expect(button).toBeInTheDocument();

  await userEvent.click(button);

  const modal = screen.getByRole("dialog");
  modal.setAttribute("style", ""); // This value has animation! We don't want that in our snapshot
  expect(modal).toMatchSnapshot("AddColumnModal");
});

it("should launch logout when button is pressed", async () => {
  const { push } = (useRouter as jest.Mock)();
  render(<Home />);

  // Click the button
  const button = screen
    .getAllByRole("button")
    .find((button) => button.textContent === "Logout");
  if (!button) {
    throw new Error("Button not found");
  }
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(push).toHaveBeenCalledWith("/login");
});
