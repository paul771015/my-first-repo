import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ROUTES } from '../constants/routes';
import { TEST_USER_DATA } from '../constants/texts';
import { MESSAGES } from '../constants/messages';

test.describe('Sauce Demo Authentication', () => {
    test('Login with standard user', async ({ page, baseURL }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login(TEST_USER_DATA.validUsername, TEST_USER_DATA.password);
        await expect(page).toHaveURL(baseURL + ROUTES.home);
    });
    test('Login with locked-out user', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login(TEST_USER_DATA.lockedUsername, TEST_USER_DATA.password);
        await expect(loginPage.errorMessage).toHaveText(MESSAGES.errors.lockedUser);
    })
});