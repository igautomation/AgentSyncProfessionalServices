/**
 * Salesforce Interactions
 * 
 * Provides Salesforce-specific locators and interaction methods with built-in validations
 */
const WebInteractions = require('../web/webInteractions');
const logger = require('../common/logger');
const RetryWithBackoff = require('../common/retryWithBackoff');
const path = require('path');
const fs = require('fs');

class SalesforceInteractions extends WebInteractions {
  /**
   * Constructor
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @param {Object} options - Options for web interactions
   */
  constructor(page, options = {}) {
    super(page, options);
    
    this.retryOptions = {
      maxRetries: options.maxRetries || 3,
      initialDelay: options.initialDelay || 1000,
      backoffFactor: options.backoffFactor || 2
    };
    
    // Organization-specific configuration
    this.orgConfig = {
      // Lightning Experience vs Classic
      isLightningExperience: options.isLightningExperience !== false,
      // Custom domain for org
      domain: options.domain || '',
      // Default timeout for org-specific operations
      timeout: options.timeout || 30000,
      // Custom field mappings for non-standard fields
      fieldMappings: options.fieldMappings || {},
      // Custom object prefixes
      objectPrefixes: options.objectPrefixes || {}
    };
    
    // Standard Salesforce objects
    this.standardObjects = {
      account: {
        apiName: 'Account',
        listView: '/lightning/o/Account/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Account.New"]',
        nameField: '//input[@name="Name"]'
      },
      contact: {
        apiName: 'Contact',
        listView: '/lightning/o/Contact/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Contact.NewContact"]',
        nameField: '//input[@name="lastName"]'
      },
      lead: {
        apiName: 'Lead',
        listView: '/lightning/o/Lead/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Lead.New"]',
        nameField: '//input[@name="lastName"]'
      },
      opportunity: {
        apiName: 'Opportunity',
        listView: '/lightning/o/Opportunity/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Opportunity.New"]',
        nameField: '//input[@name="Name"]'
      },
      case: {
        apiName: 'Case',
        listView: '/lightning/o/Case/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Case.New"]',
        nameField: '//input[@name="Subject"]'
      },
      task: {
        apiName: 'Task',
        listView: '/lightning/o/Task/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Task.New"]',
        nameField: '//input[@name="Subject"]'
      },
      event: {
        apiName: 'Event',
        listView: '/lightning/o/Event/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Event.New"]',
        nameField: '//input[@name="Subject"]'
      },
      campaign: {
        apiName: 'Campaign',
        listView: '/lightning/o/Campaign/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Campaign.New"]',
        nameField: '//input[@name="Name"]'
      },
      product: {
        apiName: 'Product2',
        listView: '/lightning/o/Product2/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Product2.New"]',
        nameField: '//input[@name="Name"]'
      },
      pricebook: {
        apiName: 'Pricebook2',
        listView: '/lightning/o/Pricebook2/list',
        newButton: '//li[@data-target-selection-name="sfdc:StandardButton.Pricebook2.New"]',
        nameField: '//input[@name="Name"]'
      },
      user: {
        apiName: 'User',
        listView: '/lightning/setup/ManageUsers/home',
        newButton: 'iframe >>> //div[@class="pbHeader"]//input[@name="new"]',
        nameField: 'iframe >>> //input[@id="name_firstName"]'
      }
    };
    
    // Custom objects can be added at runtime
    this.customObjects = {};
    
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
      inputField: (name) => `//input[@name="${name}"]`,
      textareaField: (name) => `//textarea[@name="${name}"]`,
      checkboxField: (name) => `//input[@type="checkbox" and @name="${name}"]`,
      radioField: (name, value) => `//input[@type="radio" and @name="${name}" and @value="${value}"]`,
      selectField: (name) => `//select[@name="${name}"]`,
      selectOption: (name, value) => `//select[@name="${name}"]/option[@value="${value}"]`,
      lookupField: (label) => `//label[text()="${label}"]/following-sibling::div//input[contains(@class,"default")]`,
      lookupResult: (text) => `//div[contains(@class,"lookup")]//span[text()="${text}"]`,
      
      // Record page elements
      saveButton: '//button[@name="SaveEdit"]',
      cancelButton: '//button[@name="CancelEdit"]',
      editButton: '//button[@name="Edit"]',
      deleteButton: '//button[@name="Delete"]',
      cloneButton: '//button[@name="Clone"]',
      shareButton: '//button[@name="Share"]',
      followButton: '//button[contains(@class,"follow-button")]',
      printButton: '//button[@name="PrintableView"]',
      
      // Record detail elements
      recordHeader: '//div[contains(@class,"slds-page-header")]',
      recordTitle: '//div[contains(@class,"slds-page-header")]//h1',
      recordSubtitle: '//div[contains(@class,"slds-page-header")]//h2',
      recordTabs: '//ul[contains(@class,"slds-tabs_default__nav")]',
      recordTab: (name) => `//ul[contains(@class,"slds-tabs_default__nav")]//a[text()="${name}"]`,
      recordField: (label) => `//div[contains(@class,"slds-form-element")][.//span[text()="${label}"]]`,
      recordFieldValue: (label) => `//div[contains(@class,"slds-form-element")][.//span[text()="${label}"]]//span[contains(@class,"field-value")]`,
      
      // List view elements
      newButton: (objectName) => `//li[@data-target-selection-name='sfdc:StandardButton.${objectName}.New']`,
      listViewControls: '//div[contains(@class,"slds-grid")][contains(@class,"forceListViewManagerHeader")]',
      listViewSearchBox: '//input[contains(@class,"search-text-field")]',
      listViewRefreshButton: '//button[contains(@class,"refresh-button")]',
      listViewFilterButton: '//button[contains(@class,"filter-button")]',
      listViewSettingsButton: '//button[contains(@class,"settings-button")]',
      listViewTable: '//table[contains(@class,"slds-table")]',
      listViewRow: (index) => `//table[contains(@class,"slds-table")]//tbody/tr[${index}]`,
      listViewCell: (row, col) => `//table[contains(@class,"slds-table")]//tbody/tr[${row}]/td[${col}]`,
      listViewCheckbox: (row) => `//table[contains(@class,"slds-table")]//tbody/tr[${row}]//input[@type="checkbox"]`,
      listViewSelectAll: '//table[contains(@class,"slds-table")]//thead//input[@type="checkbox"]',
      listViewRowAction: (row) => `//table[contains(@class,"slds-table")]//tbody/tr[${row}]//button[contains(@class,"row-action-button")]`,
      
      // Modal dialogs
      modal: '//section[contains(@class,"slds-modal")]',
      modalHeader: '//section[contains(@class,"slds-modal")]//h2',
      modalContent: '//section[contains(@class,"slds-modal")]//div[contains(@class,"slds-modal__content")]',
      modalFooter: '//section[contains(@class,"slds-modal")]//div[contains(@class,"slds-modal__footer")]',
      modalSaveButton: '//section[contains(@class,"slds-modal")]//button[text()="Save"]',
      modalCancelButton: '//section[contains(@class,"slds-modal")]//button[text()="Cancel"]',
      modalCloseButton: '//section[contains(@class,"slds-modal")]//button[contains(@class,"slds-modal__close")]',
      
      // Global header
      globalSearch: '//input[@placeholder="Search..."]',
      globalSearchButton: '//button[@aria-label="Search"]',
      notificationsButton: '//button[contains(@class,"notifications-button")]',
      setupMenu: '//button[contains(@class,"setup-button")]',
      userMenu: '//button[contains(@class,"userProfile-button")]',
      
      // Setup menu
      setupMenuItem: (name) => `//a[contains(@class,"setup-item")][.//span[text()="${name}"]]`,
      setupTree: '//div[contains(@class,"slds-tree")]',
      setupTreeItem: (name) => `//div[contains(@class,"slds-tree")]//span[text()="${name}"]`,
      
      // Lightning components
      lightningCard: '//article[contains(@class,"slds-card")]',
      lightningCardTitle: (title) => `//article[contains(@class,"slds-card")][.//span[text()="${title}"]]`,
      lightningTab: (label) => `//lightning-tab[.//span[text()="${label}"]]`,
      lightningAccordion: '//lightning-accordion',
      lightningAccordionSection: (label) => `//lightning-accordion-section[.//span[text()="${label}"]]`,
      lightningDatatable: '//lightning-datatable',
      lightningDatatableRow: (index) => `//lightning-datatable//tbody/tr[${index}]`,
      lightningDatatableCell: (row, col) => `//lightning-datatable//tbody/tr[${row}]/td[${col}]`,
      
      // Related lists
      relatedList: (name) => `//article[contains(@class,"related-list")][.//span[text()="${name}"]]`,
      relatedListViewAll: (name) => `//article[contains(@class,"related-list")][.//span[text()="${name}"]]//a[text()="View All"]`,
      relatedListNewButton: (name) => `//article[contains(@class,"related-list")][.//span[text()="${name}"]]//button[text()="New"]`,
      
      // Path component
      path: '//div[contains(@class,"slds-path")]',
      pathItem: (name) => `//div[contains(@class,"slds-path")]//span[text()="${name}"]`,
      pathMarkComplete: '//button[text()="Mark Complete"]',
      pathMarkCurrent: '//button[text()="Mark as Current Stage"]',
      
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
      appTitleLabel: (appName) => `//span[@class="slds-truncate" and @title="${appName}"]`,
      
      // Record view locators
      recordName: '//div[contains(@class, "slds-page-header")]//lightning-formatted-text',
      relatedListViewAll: (relatedListName) => `//span[text()="${relatedListName}"]/ancestor::div[contains(@class, "slds-card")]//a[text()="View All"]`,
      
      // Lightning datatable
      datatable: '//lightning-datatable',
      datatableRow: (index) => `//lightning-datatable//tr[${index + 1}]`,
      datatableCell: (rowIndex, colIndex) => `//lightning-datatable//tr[${rowIndex + 1}]//td[${colIndex + 1}]`,
      
      // Global search
      searchResultItem: (text) => `//div[contains(@class, "searchResultItem")]//span[contains(text(), "${text}")]`,
      
      // Chatter
      chatterFeed: '//div[contains(@class,"slds-feed")]',
      chatterPost: '//div[contains(@class,"slds-post")]',
      chatterPublisher: '//div[contains(@class,"slds-publisher")]',
      chatterTextarea: '//div[contains(@class,"slds-publisher")]//textarea',
      chatterShareButton: '//div[contains(@class,"slds-publisher")]//button[text()="Share"]',
      chatterLikeButton: '//button[contains(@class,"like-action")]',
      chatterCommentButton: '//button[contains(@class,"comment-action")]',
      
      // Reports & Dashboards
      reportRunButton: '//button[text()="Run Report"]',
      reportSaveButton: '//button[text()="Save"]',
      reportExportButton: '//button[text()="Export"]',
      reportSubscribeButton: '//button[text()="Subscribe"]',
      dashboardRefreshButton: '//button[contains(@class,"refresh-button")]',
      dashboardEditButton: '//button[text()="Edit"]',
      dashboardComponentEdit: (title) => `//article[contains(@class,"dashboard-component")][.//span[text()="${title}"]]//button[contains(@class,"edit-button")]`,
      
      // Files
      filesUploadButton: '//button[text()="Upload Files"]',
      filesTable: '//table[contains(@class,"files-list")]',
      fileRow: (name) => `//table[contains(@class,"files-list")]//a[text()="${name}"]`,
      filePreview: '//div[contains(@class,"file-preview")]',
      fileDownloadButton: '//button[text()="Download"]',
      
      // Calendar
      calendarView: '//div[contains(@class,"calendar")]',
      calendarEvent: (title) => `//div[contains(@class,"calendar-event")][.//span[text()="${title}"]]`,
      calendarNewEventButton: '//button[text()="New Event"]',
      calendarTodayButton: '//button[text()="Today"]',
      calendarPrevButton: '//button[contains(@class,"calendar-prev")]',
      calendarNextButton: '//button[contains(@class,"calendar-next")]',
      
      // Utility bar
      utilityBar: '//footer[contains(@class,"utility-bar")]',
      utilityBarItem: (label) => `//footer[contains(@class,"utility-bar")]//button[.//span[text()="${label}"]]`,
      utilityPanel: '//div[contains(@class,"utility-panel")]',
      
      // Salesforce Mobile App Simulator
      mobileHeader: '//header[contains(@class,"mobile-header")]',
      mobileNavMenu: '//button[contains(@class,"mobile-nav-menu")]',
      mobileNavItem: (label) => `//div[contains(@class,"mobile-nav")]//span[text()="${label}"]`,
      
      // Lightning Experience Switcher
      classicSwitcher: '//a[contains(@class,"switch-to-classic")]',
      
      // Visualforce
      visualforceFrame: '//iframe[contains(@title,"visualforce")]',
      
      // Lightning Web Components
      lightningWebComponent: (tagName) => `//${tagName}`,
      
      // Salesforce Console
      consoleTab: (label) => `//li[contains(@class,"tabItem")][.//span[text()="${label}"]]`,
      consoleTabClose: (label) => `//li[contains(@class,"tabItem")][.//span[text()="${label}"]]//button[contains(@class,"close")]`,
      consoleSplit: '//div[contains(@class,"splitView")]',
      consoleUtilityBar: '//div[contains(@class,"utilityBar")]',
      consoleUtilityItem: (label) => `//div[contains(@class,"utilityBar")]//button[.//span[text()="${label}"]]`
    };
  }

  /**
   * Register a custom Salesforce object
   * @param {string} objectKey - Key to use for the object
   * @param {Object} objectConfig - Object configuration
   * @param {string} objectConfig.apiName - API name of the object
   * @param {string} objectConfig.listView - URL path to the list view
   * @param {string} objectConfig.newButton - XPath to the new button
   * @param {string} objectConfig.nameField - XPath to the name field
   */
  registerCustomObject(objectKey, objectConfig) {
    logger.info(`Registering custom object: ${objectKey} with API name: ${objectConfig.apiName}`);
    this.customObjects[objectKey] = objectConfig;
  }

  /**
   * Get object configuration by key
   * @param {string} objectKey - Object key
   * @returns {Object} Object configuration
   */
  getObjectConfig(objectKey) {
    // Check if it's a standard object
    if (this.standardObjects[objectKey]) {
      return this.standardObjects[objectKey];
    }
    
    // Check if it's a custom object
    if (this.customObjects[objectKey]) {
      return this.customObjects[objectKey];
    }
    
    throw new Error(`Object configuration not found for key: ${objectKey}`);
  }

  /**
   * Navigate to a Salesforce tab with retry
   * @param {string} tabName - Tab name
   * @returns {Promise<void>}
   */
  async navigateToTab(tabName) {
    const retry = new RetryWithBackoff(this.retryOptions);
    
    await retry.execute(async () => {
      logger.info(`Navigating to ${tabName} tab`);
      
      // Click on App Launcher
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
      
      // Verify navigation was successful
      await this.waitForSpinner();
      
      // Check if we're on the right page
      const url = this.page.url();
      if (!url.includes(tabName.toLowerCase())) {
        throw new Error(`Navigation to ${tabName} failed. Current URL: ${url}`);
      }
    });
  }

  /**
   * Navigate to object list view
   * @param {string} objectKey - Object key
   * @param {string} [filterName] - Optional filter name
   * @returns {Promise<void>}
   */
  async navigateToObjectList(objectKey, filterName = '__Recent') {
    const retry = new RetryWithBackoff(this.retryOptions);
    
    await retry.execute(async () => {
      const objectConfig = this.getObjectConfig(objectKey);
      let listViewUrl = objectConfig.listView;
      
      // Add filter if not already in URL
      if (!listViewUrl.includes('filterName=') && !listViewUrl.includes('ManageUsers')) {
        listViewUrl += `?filterName=${filterName}`;
      }
      
      logger.info(`Navigating to ${objectKey} list view: ${listViewUrl}`);
      await this.page.goto(listViewUrl);
      await this.waitForSpinner();
    });
  }

  /**
   * Wait for Salesforce spinner to disappear
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForSpinner(timeout = this.defaultTimeout) {
    const spinnerExists = await this.isVisible(this.locators.spinner);
    
    if (spinnerExists) {
      logger.info('Waiting for spinner to disappear');
      
      // Wait for spinner to be visible (in case it's just appearing)
      await this.waitForElement(this.locators.spinner, 1000).catch(() => {});
      
      // Then wait for it to disappear
      await this.page.waitForSelector(this.locators.spinner, { 
        state: 'hidden',
        timeout 
      });
      
      logger.info('Spinner disappeared');
    }
  }

  /**
   * Wait for toast notification with validation
   * @param {string} type - Toast type: 'success', 'error', or 'info'
   * @param {string} [expectedMessage] - Expected message text (optional)
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<boolean>} Whether toast appeared with expected message
   */
  async waitForToast(type = 'success', expectedMessage = null, timeout = 5000) {
    try {
      logger.info(`Waiting for ${type} toast notification`);
      
      const toastLocator = this.locators.toast[type];
      await this.waitForElement(toastLocator, timeout);
      
      // If expected message is provided, verify it
      if (expectedMessage) {
        const toastText = await this.getText(toastLocator);
        if (!toastText.includes(expectedMessage)) {
          logger.warn(`Toast message "${toastText}" does not contain expected text "${expectedMessage}"`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      logger.warn(`Toast notification of type ${type} did not appear: ${error.message}`);
      return false;
    }
  }

  /**
   * Create a new record for any object
   * @param {string} objectKey - Object key
   * @param {Object} fieldValues - Field values to set
   * @returns {Promise<string>} Record ID
   */
  async createRecord(objectKey, fieldValues) {
    const retry = new RetryWithBackoff(this.retryOptions);
    
    return await retry.execute(async () => {
      const objectConfig = this.getObjectConfig(objectKey);
      logger.info(`Creating new ${objectConfig.apiName} record`);
      
      // Navigate to list view
      await this.navigateToObjectList(objectKey);
      
      // Click new button
      await this.click(objectConfig.newButton);
      await this.waitForSpinner();
      
      // Fill fields
      for (const [fieldName, fieldValue] of Object.entries(fieldValues)) {
        // Handle special case for name field
        if (fieldName === 'name' && objectConfig.nameField) {
          await this.fill(objectConfig.nameField, fieldValue);
          continue;
        }
        
        // Try different field locator strategies
        const fieldLocators = [
          `//input[@name="${fieldName}"]`,
          `//textarea[@name="${fieldName}"]`,
          `//lightning-input-field[.//label[contains(text(), "${fieldName}")]]`,
          `//div[contains(@class, "uiInput")][.//label[contains(text(), "${fieldName}")]]//input`,
          `//div[contains(@class, "uiInput")][.//label[contains(text(), "${fieldName}")]]//textarea`
        ];
        
        let fieldFound = false;
        for (const locator of fieldLocators) {
          if (await this.isVisible(locator)) {
            await this.fill(locator, fieldValue);
            fieldFound = true;
            break;
          }
        }
        
        if (!fieldFound) {
          logger.warn(`Field not found: ${fieldName}`);
        }
      }
      
      // Click save
      await this.click(this.locators.saveButton);
      await this.waitForSpinner();
      
      // Verify success
      const success = await this.waitForToast('success');
      if (!success) {
        throw new Error(`Failed to create ${objectConfig.apiName} record`);
      }
      
      // Extract record ID from URL
      const url = this.page.url();
      const recordId = url.split('/').pop();
      
      logger.info(`${objectConfig.apiName} record created with ID: ${recordId}`);
      return recordId;
    });
  }

  /**
   * Select an option from a Lightning combobox
   * @param {string} label - Field label
   * @param {string} value - Option value to select
   * @returns {Promise<void>}
   */
  async selectComboboxValue(label, value) {
    const retry = new RetryWithBackoff(this.retryOptions);
    
    await retry.execute(async () => {
      logger.info(`Selecting value "${value}" from combobox "${label}"`);
      
      // Find the combobox by label
      const comboboxLocator = `//label[contains(text(),"${label}")]/following-sibling::div//lightning-combobox`;
      await this.waitForElement(comboboxLocator);
      
      // Click to open dropdown
      await this.click(`${comboboxLocator}//button`);
      
      // Select the option
      await this.click(`//lightning-base-combobox-item//span[text()="${value}"]`);
      
      // Verify selection
      const selectedText = await this.getText(`${comboboxLocator}//button//span`);
      if (!selectedText.includes(value)) {
        throw new Error(`Failed to select "${value}" from combobox "${label}"`);
      }
    });
  }

  /**
   * Select a lookup record
   * @param {string} label - Field label
   * @param {string} searchText - Text to search for
   * @param {string} recordName - Record name to select
   * @returns {Promise<void>}
   */
  async selectLookupRecord(label, searchText, recordName) {
    const retry = new RetryWithBackoff(this.retryOptions);
    
    await retry.execute(async () => {
      logger.info(`Selecting lookup record "${recordName}" for field "${label}"`);
      
      // Find the lookup field
      const lookupField = this.locators.lookupField(label);
      await this.waitForElement(lookupField);
      
      // Clear existing value if any
      await this.click(lookupField);
      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.press('Backspace');
      
      // Enter search text
      await this.fill(lookupField, searchText);
      
      // Wait for search results
      await this.page.waitForTimeout(1000);
      
      // Click on the matching record
      await this.click(this.locators.lookupResult(recordName));
      
      // Verify selection
      const selectedText = await this.getText(`//label[text()="${label}"]/following-sibling::div//lightning-formatted-text`);
      if (!selectedText.includes(recordName)) {
        throw new Error(`Failed to select lookup record "${recordName}" for field "${label}"`);
      }
    });
  }

  /**
   * Check for Salesforce errors on the page
   * @returns {Promise<string|null>} Error message if found, null otherwise
   */
  async checkForErrors() {
    // Check for standard error messages
    const errorSelectors = [
      '//div[contains(@class,"slds-notify_error")]',
      '//div[contains(@class,"forceError")]',
      '//div[contains(@class,"error")]//span',
      '//span[contains(@class,"errorMessage")]',
      '//div[contains(@class,"slds-has-error")]//div[contains(@class,"slds-form-element__help")]'
    ];
    
    for (const selector of errorSelectors) {
      if (await this.isVisible(selector)) {
        const errorText = await this.getText(selector);
        logger.error(`Salesforce error detected: ${errorText}`);
        return errorText;
      }
    }
    
    return null;
  }

  /**
   * Take a screenshot with Salesforce context
   * @param {string} name - Screenshot name
   * @returns {Promise<string>} Path to screenshot
   */
  async takeScreenshotWithContext(name) {
    // Get current URL and page title
    const url = this.page.url();
    const title = await this.page.title();
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${name}_${timestamp}.png`;
    const screenshotPath = path.join(process.cwd(), 'screenshots', screenshotName);
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    
    // Take screenshot
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Log context
    logger.info(`Screenshot saved to ${screenshotPath}`);
    logger.info(`URL: ${url}`);
    logger.info(`Title: ${title}`);
    
    // Check for errors
    const error = await this.checkForErrors();
    if (error) {
      logger.error(`Error on page: ${error}`);
    }
    
    return screenshotPath;
  }

  /**
   * Use Salesforce keyboard shortcuts
   * @param {string} shortcut - Shortcut name
   * @returns {Promise<void>}
   */
  async useSalesforceShortcut(shortcut) {
    logger.info(`Using Salesforce shortcut: ${shortcut}`);
    
    // Map of Salesforce shortcuts
    const shortcuts = {
      'global_search': ['g', 's'],
      'new_record': ['n'],
      'edit_record': ['e'],
      'save_record': ['s'],
      'list_view': ['g', 'l'],
      'chatter': ['g', 'f'],
      'refresh': ['r'],
      'help': ['g', 'h'],
      'setup': ['g', 'd'],
      'visualforce': ['g', 'v']
    };
    
    if (!shortcuts[shortcut]) {
      throw new Error(`Unknown shortcut: ${shortcut}`);
    }
    
    // Press the shortcut keys
    await this.page.keyboard.press('Escape'); // Clear any open menus
    await this.page.waitForTimeout(300);
    
    // Press the shortcut keys in sequence
    for (const key of shortcuts[shortcut]) {
      await this.page.keyboard.press(key);
      await this.page.waitForTimeout(100);
    }
    
    // Wait for any navigation or UI changes
    await this.waitForSpinner();
  }
}

module.exports = SalesforceInteractions;