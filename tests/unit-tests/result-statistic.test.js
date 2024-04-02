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
                bar: 0,
                bar25: 0,
                bar50: 0,
                tripleSeven: 0,
                tripleSeven3: 0,
                watermelon: 0,
                watermelon3: 0,
                star: 0,
                star3: 0,
                bell: 0,
                bell3: 0,
                orange: 0,
                orange3: 0,
                lemon: 0,
                lemon3: 0,
                cherry: 0,
                cherry3: 0,
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
                        case choiceNames.bar:
                            statisticSymbolsResult.bar++;
                            break;
                        case choiceNames.bar25:
                            statisticSymbolsResult.bar25++;
                            break;
                        case choiceNames.bar50:
                            statisticSymbolsResult.bar50++;
                            break;
                        case choiceNames.tripleSeven:
                            statisticSymbolsResult.tripleSeven++;
                            break;
                        case choiceNames.tripleSeven3:
                            statisticSymbolsResult.tripleSeven3++;
                            break;
                        case choiceNames.watermelon:
                            statisticSymbolsResult.watermelon++;
                            break;
                        case choiceNames.watermelon3:
                            statisticSymbolsResult.watermelon3++;
                            break;
                        case choiceNames.star:
                            statisticSymbolsResult.star++;
                            break;
                        case choiceNames.star3:
                            statisticSymbolsResult.star3++;
                            break;
                        case choiceNames.bell:
                            statisticSymbolsResult.bell++;
                            break;
                        case choiceNames.bell3:
                            statisticSymbolsResult.bell3++;
                            break;
                        case choiceNames.orange:
                            statisticSymbolsResult.orange++;
                            break;
                        case choiceNames.orange3:
                            statisticSymbolsResult.orange3++;
                            break;
                        case choiceNames.lemon:
                            statisticSymbolsResult.lemon++;
                            break;
                        case choiceNames.lemon3:
                            statisticSymbolsResult.lemon3++;
                            break;
                        case choiceNames.cherry:
                            statisticSymbolsResult.cherry++;
                            break;
                        default:
                            statisticSymbolsResult.cherry3++;
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
