import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { TaskList } from "./TaskList";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./state";

jest.mock("./serverActions.ts");
jest.mock("./clearCookies.ts");

it("should launch login when button is pressed", async () => {
  const { push } = (useRouter as jest.Mock)();
  const { container } = render(<TaskList />);
  expect(container).toMatchSnapshot("Default Header");

  // Click the button
  const button = screen.getByRole("button", { name: "Login / Register" });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(push).toHaveBeenCalledWith("/login");
});

it("should launch logout when button is pressed", async () => {
  useZustand.setState({
    user: {
      username: "test",
      id: "test",
    },
  });

  const { push } = (useRouter as jest.Mock)();
  const { container } = render(<TaskList />);
  expect(container).toMatchSnapshot("Logged in Header");

  // Click the button
  const button = screen.getByRole("button", { name: "Logout" });
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(clearCookies).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/login");

  useZustand.setState({});
});
