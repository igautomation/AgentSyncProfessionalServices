const { BasePage } = require('@igautomation/agentsyncprofessionalservices/pages');

class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    this.newButton = page.locator('a[title="New"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.emailInput = page.locator('input[name="Email"]');
    this.saveButton = page.locator('button[name="SaveEdit"]');
    this.toastMessage = page.locator('.toastMessage');
  }

  async createContact(firstName, lastName, email) {
    await this.newButton.click();
    await this.lastNameInput.fill(lastName);
    await this.firstNameInput.fill(firstName);
    await this.emailInput.fill(email);
    await this.saveButton.click();
    return this.toastMessage;
  }
}

module.exports = ContactPage;