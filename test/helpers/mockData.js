/* eslint-disable no-param-reassign */
export function mockUserCreator(tracker = 0) {
    if (tracker === 0) {
        tracker = new Date().getTime();
    }
    const mockUser = {
        email: `iniad-${tracker}@gmail.com`,
        fullName: 'Full Name',
        birthday: '1998-04-20',
        gender: 'male',
    };
    return mockUser;
}
