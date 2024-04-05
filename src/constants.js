export const chips = [
    20_000_000, 5_000_000, 1_000_000, 500_000, 200_000, 100_000, 50_000, 20_000, 10_000, 2000, 1000, 500, 200, 100, 50, 10, 5, 1,
];

export const choiceNames = {
    cup: "cup",
    mascot: "mascot",
    franceShirt: "franceShirt",
    hostCountry: "hostCountry",
    englandShirt: "englandShirt",
    tickets: "tickets",
    ball: "ball",
    shoes: "shoes",
    big: "big",
    small: "small",
    cup25: "cup25",
    mascot3: "mascot3",
    franceShirt3: "franceShirt3",
    hostCountry3: "hostCountry3",
    englandShirt3: "englandShirt3",
    tickets3: "tickets3",
    ball3: "ball3",
    shoes3: "shoes3",
    cup50: "cup50",
};

export const hedgeBetGroups = [[choiceNames.big, choiceNames.small]];

export const symbolBetChoiceTable = [
    {
        name: choiceNames.cup,
        odds: 100,
        count: 4,
        canBet: true,
        relatedChoices: [choiceNames.cup25, choiceNames.cup50],
    },
    {
        name: choiceNames.cup50,
        odds: 50,
        count: 7,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.cup25,
        odds: 25,
        count: 16,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.mascot,
        odds: 40,
        count: 15,
        canBet: true,
        relatedChoices: [choiceNames.mascot3],
    },
    {
        name: choiceNames.mascot3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.hostCountry,
        odds: 30,
        count: 20,
        canBet: true,
        relatedChoices: [choiceNames.hostCountry3],
    },
    {
        name: choiceNames.hostCountry3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.franceShirt,
        odds: 20,
        count: 30,
        canBet: true,
        relatedChoices: [choiceNames.franceShirt3],
    },
    {
        name: choiceNames.franceShirt3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.englandShirt,
        odds: 20,
        count: 30,
        canBet: true,
        relatedChoices: [choiceNames.englandShirt3],
    },
    {
        name: choiceNames.englandShirt3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.ball,
        odds: 15,
        count: 40,
        canBet: true,
        relatedChoices: [choiceNames.ball3],
    },
    {
        name: choiceNames.ball3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.tickets,
        odds: 10,
        count: 60,
        canBet: true,
        relatedChoices: [choiceNames.tickets3],
    },
    {
        name: choiceNames.tickets3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
    {
        name: choiceNames.shoes,
        odds: 5,
        count: 120,
        canBet: true,
        relatedChoices: [choiceNames.shoes3],
    },
    {
        name: choiceNames.shoes3,
        odds: 3,
        count: 200,
        canBet: false,
        relatedChoices: [],
    },
];

export const symbolPositionsMapper = {
    cup: [5],
    cup25: [3],
    cup50: [4],
    mascot: [16],
    mascot3: [15],
    franceShirt: [8],
    franceShirt3: [9],
    hostCountry: [20],
    hostCountry3: [21],
    englandShirt: [2],
    englandShirt3: [0],
    tickets: [1, 13],
    tickets3: [12],
    ball: [7, 19],
    ball3: [18],
    shoes: [11, 17, 23],
    shoes3: [6],
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
