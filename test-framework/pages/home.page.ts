import { Page, Locator } from "@playwright/test";
import { InventoryPage } from "./inventory.page";

export class HomePage extends InventoryPage {
    readonly sortContainer: Locator;
    constructor(page: Page) {
        super(page);
        this.sortContainer = page.getByTestId('product-sort-container');
    }
    async sortPriceDescending() {
        await this.sortContainer.selectOption('hilo');
    }
}