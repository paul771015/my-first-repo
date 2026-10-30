import { test, expect, APIRequestContext } from '@playwright/test';
import { API_TEST } from '../test-framework/constants/test-data';

test.describe.configure({ mode: 'serial' });

let api: APIRequestContext;
let token: string;
let bookingId: number | undefined;

test.beforeAll(async ({ playwright }) => {
    api = await playwright.request.newContext({
        baseURL: API_TEST.baseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
    });
    const res = await api.post(API_TEST.routes.auth, { data: API_TEST.authData });
    token = (await res.json()).token;
});
test.afterAll(async () => {
    if (bookingId !== undefined) {
        await api.delete(`${API_TEST.routes.booking}/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
        });
    }
    await api.dispose();
});
test.beforeEach(async ({}, testInfo) => {
    if (!testInfo.tags.includes('@creator')) {
        test.skip(bookingId === undefined, 'booking was not created');
    }
});

test.describe('API tests for Restful-booker', () => {
    test('Create - POST', { tag: '@creator' }, async () => {
        const res = await api.post(API_TEST.routes.booking, { data: API_TEST.userData });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty('bookingid');
        expect(typeof body.bookingid).toBe('number');
        expect(body.booking).toEqual(API_TEST.userData);
        bookingId = body.bookingid;
    });
    test('Read - GET', async () => {
        const res = await api.get(`${API_TEST.routes.booking}/${bookingId}`);
        expect(res.status()).toBe(200);
        expect(await res.json()).toEqual(API_TEST.userData);
    });
    test('Update - PUT', async () => {
        const res = await api.put(`${API_TEST.routes.booking}/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
            data: API_TEST.newUserData,
        });
        expect(res.status()).toBe(200);
        expect(await res.json()).toEqual(API_TEST.newUserData);
    });
    test('Delete - DELETE', async () => {
        const res = await api.delete(`${API_TEST.routes.booking}/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
        });
        expect(res.status()).toBe(201);
        expect((await api.get(`${API_TEST.routes.booking}/${bookingId}`)).status()).toBe(404);
        bookingId = undefined;
    });
});