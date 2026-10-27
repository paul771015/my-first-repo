import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutUserInfoPage } from '../pages/checkout.user-info.page';
import { CheckoutOverviewPage } from '../pages/checkout.overview.page';
import { CheckoutCompletePage } from '../pages/checkout.complete.page';

type Pages = {
    loginPage: LoginPage;
    homePage: HomePage;
    cartPage: CartPage;
    checkoutUserInfoPage: CheckoutUserInfoPage;
    checkoutOverviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutUserInfoPage: async ({ page }, use) => {
        await use(new CheckoutUserInfoPage(page));
    },
    checkoutOverviewPage: async ({ page }, use) => {
        await use(new CheckoutOverviewPage(page));
    },
    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },
});

export { expect } from '@playwright/test';