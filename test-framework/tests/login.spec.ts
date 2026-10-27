import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ROUTES } from '../constants/routes';
import { TEST_USERS } from '../constants/test-data';
import { MESSAGES } from '../constants/messages';

test.describe('Sauce Demo Authentication', () => {
    test('Login with standard user', async ({ page, baseURL }) => {
        const loginPage = new LoginPage(page);
        loginPage.open();
        await loginPage.login(
            TEST_USERS.validUser.username,
            TEST_USERS.validUser.password
        );
        await expect(page).toHaveURL(baseURL + ROUTES.home);
    });
    test('Login with locked-out user', async ({ page }) => {
        const loginPage = new LoginPage(page);
        loginPage.open();
        await loginPage.login(
            TEST_USERS.blockedUser.username,
            TEST_USERS.blockedUser.password
        );
        await expect(loginPage.errorMessage).toHaveText(MESSAGES.errors.lockedUser);
    })
});