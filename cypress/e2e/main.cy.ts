describe("Main", () => {
  beforeEach(() => {
    cy.task("resetDB");
    cy.task("seedDB");
    cy.visit("/");
  });
});
