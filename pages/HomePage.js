class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.makeAppointmentBtn = page.locator('#btn-make-appointment');
  }

  async goto() {
    await this.page.goto('https://katalon-demo-cura.herokuapp.com/');
  }

  async clickMakeAppointment() {
    await this.makeAppointmentBtn.click();
  }
}

module.exports = HomePage;
