// This is a generated Playwright test file
const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const MakeAppointmentPage = require('../pages/MakeAppointmentPage');
const ConfirmationPage = require('../pages/ConfirmationPage');

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
  await makeAppointmentPage.bookAppointment({
    facility: 'Hongkong CURA Healthcare Center',
    readmission: true,
    program: 'medicaid', // Choices: 'medicare', 'medicaid', 'none'
    date: '25',
    comment: 'Regular checkup appointment.',
  });

  // Verify successful appointment
  await expect(confirmationPage.getConfirmationHeading()).toContainText('Appointment Confirmation');
});