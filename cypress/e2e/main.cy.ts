describe("Main", () => {
  beforeEach(() => {
    cy.task("resetDB");
    cy.task("seedDB");
    cy.task("setTestUser");
  });

  it("should stay on the main page if there is a user in the cookies", async () => {
    const dummyEmail = `test1@example.com`;
    cy.setCookie("userId", dummyEmail, { httpOnly: true })
      .visit("/")
      .url()
      .should("not.include", "/login");
  });
});
