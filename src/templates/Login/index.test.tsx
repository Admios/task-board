import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from ".";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthentication,
  verifyRegistration,
} from "./serverActions";
import { useRouter } from "next/navigation";

jest.mock("./serverActions.ts");
jest.mock("@simplewebauthn/browser");
const { push } = (useRouter as jest.Mock)();

afterEach(() => {
  jest.clearAllMocks();
});

it("should render", () => {
  const { container } = render(<Login />);
  expect(container).toMatchSnapshot("Default Login Page");
});

it("should login", async () => {
  render(<Login />);

  const email = "lorem@ipsum.com";
  const textBox = screen.getByRole("textbox", { name: "Email" });
  await userEvent.type(textBox, email);

  const loginButton = screen.getByRole("button", {
    name: "Login (Existing User)",
  });
  await userEvent.click(loginButton);

  expect(generateAuthenticationOptions).toHaveBeenCalledWith(email);
  expect(startAuthentication).toHaveBeenCalled();
  expect(verifyAuthentication).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/");
});

it("should login", async () => {
  render(<Login />);

  const email = "lorem@ipsum.com";
  const textBox = screen.getByRole("textbox", { name: "Email" });
  await userEvent.type(textBox, email);

  const signupButton = screen.getByRole("button", {
    name: "Register (New User)",
  });
  await userEvent.click(signupButton);

  expect(generateRegistrationOptions).toHaveBeenCalledWith(email);
  expect(startRegistration).toHaveBeenCalled();
  expect(verifyRegistration).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/");
});

it("should not login with empty email", async () => {
  render(<Login />);

  const loginButton = screen.getByRole("button", {
    name: "Login (Existing User)",
  });
  await userEvent.click(loginButton);

  expect(generateAuthenticationOptions).not.toHaveBeenCalled();
  expect(startAuthentication).not.toHaveBeenCalled();
  expect(verifyAuthentication).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();
});

it("should not login with invalid email", async () => {
  render(<Login />);

  const email = "lorem";
  const textBox = screen.getByRole("textbox", { name: "Email" });
  await userEvent.type(textBox, email);

  const loginButton = screen.getByRole("button", {
    name: "Login (Existing User)",
  });
  await userEvent.click(loginButton);

  expect(generateAuthenticationOptions).not.toHaveBeenCalled();
  expect(startAuthentication).not.toHaveBeenCalled();
  expect(verifyAuthentication).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();

  expect(screen.getByRole("alert")).toMatchSnapshot("Invalid Email Error");
});
