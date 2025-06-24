/**
 * Salesforce Interactions
 * 
 * Provides Salesforce-specific locators and interaction methods
 */
const WebInteractions = require('../web/webInteractions');

class SalesforceInteractions extends WebInteractions {
  /**
   * Constructor
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {Object} options - Options for web interactions
   */
  constructor(page, options = {}) {
    super(page, options);
    
    // Common Salesforce locators
    this.locators = {
      // App navigation
      appLauncher: 'div.slds-icon-waffle',
      appSearchInput: 'input.slds-input',
      appTile: (name) => `a.slds-app-launcher__tile-body-title:text-is("${name}")`,
      
      // Common UI elements
      spinner: '//lightning-spinner',
      toast: {
        success: '//div[@data-key="success"]',
        error: '//div[@data-key="error"]',
        info: '//div[@data-key="info"]'
      },
      
      // Form elements
      lightningField: (label) => `lightning-input-field:has-text("${label}")`,
      lightningCombobox: 'lightning-combobox',
      lightningButton: (label) => `button:has-text("${label}")`,
      
      // Record page elements
      saveButton: '//button[@name="SaveEdit"]',
      cancelButton: '//button[@name="CancelEdit"]',
      
      // List view elements
      newButton: (objectName) => `//li[@data-target-selection-name='sfdc:StandardButton.${objectName}.New']`,
      
      // From salesforce_actions.resource
      metadataImportExportPage: '/lightning/n/agentsync__Metadata_Import_Export',
      csvImport: '/lightning/n/agentsync__Agent_CSV_Import',
      saveAndEditButton: '//button[@name="SaveEdit"]',
      newContactButton: '//li[@data-target-selection-name="sfdc:StandardButton.Contact.NewContact"]',
      lastNameInputField: '//input[@name="lastName"]',
      npnInputField: '//input[@name="agentsync__NPN__c"]',
      nameInputField: '//input[@name="Name"]',
      relatedAccountInputField: '//input[@class="slds-combobox__input slds-input" and @placeholder="Search Accounts..."]',
      saveEditButton: '//button[@name="SaveEdit"]',
      newAccountButton: '//li[@data-target-selection-name="sfdc:StandardButton.Account.New"]',
      contactsList: '/lightning/o/Contact/list?filterName=__Recent',
      
      // User management locators
      manageUsersUrl: '/lightning/setup/ManageUsers/home',
      targetUserLink: (firstName, lastName) => `iframe >>> //a[normalize-space()='${lastName}, ${firstName}']`,
      userEditButton: 'iframe >>> //td[@id="topButtonRow"]//input[@title="Edit"]',
      userActiveCheckbox: 'iframe >>> //input[@id="active"]',
      userNpnInputField: 'iframe >>> //label[text()="NPN"]/parent::td/following-sibling::td/input',
      userUsernameInputField: 'iframe >>> //input[@id="Username"]',
      userSaveButton: 'iframe >>> //div[@class="pbHeader"]//input[@name="save"]',
      userFirstNameField: 'iframe >>> //input[@id="name_firstName"]',
      userLastNameField: 'iframe >>> //input[@id="name_lastName"]',
      userEmailField: 'iframe >>> //input[@id="Email"]',
      userNewButton: 'iframe >>> //div[@class="pbHeader"]//input[@name="new"]',
      userLicenseIdField: 'iframe >>> (//select[@name="user_license_id"])',
      userProfileField: 'iframe >>> (//label[@for="Profile"])',
      userProfileSelection: 'iframe >>> //select[@name="Profile"]',
      userDeactivationOkButton: 'iframe >>> //input[@id="simpleDialog0button0"]',
      
      // GWBR locators
      gwbrCombobox: '//agentsync-metadata-import-export//lightning-combobox//button[@name="metadata"]',
      gwbrComboboxDataValue: (dataValue) => `//agentsync-metadata-import-export//lightning-base-combobox-item[@data-value="${dataValue}"]`,
      
      // App change locators
      appAgentsyncTitle: '//span[@title="AgentSync"]',
      appChangeWaffleIcon: '//div[@class="slds-icon-waffle"]',
      searchAppItemsPlaceholder: '//input[@placeholder="Search apps and items..."]',
      appOptionsLabel: (appName) => `a[role="option"][data-label="${appName}"]`,
      appTitleLabel: (appName) => `//span[@class="slds-truncate" and @title="${appName}"]`
    };
  }

  /**
   * Navigate to a Salesforce tab
   * @param {string} tabName - Tab name
   * @returns {Promise<void>}
   */
  async navigateToTab(tabName) {
bnbnbnsxjsxjashxjaxhajxhasjhxjsgchjsgjshdgcjsgcjdsgcsjcgkcgkdchdskchjdhqjshjhwhh      // Click on App Launcher
      await this.click(this.locators.appLauncher);
      
      // Wait for App Launcher to open
      await this.waitForElement(this.locators.appSearchInput);
      
      // Search for the tab
      await this.fill(this.locators.appSearchInput, tabName);
      
      // Wait for search results
      await this.page.waitForTimeout(1000);
      
      // Click on the tab
      await this.click(this.locators.appTile(tabName));
      
      // Wait for navigation
      await this.waitForNavigation();
    } catch (error) {
      throw new Error(`Error navigating to ${tabName} tab: ${error.message}`);
    }
  }

  /**
   * Fill a Lightning form field
   * @param {string} fieldLabel - Field label
   * @param {string} value - Field value
   * @returns {Promise<void>}
   */
  async fillLightningField(fieldLabel, value) {
    try {
      // Find the field by label
      const fieldLocator = this.locators.lightningField(fieldLabel);
      const fieldContainer = await this.page.locator(fieldLocator).first();
      
      // Fill the field based on its type
      const isCombobox = await fieldContainer.locator('lightning-combobox').count() > 0;
      const isTextarea = await fieldContainer.locator('textarea').count() > 0;
      const isCheckbox = await fieldContainer.locator('input[type="checkbox"]').count() > 0;
      
      if (isCombobox) {
        await fieldContainer.click();
        await this.page.waitForTimeout(500);
        await this.click(`lightning-base-combobox-item:has-text("${value}")`);
      } else if (isTextarea) {
        await fieldContainer.locator('textarea').fill(value);
      } else if (isCheckbox) {
        const isChecked = await fieldContainer.locator('input[type="checkbox"]').isChecked();
        if ((value === true && !isChecked) || (value === false && isChecked)) {
          await fieldContainer.click();
        }
      } else {
        await fieldContainer.locator('input').fill(value);
      }
    } catch (error) {
      throw new Error(`Failed to fill ${fieldLabel}: ${error.message}`);
    }
  }

  /**
   * Wait for Salesforce spinner to disappear
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForSpinner(timeout = this.defaultTimeout) {
    const spinnerExists = await this.isVisible(this.locators.spinner);
    
    if (spinnerExists) {
      // Wait for spinner to be visible (in case it's just appearing)
      await this.waitForElement(this.locators.spinner, 1000).catch(() => {});
      
      // Then wait for it to disappear
      await this.page.waitForSelector(this.locators.spinner, { 
        state: 'hidden',
        timeout 
      });
    }
  }

  /**
   * Wait for toast notification
   * @param {string} type - Toast type: 'success', 'error', or 'info'
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} Whether toast appeared
   */
  async waitForToast(type = 'success', timeout = 5000) {
    try {
      await this.waitForElement(this.locators.toast[type], timeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Click a button in Salesforce Lightning
   * @param {string} buttonLabel - Button label
   * @returns {Promise<void>}
   */
  async clickButton(buttonLabel) {
    await this.click(this.locators.lightningButton(buttonLabel));
  }

  /**
   * Click save button on record edit page
   * @returns {Promise<void>}
   */
  async clickSave() {
    await this.click(this.locators.saveButton);
    await this.waitForSpinner();
  }

  /**
   * Click new button for an object
   * @param {string} objectName - API name of the object (e.g., 'Account', 'Contact')
   * @returns {Promise<void>}
   */
  async clickNew(objectName) {
    await this.click(this.locators.newButton(objectName));
    await this.waitForSpinner();
  }

  /**
   * Create a contact record with related account
   * @param {string} lastName - Last name
   * @param {string} npn - NPN value
   * @param {string} relatedAccount - Related account name
   * @returns {Promise<void>}
   */
  async createContactWithRelatedAccount(lastName, npn, relatedAccount) {
    await this.page.goto(this.locators.contactsList);
    await this.click(this.locators.newContactButton);
    await this.fill(this.locators.lastNameInputField, lastName);
    await this.fill(this.locators.npnInputField, npn);
    await this.click(this.locators.relatedAccountInputField);
    await this.fill(this.locators.relatedAccountInputField, relatedAccount);
    await this.click(`//input[@data-value="${relatedAccount}"]`);
    await this.click(`//lightning-base-combobox-formatted-text[@title="${relatedAccount}"]`);
    await this.click(this.locators.saveEditButton);
  }

  /**
   * Create an account record
   * @param {string} accountName - Account name
   * @param {string} npn - NPN value
   * @returns {Promise<void>}
   */
  async createAccountRecord(accountName, npn) {
    await this.page.goto('/lightning/o/Account/list?filterName=__Recent');
    await this.click(this.locators.newAccountButton);
    await this.fill(this.locators.nameInputField, accountName);
    await this.fill(this.locators.npnInputField, npn);
    await this.click(this.locators.saveEditButton);
  }

  /**
   * Create a user record
   * @param {Object} userDetails - User details object with FirstName, LastName, Email, NPN
   * @returns {Promise<void>}
   */
  async createUserRecord(userDetails) {
    await this.page.goto(this.locators.manageUsersUrl);
    await this.waitForElement(this.locators.userNewButton);
    await this.click(this.locators.userNewButton);
    await this.waitForElement(this.locators.userFirstNameField);
    await this.fill(this.locators.userFirstNameField, userDetails.FirstName);
    await this.fill(this.locators.userLastNameField, userDetails.LastName);
    await this.fill(this.locators.userEmailField, userDetails.Email);
    await this.click(this.locators.userUsernameInputField);
    await this.fill(this.locators.userNpnInputField, userDetails.NPN);
    await this.click(this.locators.userSaveButton);
  }

  /**
   * Deactivate a user record
   * @param {Object} userDetails - User details object with FirstName, LastName
   * @param {string} invalidUsername - New username to set
   * @returns {Promise<void>}
   */
  async deactivateUserRecord(userDetails, invalidUsername) {
    await this.page.goto(this.locators.manageUsersUrl);
    await this.click(this.locators.targetUserLink(userDetails.FirstName, userDetails.LastName));
    await this.click(this.locators.userEditButton);
    await this.fill(this.locators.userNpnInputField, '');
    await this.fill(this.locators.userUsernameInputField, invalidUsername);
    await this.click(this.locators.userActiveCheckbox);
    await this.click(this.locators.userDeactivationOkButton);
    await this.click(this.locators.userSaveButton);
  }

  /**
   * Change Salesforce app
   * @param {string} appName - App name
   * @returns {Promise<void>}
   */
  async changeSalesforceApp(appName) {
    const isOnApp = await this.isVisible(this.locators.appAgentsyncTitle);
    
    if (!isOnApp) {
      await this.waitForElement(this.locators.appChangeWaffleIcon);
      await this.click(this.locators.appChangeWaffleIcon);
      await this.waitForElement(this.locators.searchAppItemsPlaceholder);
      await this.fill(this.locators.searchAppItemsPlaceholder, appName);
      await this.click(this.locators.appOptionsLabel(appName));
      await this.waitForElement(this.locators.appTitleLabel(appName), 30000);
    }
  }
}

module.exports = SalesforceInteractions;