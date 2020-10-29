export function authToken(token) {
    console.log(token);
    const user = {
        name: `${new Date().getTime() % 1000}`,
        id: new Date().getTime() % 100,
    };
    return user;
}
