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
    test.describe('Create booking', () => {
        test('succeeds with valid data', { tag: '@creator' }, async () => {
            const res = await api.post(API_TEST.routes.booking, { data: API_TEST.userData });
            // restful-booker возвращает 200 вместо 201 при создании
            expect(res.status()).toBe(HTTP_STATUS.ok);
            const body = await res.json();
            expect(body).toHaveProperty('bookingid');
            expect(typeof body.bookingid).toBe('number');
            expect(body.booking).toEqual(API_TEST.userData);
            bookingId = body.bookingid;
        });
    });
    test.describe('Read booking', () => {
        test('fails for non-existent booking', async () => {
            const res = await api.get(`${API_TEST.routes.booking}/${API_TEST.invalidId}`);
            expect(res.status()).toBe(HTTP_STATUS.notFound);
        });
        test('succeeds for existing booking', async () => {
            const res = await api.get(`${API_TEST.routes.booking}/${bookingId}`);
            expect(res.status()).toBe(HTTP_STATUS.ok);
            expect(await res.json()).toEqual(API_TEST.userData);
        });
    });
    test.describe('Update booking', () => {
        test('is rejected without auth token', async () => {
            const res = await api.put(`${API_TEST.routes.booking}/${bookingId}`, {
                data: API_TEST.newUserData,
            });
            expect(res.status()).toBe(HTTP_STATUS.forbidden);
        });
        test('fails for non-existent booking', async () => {
            const res = await api.put(`${API_TEST.routes.booking}/${API_TEST.invalidId}`, {
                headers: { Cookie: `token=${token}` },
                data: API_TEST.newUserData,
            });
            // restful-booker возвращает 405 вместо 404 для PUT по несуществующему id
            expect(res.status()).toBe(HTTP_STATUS.methodNotAllowed);
        });
        test('succeeds with valid token', async () => {
            const res = await api.put(`${API_TEST.routes.booking}/${bookingId}`, {
                headers: { Cookie: `token=${token}` },
                data: API_TEST.newUserData,
            });
            expect(res.status()).toBe(HTTP_STATUS.ok);
            expect(await res.json()).toEqual(API_TEST.newUserData);
        });
    });
    test.describe('Delete booking', () => {
        test('is rejected without auth token', async () => {
            const res = await api.delete(`${API_TEST.routes.booking}/${bookingId}`);
            expect(res.status()).toBe(HTTP_STATUS.forbidden);
        });
        test('fails for non-existent booking', async () => {
            const res = await api.delete(`${API_TEST.routes.booking}/${API_TEST.invalidId}`, {
                headers: { Cookie: `token=${token}` },
            });
            // restful-booker возвращает 405 вместо 404 для DELETE по несуществующему id
            expect(res.status()).toBe(HTTP_STATUS.methodNotAllowed);
        });
        test('succeeds with valid token', async () => {
            const res = await api.delete(`${API_TEST.routes.booking}/${bookingId}`, {
                headers: { Cookie: `token=${token}` },
            });
            // restful-booker возвращает 201 вместо 204 при удалении
            expect(res.status()).toBe(HTTP_STATUS.created);
        });
        test('makes booking unavailable afterwards', async () => {
            const res = await api.get(`${API_TEST.routes.booking}/${bookingId}`);
            expect(res.status()).toBe(HTTP_STATUS.notFound);
            bookingId = undefined;
        });
    });
});