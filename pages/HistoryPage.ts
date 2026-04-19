import { Page, Locator } from '@playwright/test';

export class HistoryPage {
  readonly page: Page;
  readonly menuToggle: Locator;
  readonly historyLink: Locator;
  readonly appointmentPanels: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuToggle = page.locator('#menu-toggle');
    this.historyLink = page.getByRole('link', { name: 'History' });
    this.appointmentPanels = page.locator('.panel.panel-info');
  }

  async navigateToHistory(): Promise<void> {
    await this.menuToggle.click();
    await this.historyLink.click();
  }

  /** Get the facility text from a specific appointment panel (0-indexed). */
  getFacility(index: number = 0): Locator {
    return this.appointmentPanels.nth(index).locator('#facility');
  }

  /** Get the readmission text from a specific appointment panel (0-indexed). */
  getReadmission(index: number = 0): Locator {
    return this.appointmentPanels.nth(index).locator('#hospital_readmission');
  }

  /** Get the program text from a specific appointment panel (0-indexed). */
  getProgram(index: number = 0): Locator {
    return this.appointmentPanels.nth(index).locator('#program');
  }

  /** Get the comment text from a specific appointment panel (0-indexed). */
  getComment(index: number = 0): Locator {
    return this.appointmentPanels.nth(index).locator('#comment');
  }

  /** Get the visit date from a specific appointment panel header (0-indexed). */
  getVisitDate(index: number = 0): Locator {
    return this.appointmentPanels.nth(index).locator('.panel-heading');
  }
}
