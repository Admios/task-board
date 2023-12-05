describe("Login", () => {
  before(() => {
    cy.exec("npm run db:keyspace:create-test");
    cy.exec("npm run db:migrate-test");
  });

  beforeEach(() => {
    cy.task("resetDB");
    cy.task("seedDB");
  });

  it("should navigate to the about page when trying to enter the homepage without a user", () => {
    cy.visit("/")
      .url()
      .should("include", "/login")
      .get("h2")
      .contains("Login or Register");
  });
});
