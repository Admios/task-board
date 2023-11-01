describe("Main", () => {
  beforeEach(() => {
    cy.task("resetDB");
    cy.task("seedDB");
    cy.task("setTestUser");
  });

  it("should stay on the main page if there is a user in the cookies", async () => {
    cy.fixture("users.json").then((users) => {
      cy.setCookie("userId", users[0].email, { httpOnly: true })
        .visit("/")
        .url()
        .should("not.include", "/login");
    });
  });
});
