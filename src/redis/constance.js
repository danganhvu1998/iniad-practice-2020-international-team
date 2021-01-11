export const roomAllStats = ['isExisting', 'playerCount', 'code', 'gameStatus', 'isPlaying', 'updatedAt', 'playerReadyCount'];

export const investments = [
    {
        id: 0,
        name: 'Public Transportation',
        des: 'Improve the facilities of public transporation',
        cost: 100000,
        require: [], // Might be too hard to implement
        time: 30,
        affect: {
            economy: 5, society: 3, environment: 7, income: 3,
        },
    },
    {
        id: 1,
        name: 'Community Recovery Fund',
        des: 'Establish a community fund which can be used to response to pandemic or emergency situation',
        cost: 1000000,
        require: [],
        time: 8,
        affect: {
            economy: 15, society: 5, environment: 0, income: 7,
        },
    },
    {
        id: 2,
        name: 'Social Protection',
        des: 'Improve workers\' benefits and guarantee their rights (such as Unemployment insurance)',
        cost: 50000,
        require: ['1'], // Might be too hard to implement
        time: 16,
        affect: {
            economy: 2, society: 8, environment: 0, income: 5,
        },
    },
    {
        id: 3,
        name: 'Study Grants and Loans',
        // eslint-disable-next-line max-len
        des: 'Provide study grants and loan to workers to sharpen their skills, which can help them in finding a better job, and increase job opportunities',
        cost: 300000,
        require: [],
        time: 30,
        affect: {
            economy: 15, society: 15, environment: 1, income: 7,
        },
    },
    {
        id: 4,
        name: 'Telework Support',
        des: 'Invest to upgrade digital equipment of workers and enhance experience of remote working',
        cost: 250000,
        require: [],
        time: 16,
        affect: {
            economy: 10, society: 10, environment: -2, income: 5,
        },
    },
    {
        id: 5,
        name: 'Food Stamps',
        des: 'Food Voucher to needy, which can be used to exchange food and necessary ingredients',
        cost: 200000,
        require: [],
        time: 4,
        affect: {
            economy: 5, society: 10, environment: 2, income: 10,
        },
    },
    {
        id: 6,
        name: 'Meal for School Children',
        des: 'Provide free nutritous meal (breakfast and lunch) to school children',
        cost: 300,
        require: [],
        time: 8,
        affect: {
            economy: -3, society: 8, environment: 0, income: 0,
        },
    },
    {
        id: 7,
        name: 'Housing Subsidy',
        des: 'Provide housing subsidy (on rent or buying new house) for low-income family to improve their living environment',
        cost: 300000,
        require: [],
        time: 40,
        affect: {
            economy: 5, society: 15, environment: -3, income: 2,
        },
    },
    {
        id: 8,
        name: 'Schools\' facilities',
        des: 'Improve the facilities and equipments to be used in schools',
        cost: 200000,
        require: [],
        time: 50,
        affect: {
            economy: -5, society: 15, environment: 0, income: 1,
        },
    },
    {
        id: 9,
        name: 'Organic Farming',
        des: 'Encourage farmers to practice organic farming, invest to provide them related equipments and skills',
        cost: 150000,
        require: [],
        time: 50,
        affect: {
            economy: -2, society: 2, environment: 10, income: 5,
        },
    },
];

// export const initStatus = {
//     economy: 75,
//     environment: 70,
//     society: 70,
//     income: 5,
//     money: 3000000,
//     invested: [],
// };

export const initStatus = {
    economy: 51,
    environment: 51,
    society: 51,
    income: 5,
    money: 3000000,
    invested: [],
};
