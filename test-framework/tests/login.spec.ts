import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Sauce Demo Authentication', () => {
    const baseUrl = 'https://www.saucedemo.com/';
    test('Login with standard user', async ({ page }) => {
        const loginPage = await new LoginPage(page).goto(baseUrl);
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(baseUrl + 'inventory.html');
    });
    test('Login with locked-out user', async ({ page }) => {
        const loginPage = await new LoginPage(page).goto(baseUrl);
        await loginPage.login('locked_out_user', 'secret_sauce');
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    })
});