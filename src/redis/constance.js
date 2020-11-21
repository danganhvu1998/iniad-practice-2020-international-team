export const roomAllStats = ['isExisting', 'playerCount', 'code', 'gameStatus', 'isPlaying', 'updatedAt', 'playerReadyCount'];

export const investment = [
    {
        id: 0,
        name: 'YOLO',
        const: 0,
        require: null, // Might be too hard to implement
        affect: {
            economy: -100, society: -100, environment: -100, income: -100,
        },
    },
    {
        id: 1,
        name: 'Invent Plastic Bag',
        const: 50,
        affect: {
            economy: 5, society: -1, environment: -5, income: 7,
        },
    },
    {
        id: 2,
        name: 'Invent Better Plastic Bag',
        const: 200,
        require: [1], // Might be too hard to implement
        affect: {
            economy: 2, society: -1, environment: -2, income: 5,
        },
    },
    {
        id: 3,
        name: 'Get Educated',
        const: 500,
        required: null,
        affect: {
            economy: 2, society: 10, environment: 1, income: 7,
        },
    },
];

export const initStatus = {
    economy: 30,
    environment: 100,
    society: 50,
    income: 5,
    money: 1000000,
};
