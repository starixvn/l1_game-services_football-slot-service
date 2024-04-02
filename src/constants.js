export const chips = [
    20_000_000, 5_000_000, 1_000_000, 500_000, 200_000, 100_000, 50_000, 20_000, 10_000, 2000, 1000, 500, 200, 100, 50, 10, 5, 1,
];

export const choiceNames = {
    bar: "bar",
    tripleSeven: "tripleSeven",
    watermelon: "watermelon",
    star: "star",
    bell: "bell",
    orange: "orange",
    lemon: "lemon",
    cherry: "cherry",
    big: "big",
    small: "small",
    bar25: "bar25",
    tripleSeven3: "tripleSeven3",
    watermelon3: "watermelon3",
    star3: "star3",
    bell3: "bell3",
    orange3: "orange3",
    lemon3: "lemon3",
    cherry3: "cherry3",
    bar50: "bar50",
};

export const hedgeBetGroups = [[choiceNames.big, choiceNames.small]];

export const symbolBetChoiceTable = [
    {
        name: choiceNames.bar,
        odds: 100,
        count: 4,
        canBet: true,
        relatedChoices: [choiceNames.bar25, choiceNames.bar50],
    },
    {
        name: choiceNames.bar50,
        odds: 50,
        count: 7,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.bar25,
        odds: 25,
        count: 16,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.tripleSeven,
        odds: 40,
        count: 15,
        canBet: true,
        relatedChoices: [choiceNames.tripleSeven3],
    },
    {
        name: choiceNames.tripleSeven3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.star,
        odds: 30,
        count: 20,
        canBet: true,
        relatedChoices: [choiceNames.star3],
    },
    {
        name: choiceNames.star3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.watermelon,
        odds: 20,
        count: 30,
        canBet: true,
        relatedChoices: [choiceNames.watermelon3],
    },
    {
        name: choiceNames.watermelon3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.bell,
        odds: 20,
        count: 30,
        canBet: true,
        relatedChoices: [choiceNames.bell3],
    },
    {
        name: choiceNames.bell3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.lemon,
        odds: 15,
        count: 40,
        canBet: true,
        relatedChoices: [choiceNames.lemon3],
    },
    {
        name: choiceNames.lemon3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.orange,
        odds: 10,
        count: 60,
        canBet: true,
        relatedChoices: [choiceNames.orange3],
    },
    {
        name: choiceNames.orange3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.cherry,
        odds: 5,
        count: 120,
        canBet: true,
        relatedChoices: [choiceNames.cherry3],
    },
    {
        name: choiceNames.cherry3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
];

export const symbolPositionsMapper = {
    bar: [5],
    bar25: [3],
    bar50: [4],
    tripleSeven: [16],
    tripleSeven3: [15],
    watermelon: [8],
    watermelon3: [9],
    star: [20],
    star3: [21],
    bell: [2],
    bell3: [0],
    orange: [1, 13],
    orange3: [12],
    lemon: [7, 19],
    lemon3: [18],
    cherry: [11, 17, 23],
    cherry3: [6],
    lucky: [10, 22],
};

export const choicesMapper = Object.keys(choiceNames).reduce((mapper, choiceName, index) => {
    mapper[choiceName] = index + 1;
    return mapper;
}, {});

export const defaultSettlementResult = Object.keys(choiceNames).reduce((settlement, choiceName) => {
    settlement[choiceName] = false;
    return settlement;
}, {});
