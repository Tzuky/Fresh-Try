class MakeAppointmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.facilityDropdown = page.locator('#combo_facility');
    this.readmissionCheckbox = page.locator('#chk_hospotal_readmission');
    
    this.visitDateInput = page.locator('#txt_visit_date');
    this.commentInput = page.locator('#txt_comment');
    this.bookAppointmentBtn = page.locator('#btn-book-appointment');
  }

  async bookAppointment({ facility, readmission, program, date, comment }) {
    await this.facilityDropdown.selectOption(facility);
    
    if (readmission) {
      await this.readmissionCheckbox.check();
    } else {
      await this.readmissionCheckbox.uncheck();
    }

    if (program === 'medicare') {
      await this.page.locator('#radio_program_medicare').click();
    } else if (program === 'medicaid') {
      await this.page.locator('#radio_program_medicaid').click();
    } else if (program === 'none') {
      await this.page.locator('#radio_program_none').click();
    }

    // Date picker interaction
    await this.visitDateInput.click();
    await this.page.getByRole('cell', { name: date }).nth(0).click();

    await this.commentInput.fill(comment);
    await this.bookAppointmentBtn.click();
  }
}

module.exports = MakeAppointmentPage;
