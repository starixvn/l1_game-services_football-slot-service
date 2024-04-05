import { generateResult } from "sc-slot-rng-game-base/src/result-helpers";
import { symbolBetChoiceTable, symbolPositionsMapper } from "../../src/constants";
import { choiceNames } from "../../src/constants";

const ratioModes = {
    1: 0.24,
    2: 0.21,
    3: 0.18,
};

const randomModes = [1, 2, 3];

describe("Result statistic: 10000 times", () => {
    Object.keys(randomModes).forEach((mode) => {
        it(`should generate results statistically correct with mode ${mode}`, () => {
            // Arrange
            let statisticSymbolsResult = {
                cup: 0,
                cup25: 0,
                cup50: 0,
                mascot: 0,
                mascot3: 0,
                franceShirt: 0,
                franceShirt3: 0,
                hostCountry: 0,
                hostCountry3: 0,
                englandShirt: 0,
                englandShirt3: 0,
                tickets: 0,
                tickets3: 0,
                ball: 0,
                ball3: 0,
                shoes: 0,
                shoes3: 0,
            };

            let statisticBigSmallResult = {
                big: 0,
                small: 0,
            };

            const totalRounds = 10000;
            let totalSymbols = 0;

            // Act
            for (let i = 0; i < totalRounds; i++) {
                const { result } = generateResult(symbolBetChoiceTable, symbolPositionsMapper, ratioModes[3], 2, 3, mode);
                result.symbols.forEach((symbol) => {
                    totalSymbols++;
                    switch (symbol) {
                        case choiceNames.cup:
                            statisticSymbolsResult.cup++;
                            break;
                        case choiceNames.cup25:
                            statisticSymbolsResult.cup25++;
                            break;
                        case choiceNames.cup50:
                            statisticSymbolsResult.cup50++;
                            break;
                        case choiceNames.mascot:
                            statisticSymbolsResult.mascot++;
                            break;
                        case choiceNames.mascot3:
                            statisticSymbolsResult.mascot3++;
                            break;
                        case choiceNames.franceShirt:
                            statisticSymbolsResult.franceShirt++;
                            break;
                        case choiceNames.franceShirt3:
                            statisticSymbolsResult.franceShirt3++;
                            break;
                        case choiceNames.hostCountry:
                            statisticSymbolsResult.hostCountry++;
                            break;
                        case choiceNames.hostCountry3:
                            statisticSymbolsResult.hostCountry3++;
                            break;
                        case choiceNames.englandShirt:
                            statisticSymbolsResult.englandShirt++;
                            break;
                        case choiceNames.englandShirt3:
                            statisticSymbolsResult.englandShirt3++;
                            break;
                        case choiceNames.tickets:
                            statisticSymbolsResult.tickets++;
                            break;
                        case choiceNames.tickets3:
                            statisticSymbolsResult.tickets3++;
                            break;
                        case choiceNames.ball:
                            statisticSymbolsResult.ball++;
                            break;
                        case choiceNames.ball3:
                            statisticSymbolsResult.ball3++;
                            break;
                        case choiceNames.shoes:
                            statisticSymbolsResult.shoes++;
                            break;
                        default:
                            statisticSymbolsResult.shoes3++;
                            break;
                    }
                });

                result.bigSmall.choice === choiceNames.big ? statisticBigSmallResult.big++ : statisticBigSmallResult.small++;
            }

            // Assert
            const symbolResultPercentage = Object.keys(statisticSymbolsResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticSymbolsResult[key] / totalRounds) * 100).toFixed(2);

                return percentage;
            }, {});

            const bigsmallResultPercentage = Object.keys(statisticBigSmallResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticBigSmallResult[key] / totalRounds) * 100).toFixed(2);

                return percentage;
            }, {});

            console.log(
                `Symbol countResult: ${JSON.stringify(statisticSymbolsResult)}, Symbol percentageResult: ${JSON.stringify(
                    symbolResultPercentage
                )}`
            );
            console.log(
                `BigSmall countResult: ${JSON.stringify(statisticBigSmallResult)}, BigSmall percentageResult: ${JSON.stringify(
                    bigsmallResultPercentage
                )}`
            );

            // console.log(
            //     `totalPercent: ${Object.values(resultPercentage).reduce((previousValue, currentValue) => previousValue + currentValue, 0)}
            // `
            // );
            Object.values(symbolResultPercentage).forEach((value) => {
                // expect(value).toBeGreaterThanOrEqual(16);
            });
        });
    });
});
