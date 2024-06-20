const fs = require("fs");
const path = require("path");
const {JSDOM} = require("jsdom");

describe("index.html", () => {
  let dom;
  let document;

  // Load the HTML file before each test
  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../src/index.html"),
      "utf8"
    );
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  // Test for correct title
  it("has the correct title", () => {
    const title = document.querySelector("title");
    expect(title.textContent).toBe("Document");
  });

  // Test for presence of a login button
  it("has a login button", () => {
    const loginButton = document.querySelector(".login-btn");
    expect(loginButton).not.toBeNull();
  });

  // Test for correct brand name
  it("has the correct brand name", () => {
    const brandName = document.querySelector(".nav-bar-logo-container p");
    expect(brandName.textContent.trim()).toBe("SIMPLE BANK");
  });
  // Test for presence of a register button
  it("has a register button", () => {
    const registerButton = document.querySelector(".register-btn");
    expect(registerButton).not.toBeNull();
  });

  // Test for presence of navigation bar
  it("has a navigation bar", () => {
    const navBar = document.querySelector(".nav-bar");
    expect(navBar).not.toBeNull();
  });

  // Test for presence of main container
  it("has a main container", () => {
    const mainContainer = document.querySelector(".main-container");
    expect(mainContainer).not.toBeNull();
  });

  // Test for presence of content container
  it("has a content container", () => {
    const contentContainer = document.querySelector(".content-container");
    expect(contentContainer).not.toBeNull();
  });

  // Test for presence of badges
  it("has badges", () => {
    const badges = document.querySelectorAll(".box-content");
    expect(badges.length).toBeGreaterThan(0);
  });

  // Test for correct text in badges
  it("has correct text in badges", () => {
    const badgesText = Array.from(
      document.querySelectorAll(".badges-text")
    ).map((el) => el.textContent.trim());
    expect(badgesText).toEqual(["Savings", "Loans", "Transfers"]);
  });

  // Test that the login button links to the correct page
  it("login button links to the correct page", () => {
    const loginButtonLink = document.querySelector(".login-btn").parentElement;
    expect(loginButtonLink.getAttribute("href")).toBe("./auth/login.html");
  });

  // Test that the register button links to the correct page
  it("register button links to the correct page", () => {
    const registerButtonLink =
      document.querySelector(".register-btn").parentElement;
    expect(registerButtonLink.getAttribute("href")).toBe(
      "./auth/register.html"
    );
  });
});
