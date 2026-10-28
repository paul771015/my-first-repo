import { faker } from '@faker-js/faker';
import { test, expect } from '../test-framework/fixtures/pages.fixture';
import { TEST_USER_DATA } from '../test-framework/constants/test-data';
import { PAGE_TITLES } from '../test-framework/constants/texts';
import { MESSAGES } from '../test-framework/constants/messages';

test('End-to-end purchase scenario', async ({
    loginPage,
    homePage,
    cartPage,
    checkoutUserInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
}) => {
    let itemName: string;
    await test.step('Open the login page', async () => {
        await loginPage.open();
    });
    await test.step('Log in with valid credentials', async () => {
        await loginPage.login(TEST_USER_DATA.validUsername, TEST_USER_DATA.password);
    });
    await test.step('Verify the Products page is displayed after login', async () => {
        await expect(homePage.title).toHaveText(PAGE_TITLES.products);
    });
    await test.step('Add the most expensive item to the cart', async () => {
        await homePage.sortPriceDescending();
        const item = homePage.getFirstItem();
        itemName = await item.getName();
        await item.addToCart();
    });
    await test.step('Go to the cart', async () => {
        await homePage.openCart();
    });
    await test.step('Verify the cart contains the item that was added', async () => {
        await expect(cartPage.getFirstItem().name).toHaveText(itemName);
    });
    await test.step('Start checkout', async () => {
        await cartPage.checkout();
    });
    await test.step('Fill in the customer information', async () => {
        const firstName: string = faker.person.firstName();
        const lastName: string = faker.person.lastName();
        const zipCode: string = faker.location.zipCode();
        await checkoutUserInfoPage.fillUserInfo(firstName, lastName, zipCode);
    });
    await test.step('Continue checkout', async () => {
        await checkoutUserInfoPage.continue();
    });
    await test.step('Complete the purchase', async () => {
        await checkoutOverviewPage.finish();
    });
    await test.step('Verify the order was placed successfully', async () => {
        await expect(checkoutCompletePage.completeMessage).toHaveText(MESSAGES.info.orderSuccess);
    });
});