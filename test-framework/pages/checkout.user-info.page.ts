import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class CheckoutUserInfoPage extends BasePage {
    readonly cancelButton: Locator;
    readonly continueButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    constructor(page: Page) {
        super(page);
        this.cancelButton = page.getByTestId('cancel');
        this.continueButton = page.getByTestId('continue');
        this.firstNameInput = page.getByTestId('firstName');
        this.lastNameInput = page.getByTestId('lastName');
        this.postalCodeInput = page.getByTestId('postalCode');
    }
    async cancel() {
        await this.cancelButton.click();
    }
    async continue() {
        await this.continueButton.click();
    }
    async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }
    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }
    async fillPostalCode(zipCode: string) {
        await this.postalCodeInput.fill(zipCode);
    }
    async fillUserInfo(firstName: string, lastName: string, zipCode: string) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(zipCode);
    }
}