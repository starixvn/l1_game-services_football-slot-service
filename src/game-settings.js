import {
    choiceNames,
    defaultSettlementResult,
    choicesMapper,
    hedgeBetGroups,
    symbolBetChoiceTable,
    symbolPositionsMapper,
} from "./constants";

export default {
    id: 59,
    name: "FootballSlot",
    durations: {
        wholeRound: 42,
        placingBets: 30,
        lockingBet: 5,
    },
    choices: Object.values(choiceNames),
    choicesMapper,
    hedgeBetGroups,
    numberOfRoundHistory: 100,
    historyPageSize: 7,
    luckyRoundDuration: 4,
    defaultSettlementResult,
    symbolBetChoiceTable,
    symbolPositionsMapper,
    ratioModes: {
        1: 0.24,
        2: 0.21,
        3: 0.18,
    },
};
