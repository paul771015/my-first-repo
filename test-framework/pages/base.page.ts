import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export abstract class BasePage {
    protected readonly page: Page;
    protected readonly header: HeaderComponent;
    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
    }
    async openMenu() {
        await this.header.openMenu();
    }
    async closeMenu() {
        await this.header.closeMenu();
    }
    async logout() {
        await this.header.logout()
    }
    async openCart() {
        await this.header.openCart();
    }
}