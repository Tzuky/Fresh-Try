import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MakeAppointmentPage, AppointmentData } from '../pages/MakeAppointmentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { HistoryPage } from '../pages/HistoryPage';

// Test suite for the demo site
test('demo site - Hongkong appointment', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const makeAppointmentPage = new MakeAppointmentPage(page);
  const confirmationPage = new ConfirmationPage(page);

  // Navigate to the URL and click Make Appointment
  await homePage.goto();
  await homePage.clickMakeAppointment();

  // Login
  await loginPage.login('John Doe', 'ThisIsNotAPassword');

  // Fill in the appointment form
  const appointmentData: AppointmentData = {
    facility: 'Hongkong CURA Healthcare Center',
    readmission: true,
    program: 'medicaid',
    date: '25',
    comment: 'Regular checkup appointment.',
  };
  await makeAppointmentPage.bookAppointment(appointmentData);

  // Verify successful appointment
  await expect(confirmationPage.getConfirmationHeading()).toContainText('Appointment Confirmation');
});

test('Seoul appointment with history verification', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const makeAppointmentPage = new MakeAppointmentPage(page);
  const confirmationPage = new ConfirmationPage(page);
  const historyPage = new HistoryPage(page);

  const testComment = 'Seoul branch scheduled visit - verify in history';

  // Navigate and log in
  await homePage.goto();
  await homePage.clickMakeAppointment();
  await loginPage.login('John Doe', 'ThisIsNotAPassword');

  // Book appointment at Seoul CURA Healthcare Center
  const appointmentData: AppointmentData = {
    facility: 'Seoul CURA Healthcare Center',
    readmission: true,
    program: 'medicaid',
    date: '25',
    comment: testComment,
  };
  await makeAppointmentPage.bookAppointment(appointmentData);

  // Verify confirmation page
  await expect(confirmationPage.getConfirmationHeading()).toContainText('Appointment Confirmation');

  // Navigate to History via hamburger menu
  await historyPage.navigateToHistory();

  // Verify the appointment appears in history with correct details
  await expect(historyPage.getFacility(0)).toHaveText('Seoul CURA Healthcare Center');
  await expect(historyPage.getProgram(0)).toHaveText('Medicaid');
  await expect(historyPage.getReadmission(0)).toHaveText('Yes');

  // Verify the comment is shown in the history
  await expect(historyPage.getComment(0)).toHaveText(testComment);
});

// --- Negative Tests ---

test('Negative: login with invalid credentials should fail', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await homePage.goto();
  await homePage.clickMakeAppointment();

  // Attempt login with wrong credentials
  await loginPage.login('InvalidUser', 'WrongPassword123');

  // Verify error message is displayed
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    'Login failed! Please ensure the username and password are valid.'
  );

  // Verify we are still on the login page (not redirected to appointment page)
  expect(await loginPage.isOnLoginPage()).toBe(true);

  // Verify the appointment page heading is NOT visible
  await expect(page.locator('h2', { hasText: 'Make Appointment' })).not.toBeVisible();
});

test('Negative: booking with a past date should not be allowed', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const makeAppointmentPage = new MakeAppointmentPage(page);
  const confirmationPage = new ConfirmationPage(page);

  // Navigate and log in
  await homePage.goto();
  await homePage.clickMakeAppointment();
  await loginPage.login('John Doe', 'ThisIsNotAPassword');

  // Fill the appointment form
  await makeAppointmentPage.facilityDropdown.selectOption('Seoul CURA Healthcare Center');
  await makeAppointmentPage.readmissionCheckbox.check();
  await page.locator('#radio_program_medicare').click();
  await makeAppointmentPage.commentInput.fill('Past date test - should not succeed');

  // Use the datepicker UI to select a date in the past month.
  // Using the UI ensures the value is set identically to a real user 
  // (avoiding raw 'fill' constraints that might trigger 'empty field' errors).
  await makeAppointmentPage.visitDateInput.click();
  await page.locator('th.prev').first().click();
  await page.getByRole('cell', { name: '15', exact: true }).first().click();

  // Attempt to book
  await makeAppointmentPage.bookAppointmentBtn.click();

  // The application SHOULD NOT proceed — it should stay on the appointment page.
  // NOTE: Because there is a bug in the application that ALLOWS past dates,
  // this assertion will FAIL, which accurately catches the defect.
  await expect(page.locator('h2', { hasText: 'Make Appointment' })).toBeVisible({ timeout: 5000 });

  // Verify we did NOT reach the confirmation page
  await expect(page.locator('h2', { hasText: 'Appointment Confirmation' })).not.toBeVisible();
});
