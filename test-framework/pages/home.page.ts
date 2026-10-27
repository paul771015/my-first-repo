import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { InventoryItemComponent } from "../components/inventory-item.component";

export class HomePage extends BasePage {
    readonly title: Locator;
    readonly sortContainer: Locator;
    readonly items: Locator;
    constructor(page: Page) {
        super(page);
        this.title = page.getByTestId('title');
        this.sortContainer = page.getByTestId('product-sort-container');
        this.items = page.getByTestId('inventory-item');
    }
    async sortPriceDescending() {
        await this.sortContainer.selectOption('hilo');
    }
    getItemByIndex(index: number) {
        return new InventoryItemComponent(this.items.nth(index));
    }
    getFirstItem() {
        return new InventoryItemComponent(this.items.first());
    }
    getLastItem() {
        return new InventoryItemComponent(this.items.last());
    }
    async getAllItems() {
        const roots = await this.items.all();
        return roots.map((root) => new InventoryItemComponent(root));
    }
    async getItemsByName(name: string) {
        const roots = await this.items.filter({ hasText: name }).all();
        return roots.map((root) => new InventoryItemComponent(root));
    }
}