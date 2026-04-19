import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly makeAppointmentBtn: Locator;

  constructor(page: Page) {
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
