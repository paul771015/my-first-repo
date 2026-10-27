import { test, expect } from '@playwright/test';
import { TEST_USER_DATA, PAGE_TITLES } from '../constants/texts';
import { MESSAGES } from '../constants/messages';
import { InventoryItemComponent } from '../components/inventory-item.component';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutUserInfoPage } from '../pages/checkout.user-info.page';
import { CheckoutOverviewPage } from '../pages/checkout.overview.pages';
import { CheckoutCompletePage } from '../pages/checkout.complete.page';

test('End-to-end purchase scenario', async ({ page }) => {
    let item: InventoryItemComponent;
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutUserInfoPage = new CheckoutUserInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await test.step('1. Open the login page', async () => {
        await loginPage.open();
    });
    await test.step('2. Log in with valid credentials', async () => {
        await loginPage.login(TEST_USER_DATA.validUsername, TEST_USER_DATA.password);
    });
    await test.step('3. Verify the Products page is displayed after login', async () => {
        await expect(homePage.title).toHaveText(PAGE_TITLES.products);
    });
    await test.step('4. Add the most expensive item to the cart', async () => {
        await homePage.sortPriceDescending();
        item = homePage.getFirstItem();
        await item.addToCart();
    });
    await test.step('5. Go to the cart', async () => {
        await homePage.openCart();
    });
    await test.step('6. Verify the cart contains the item that was added', async () => {
        expect(await item.isInCart()).toBeTruthy();
    });
    await test.step('7. Start checkout', async () => {
        await cartPage.checkout();
    });
    await test.step('8. Fill in the customer information', async () => {
        await checkoutUserInfoPage.fillUserInfo();
    });
    await test.step('9. Continue checkout', async () => {
        await checkoutUserInfoPage.continue();
    });
    await test.step('10. Complete the purchase', async () => {
        await checkoutOverviewPage.finish();
    });
    await test.step('11. Verify the order was placed successfully', async () => {
        await expect(checkoutCompletePage.completeMessage).toHaveText(MESSAGES.info.orderSuccess);
    });
});