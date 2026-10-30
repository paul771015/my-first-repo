export const TEST_USER_DATA = {
    password: 'secret_sauce',
    validUsername: 'standard_user',
    lockedUsername: 'locked_out_user',
} as const;

export const API_TEST = {
    baseURL: 'https://restful-booker.herokuapp.com',
    authData: {
        username: 'admin',
        password: 'password123',
    },
    userData: {
        firstname: 'Test',
        lastname: 'User',
        totalprice: 100,
        depositpaid: true,
        bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
        additionalneeds: 'Breakfast',
    },
    newUserData: {
        firstname: 'Anna',
        lastname: 'Petrova',
        totalprice: 275,
        depositpaid: false,
        bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
        additionalneeds: 'Dinner',
    },
    routes: {
        auth: '/auth',
        booking: '/booking',
    },
} as const;