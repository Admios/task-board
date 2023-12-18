describe("Login", () => {
  it("should navigate to the about page when trying to enter the homepage without a user", () => {
    cy.visit("/")
      .url()
      .should("include", "/login")
      .get(".card-header-title")
      .contains("Login or Register");
  });
});
