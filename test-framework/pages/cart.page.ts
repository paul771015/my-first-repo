import { Page, Locator } from "@playwright/test";
import { InventoryPage } from "./inventory.page";

export class CartPage extends InventoryPage {
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    constructor(page: Page) {
        super(page);
        this.continueShoppingButton = page.getByTestId('continue-shopping');
        this.checkoutButton = page.getByTestId('checkout');
    }
    async continueShopping() {
        await this.continueShoppingButton.click();
    }
    async checkout() {
        await this.checkoutButton.click();
    }
}