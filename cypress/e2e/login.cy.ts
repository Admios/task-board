import { UserRepository } from "@/model/User";

const userRepository = new UserRepository();

describe("Login", () => {
  beforeEach(() => {
    cy.task("resetDB");
    cy.task("seedDB");
  });

  it("should navigate to the about page when trying to enter the homepage without a user", () => {
    cy.visit("/");
    cy.url().should("include", "/login");
    cy.get("h2").contains("Login or Register");
  });
});
