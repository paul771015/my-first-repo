import { test, expect, APIRequestContext } from '@playwright/test';
import { API_TEST } from '../test-framework/constants/test-data';
import { HTTP_STATUS } from '../test-framework/constants/http-status';

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
        expect(res.status()).toBe(HTTP_STATUS.ok);
        const body = await res.json();
        expect(body).toHaveProperty('bookingid');
        expect(typeof body.bookingid).toBe('number');
        expect(body.booking).toEqual(API_TEST.userData);
        bookingId = body.bookingid;
    });
    test('Read - GET', async () => {
        const notFoundRes = await api.get(`${API_TEST.routes.booking}/${API_TEST.invalidId}`);
        expect(notFoundRes.status()).toBe(HTTP_STATUS.notFound);
        const successRes = await api.get(`${API_TEST.routes.booking}/${bookingId}`);
        expect(successRes.status()).toBe(HTTP_STATUS.ok);
        expect(await successRes.json()).toEqual(API_TEST.userData);
    });
    test('Update - PUT', async () => {
        const forbiddenRes = await api.put(`${API_TEST.routes.booking}/${bookingId}`, {
            data: API_TEST.newUserData,
        });
        expect(forbiddenRes.status()).toBe(HTTP_STATUS.forbidden);
        const notFoundRes = await api.put(`${API_TEST.routes.booking}/${API_TEST.invalidId}`, {
            headers: { Cookie: `token=${token}` },
            data: API_TEST.newUserData,
        });
        // restful-booker возвращает 405 вместо 404 для PUT по несуществующему id
        expect(notFoundRes.status()).toBe(HTTP_STATUS.methodNotAllowed);
        const successRes = await api.put(`${API_TEST.routes.booking}/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
            data: API_TEST.newUserData,
        });
        expect(successRes.status()).toBe(HTTP_STATUS.ok);
        expect(await successRes.json()).toEqual(API_TEST.newUserData);
    });
    test('Delete - DELETE', async () => {
        const forbiddenRes = await api.delete(`${API_TEST.routes.booking}/${bookingId}`);
        expect(forbiddenRes.status()).toBe(HTTP_STATUS.forbidden);
        const notFoundRes = await api.delete(`${API_TEST.routes.booking}/${API_TEST.invalidId}`, {
            headers: { Cookie: `token=${token}` },
        });
        // restful-booker возвращает 405 вместо 404 для DELETE по несуществующему id
        expect(notFoundRes.status()).toBe(HTTP_STATUS.methodNotAllowed);
        const successRes = await api.delete(`${API_TEST.routes.booking}/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
        });
        expect(successRes.status()).toBe(HTTP_STATUS.created);
        const deletedBookingRes = await api.get(`${API_TEST.routes.booking}/${bookingId}`);
        expect(deletedBookingRes.status()).toBe(HTTP_STATUS.notFound);
        bookingId = undefined;
    });
});