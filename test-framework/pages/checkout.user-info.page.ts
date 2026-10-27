import { Page, Locator } from "@playwright/test";
import { faker } from '@faker-js/faker';
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
    async fillFirstName() {
        await this.firstNameInput.fill(faker.person.firstName());
    }
    async fillLastName() {
        await this.lastNameInput.fill(faker.person.lastName());
    }
    async fillPostalCode() {
        await this.postalCodeInput.fill(faker.location.zipCode());
    }
    async fillUserInfo() {
        await this.fillFirstName();
        await this.fillLastName();
        await this.fillPostalCode();
    }
}