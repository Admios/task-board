import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { Navbar } from ".";
import { clearCookies } from "./clearCookies";

jest.mock("./clearCookies.ts");

it("should show login when there is no user", async () => {
  const { push } = (useRouter as jest.Mock)();
  const { container } = render(<Navbar navbarItems={[]} />);
  expect(container).toMatchSnapshot("Default Header");

  // Click the button
  const button = await screen.findByText("Login");

  expect(button).toBeInTheDocument();
});

it("should launch logout when button is pressed", async () => {
  const { container } = render(
    <Navbar user={{ email: "test" }} navbarItems={[]} />,
  );
  expect(container).toMatchSnapshot("Logged in Header");

  // Click the button
  const button = await screen.findByText("Logout");
  expect(button).toBeInTheDocument();

  await userEvent.click(button);
  expect(clearCookies).toHaveBeenCalled();
});
