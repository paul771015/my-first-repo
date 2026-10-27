import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class CheckoutCompletePage extends BasePage {
    readonly homeButton: Locator;
    readonly completeMessage: Locator;
    constructor(page: Page) {
        super(page);
        this.homeButton = page.getByTestId('back-to-products');
        this.completeMessage = page.getByTestId('complete-header');
    }
    async goHome() {
        await this.homeButton.click();
    }
}