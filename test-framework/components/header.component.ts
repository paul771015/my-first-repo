import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
    readonly openMenuButton: Locator;
    readonly closeMenuButton: Locator;
    readonly logoutLink: Locator;
    readonly cartLink: Locator;
    constructor(page: Page) {
        this.openMenuButton = page.getByTestId('open-menu')
        this.closeMenuButton = page.getByTestId('close-menu')
        this.logoutLink = page.getByTestId('logout-sidebar-link')
        this.cartLink = page.getByTestId('shopping-cart-link');
    }
    async openMenu() {
        if (await this.openMenuButton.isVisible()){
            await this.openMenuButton.click();
        }
    }
    async closeMenu() {
        if (await this.closeMenuButton.isVisible()){
            await this.closeMenuButton.click();
        }
    }
    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
    }
    async openCart() {
        await this.cartLink.click();
    }
}