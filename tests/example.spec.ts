import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MakeAppointmentPage, AppointmentData } from '../pages/MakeAppointmentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

// Test suite for the demo site
test('demo site', async ({ page }) => {
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
    program: 'medicaid', // Choices: 'medicare', 'medicaid', 'none'
    date: '25',
    comment: 'Regular checkup appointment.',
  };
  await makeAppointmentPage.bookAppointment(appointmentData);

  // Verify successful appointment
  await expect(confirmationPage.getConfirmationHeading()).toContainText('Appointment Confirmation');
});
