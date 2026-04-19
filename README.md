# Cura Healthcare Test Automation

This repository contains an automated test suite for the [Katalon Cura Healthcare Service Demo](https://katalon-demo-cura.herokuapp.com/) website using [Playwright](https://playwright.dev/) and **TypeScript**.

## Architecture

The testing framework is built using the **Page Object Model (POM)** pattern to improve test readability, maintainability, and scalability. Locators and page-specific actions are abstracted into separate TypeScript classes inside the `pages/` directory.

### Project Structure
- `tests/` - Contains the Playwright test specs (e.g., `example.spec.ts`).
- `pages/` - Contains the Page Object classes:
  - `HomePage.ts`: Handles initial navigation and homepage interactions.
  - `LoginPage.ts`: Encapsulates user authentication.
  - `MakeAppointmentPage.ts`: Manages the appointment form interactions, including dropdowns and date pickers. Exports an `AppointmentData` interface for type-safe form data.
  - `ConfirmationPage.ts`: Verifies the final appointment confirmation state.
- `playwright.config.ts` - Playwright configuration.
- `tsconfig.json` - TypeScript compiler configuration.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone this repository to your local machine.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install
   ```

## Running Tests

To run the automated tests in headless mode, execute the following command:
```bash
npx playwright test
```

To run tests in UI mode (which opens a visual interface):
```bash
npx playwright test --ui
```

## Adding New Tests
Additional tests can be added by creating new `.spec.ts` files inside the `tests/` directory. Since the DOM interactions are abstracted away, you can simply initialize the existing page objects and script new end-to-end user flows easily. All page objects and test files use TypeScript with full type annotations.
