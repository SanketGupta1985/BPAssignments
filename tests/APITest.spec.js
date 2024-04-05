import { test, expect } from '@playwright/test';

test('API Response Validation', async ({ browser }) => {
  // Launch browser with ignoreHTTPSErrors option
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Given that I send a GET request to the API
  const response = await page.goto('https://hub.dummyapis.com/employee?noofRecords=10&idStarts=2', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Then the response should be received successfully
  expect(response.ok()).toBeTruthy();

  // And the response body should contain valid JSON data
  const jsonResponse = await response.json();

  // When I parse the response
  // Then the response should contain fields: imageUrl, firstName, lastName, email, contactNumber, age, dob, salary, and address
  const expectedFields = ['imageUrl', 'firstName', 'lastName', 'email', 'contactNumber', 'age', 'dob', 'salary', 'address'];
  expectedFields.forEach(field => {
    expect(jsonResponse[0]).toHaveProperty(field);
  });

  // And I should be able to validate that each field in the response is not null and has the correct data type
  jsonResponse.forEach(employee => {
    expectedFields.forEach(field => {
      // Validate that each field is not null
      expect(employee[field]).not.toBeNull();

      // Validate data types
      switch (field) {
        case 'imageUrl':
        case 'firstName':
        case 'lastName':
        case 'email':
        case 'address':
          expect(typeof employee[field]).toBe('string');
          break;
        case 'contactNumber':
        case 'age':
        case 'salary':
          expect(typeof employee[field]).toBe('number');
          break;
        case 'dob':
          expect(typeof employee[field]).toBe('string');
          // Assuming dob is in ISO 8601 format (YYYY-MM-DD)
          expect(employee[field]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          break;
        default:
          // Unexpected field
          fail(`Unexpected field found in response: ${field}`);
      }
    });
  });

  // Close the browser context
  await context.close();
});
