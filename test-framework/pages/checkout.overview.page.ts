import { Page, Locator } from "@playwright/test";
import { InventoryPage } from "./inventory.page";

export class CheckoutOverviewPage extends InventoryPage {
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    constructor(page: Page) {
        super(page);
        this.cancelButton = page.getByTestId('cancel');
        this.finishButton = page.getByTestId('finish');
    }
    async cancel() {
        await this.cancelButton.click();
    }
    async finish() {
        await this.finishButton.click();
    }
}