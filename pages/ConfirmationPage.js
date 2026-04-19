class ConfirmationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h2');
  }

  getConfirmationHeading() {
    return this.heading;
  }
}

module.exports = ConfirmationPage;
