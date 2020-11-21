export function authToken(token) {
    const user = {
        name: `GUESS ${new Date().getTime() % 1000}`,
        id: new Date().getTime(),
    };
    return user;
}
