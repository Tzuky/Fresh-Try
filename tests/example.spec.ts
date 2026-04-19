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
