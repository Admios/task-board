import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from ".";
import { generateOptions, verifyOptions } from "./serverActions";
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
    name: "Authorize Me",
  });
  await userEvent.click(loginButton);

  expect(generateOptions).toHaveBeenCalledWith(email);
  expect(startAuthentication).toHaveBeenCalled();
  expect(verifyOptions).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/");
});

it("should register", async () => {
  (generateOptions as jest.Mock).mockResolvedValueOnce({
    pubKeyCredParams: [],
  });
  render(<Login />);

  const email = "lorem@ipsum.com";
  const textBox = screen.getByRole("textbox", { name: "Email" });
  await userEvent.type(textBox, email);

  const signupButton = screen.getByRole("button", {
    name: "Authorize Me",
  });
  await userEvent.click(signupButton);

  expect(generateOptions).toHaveBeenCalledWith(email);
  expect(startRegistration).toHaveBeenCalled();
  expect(verifyOptions).toHaveBeenCalled();
  expect(push).toHaveBeenCalledWith("/");
});

it("should not login with empty email", async () => {
  render(<Login />);

  const loginButton = screen.getByRole("button", {
    name: "Authorize Me",
  });
  await userEvent.click(loginButton);

  expect(generateOptions).not.toHaveBeenCalled();
  expect(startAuthentication).not.toHaveBeenCalled();
  expect(verifyOptions).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();
});

it("should not login with invalid email", async () => {
  render(<Login />);

  const email = "lorem";
  const textBox = screen.getByRole("textbox", { name: "Email" });
  await userEvent.type(textBox, email);

  const loginButton = screen.getByRole("button", {
    name: "Authorize Me",
  });
  await userEvent.click(loginButton);

  expect(generateOptions).not.toHaveBeenCalled();
  expect(startAuthentication).not.toHaveBeenCalled();
  expect(verifyOptions).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();

  expect(screen.getByRole("alert")).toMatchSnapshot("Invalid Email Error");
});
