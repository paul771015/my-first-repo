import { Locator } from "@playwright/test";

export class InventoryItemComponent {
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addToCartButton: Locator;
    readonly removeButton: Locator;
    constructor(protected readonly root: Locator) {
        this.name = root.getByTestId('inventory-item-name');
        this.description = root.getByTestId('inventory-item-desc');
        this.price = root.getByTestId('inventory-item-price');
        this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
        this.removeButton = root.getByRole('button', { name: 'Remove' });
    }
    async addToCart() {
        await this.addToCartButton.click();
    }
    async removeFromCart() {
        await this.removeButton.click();
    }
    async openDetails() {
        await this.name.click();
    }
    async isInCart() {
        return this.removeButton.isVisible();
    }
}