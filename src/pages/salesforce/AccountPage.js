// @ts-check
const BaseSalesforcePage = require('./BaseSalesforcePage');

/**
 * Page object for Salesforce Account page
 */
class AccountPage extends BaseSalesforcePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    
    // App launcher navigation
    this.appLauncherButton = page.getByRole('button', { name: 'App Launcher' });
    this.appSearchInput = page.getByRole('combobox', { name: 'Search apps and items...' });
    this.accountsOption = page.getByRole('option', { name: 'Accounts' });
    
    // Account creation
    this.newButton = page.getByRole('button', { name: 'New' });
    this.accountNameInput = page.getByRole('textbox', { name: '*Account Name' });
    this.ratingDropdown = page.getByRole('combobox', { name: 'Rating' });
    this.parentAccountInput = page.getByRole('combobox', { name: 'Parent Account' });
    this.accountNumberInput = page.getByRole('textbox', { name: 'Account Number' });
    this.typeDropdown = page.getByRole('combobox', { name: 'Type' });
    this.ownershipDropdown = page.getByRole('combobox', { name: 'Ownership' });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    
    // Account view
    this.accountLink = name => page.getByRole('link', { name });
    this.contactsTab = page.getByRole('link', { name: 'Contacts', exact: true });
  }

  /**
   * Navigate to Accounts via App Launcher
   */
  async navigateToAccounts() {
    await this.appLauncherButton.click();
    await this.appSearchInput.fill('account');
    await this.accountsOption.click();
    await this.waitForPageLoad();
  }

  /**
   * Create a new account with the given details
   * @param {Object} accountData - Account data
   * @param {string} accountData.name - Account name
   * @param {string} [accountData.rating] - Account rating
   * @param {string} [accountData.parentAccount] - Parent account name
   * @param {string} [accountData.accountNumber] - Account number
   * @param {string} [accountData.type] - Account type
   * @param {string} [accountData.ownership] - Account ownership
   * @returns {Promise<void>}
   */
  async createAccount(accountData) {
    // Click New button
    await this.newButton.click();
    await this.waitForPageLoad();
    
    // Fill account name
    await this.accountNameInput.fill(accountData.name);
    
    // Select rating if provided
    if (accountData.rating) {
      await this.ratingDropdown.click();
      await this.page.getByText(accountData.rating).click();
    }
    
    // Select parent account if provided
    if (accountData.parentAccount) {
      await this.parentAccountInput.click();
      await this.page.getByRole('option', { name: accountData.parentAccount }).locator('span').nth(2).click();
    }
    
    // Fill account number if provided
    if (accountData.accountNumber) {
      await this.accountNumberInput.fill(accountData.accountNumber);
    }
    
    // Select type if provided
    if (accountData.type) {
      await this.typeDropdown.click();
      await this.page.getByRole('option', { name: accountData.type }).locator('span').nth(1).click();
    }
    
    // Select ownership if provided
    if (accountData.ownership) {
      await this.ownershipDropdown.click();
      await this.page.getByText(accountData.ownership).click();
    }
    
    // Save the account
    await this.saveButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Navigate to the contacts tab of an account
   * @param {string} accountName - Name of the account
   */
  async navigateToAccountContacts(accountName) {
    await this.accountLink(accountName).click();
    await this.waitForPageLoad();
    await this.contactsTab.click();
    await this.waitForPageLoad();
  }

  /**
   * Verify account was created successfully
   * @returns {Promise<boolean>} True if success message is visible
   */
  async verifyAccountCreated() {
    const toast = this.page.locator('.slds-notify__content');
    return await toast.isVisible();
  }
}

module.exports = AccountPage;