import RebetProcessBetQueue from "../../../src/crons/rebet-process-bet-queue";
import { GameData, GameDefinition, BaseMetrics } from "sc-slot-rng-game-base";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import logger from "sc-common/logger";
import mongoose from "mongoose";
import Chance from "chance";
import { TablePlaceBetPublisher } from "sc-rebet-mode/src/publishers";
import { cloneDeep } from "lodash";

describe("RebetProcessBetQueue", () => {
    const gameData = new GameData(10);
    gameData.exchangeRates = {
        exId: 1,
        code: {
            USD: 1,
            VND: 0.00004405,
            IDR: 0.07099,
        },
    };

    gameData.gameConfigs = {
        odds: {
            red2: 2.4,
        },
    };

    gameData.currencies = [
        { code: "USD", name: "USD", isTest: false, isUncountOnTotal: false, partnerId: "VG" },
        { code: "IND", name: "IND", isTest: true, isUncountOnTotal: false, partnerId: "VG" },
        { code: "VND", name: "UUS", isTest: true, isUncountOnTotal: true, partnerId: "VG" },
        { code: "VND", name: "UUS", isTest: true, isUncountOnTotal: false, partnerId: "VGCash" },
    ];

    const chance = new Chance();
    const definition = new GameDefinition({
        id: 1,
        name: "game name",
        durations: {
            wholeRound: 36,
            placingBets: 30,
            lockingBet: 5,
            shakeThePlateDuration: 1,
        },
        choicesMapper: { red2: 1 },
    });
    const placeBetPublisher = new TablePlaceBetPublisher(definition.name, gameData);
    /** @type {logger}*/
    const logService = stub(logger);
    /** @type {mongoose.Model}*/
    const betsRepository = stubMongoose(mongoose.Model);
    betsRepository.updateOne = jest.fn();

    /** @type {mongoose.Model}*/
    const betLogsRepository = stubMongoose(mongoose.Model);
    betLogsRepository.create = jest.fn();
    const baseMetrics = stub(BaseMetrics);
    let player = null,
        proceedBetQueue = null,
        payload = null,
        placeBet = null;

    beforeEach(() => {
        // Mock dependencies
        jest.clearAllMocks();

        const playerInGameData = {
            name: "player01",
            betTracks: { red2: 100 },
            betQueue: [
                {
                    player: {},
                    payload: {},
                },
            ],
        };
        player = mockPlayer();
        placeBet = jest.fn();
        payload = mockPayload();
        proceedBetQueue = initBetQueue(placeBet);

        gameData.ingame = {
            player01: cloneDeep(playerInGameData),
        };
    });

    describe("insertBetLog", () => {
        it("should call insertBetLogRecord for a normal bet", async () => {
            const mockInsertBetLogRecord = jest.spyOn(proceedBetQueue, "insertBetLogRecord").mockResolvedValue();

            const player = { UID: "player1", profile: { name: "Player 1" } };
            const bet = { betChoice: "choice1", amount: 100, rebet: false };
            const roundId = "round1";
            const rate = 1.5;

            await proceedBetQueue.insertBetLog(player, roundId, bet, rate);

            expect(mockInsertBetLogRecord).toHaveBeenCalledWith(player, roundId, bet, rate, false);
        });

        it("should call insertBetLogRecord for each rebet", async () => {
            const mockInsertBetLogRecord = jest.spyOn(proceedBetQueue, "insertBetLogRecord").mockResolvedValue();

            const player = { UID: "player1", profile: { name: "Player 1" } };
            const bet = { rebet: true, lastBet: { choiceA: 50, choiceB: 30 } };
            const roundId = "round1";
            const rate = 1.5;

            await proceedBetQueue.insertBetLog(player, roundId, bet, rate);

            expect(mockInsertBetLogRecord).toHaveBeenCalledTimes(2);
            expect(mockInsertBetLogRecord).toHaveBeenCalledWith(
                player,
                roundId,
                expect.objectContaining({ betChoice: "choiceA", amount: 50 }),
                rate,
                true
            );
            expect(mockInsertBetLogRecord).toHaveBeenCalledWith(
                player,
                roundId,
                expect.objectContaining({ betChoice: "choiceB", amount: 30 }),
                rate,
                true
            );
        });
    });

    describe("insertBetLogRecord", () => {
        let mockCreateBetLog;

        beforeEach(() => {
            mockCreateBetLog = jest.spyOn(proceedBetQueue.betLogsRepository, "create").mockResolvedValue();
        });

        it("should create a bet log with correct data", async () => {
            // Arrange
            const player = {
                UID: "player1",
                profile: { name: "Player 1" },
                session: {
                    siteId: "site123",
                    currencyName: "USD",
                    operatorId: "VG",
                    playerId: "player123",
                },
            };

            const roundId = "round1";
            const rate = 1.5;
            const rebet = false;
            const bet = {
                betChoice: "choice1",
                amount: 100,
                freeBet: true,
                clientSentTime: new Date(),
                receivedTime: new Date(),
            };

            // Act
            await proceedBetQueue.insertBetLogRecord(player, roundId, bet, rate, rebet);

            // Assert
            expect(mockCreateBetLog).toHaveBeenCalledTimes(1);
            expect(mockCreateBetLog).toHaveBeenCalledWith(
                expect.objectContaining({
                    uid: player.UID,
                    name: player.profile.name,
                    choice: bet.betChoice,
                    amount: bet.amount,
                    freeBet: bet.freeBet,
                    roundId,
                    rebet,
                    siteId: player.session.siteId,
                    currency: player.session.currencyName,
                    rate,
                    operatorId: player.session.operatorId,
                    playerId: player.session.playerId,
                })
            );
        });

        it("should create a bet log without session details when player session is missing", async () => {
            // Arrange
            const player = {
                UID: "player2",
                profile: { name: "Player 2" },
            };

            const roundId = "round2";
            const rate = 2.0;
            const rebet = true;
            const bet = {
                betChoice: "choice2",
                amount: 200,
                freeBet: false,
                clientSentTime: new Date(),
                receivedTime: new Date(),
            };

            // Act
            await proceedBetQueue.insertBetLogRecord(player, roundId, bet, rate, rebet);

            // Assert
            expect(mockCreateBetLog).toHaveBeenCalledTimes(1);
        });

        it("should assign correct subChoices from symbolBetChoiceTable", async () => {
            // Arrange
            proceedBetQueue.definition.symbolBetChoiceTable = [{ name: "choice1", relatedChoices: ["A", "B", "C"] }];

            const player = {
                UID: "player3",
                profile: { name: "Player 3" },
            };

            const roundId = "round3";
            const rate = 2.5;
            const rebet = false;
            const bet = {
                betChoice: "choice1",
                amount: 300,
                freeBet: false,
            };

            // Act
            await proceedBetQueue.insertBetLogRecord(player, roundId, bet, rate, rebet);

            // Assert
            expect(mockCreateBetLog).toHaveBeenCalledTimes(1);
            expect(mockCreateBetLog).toHaveBeenCalledWith(
                expect.objectContaining({
                    choice: bet.betChoice,
                    subChoices: ["A", "B", "C"], // ✅ SubChoices should be assigned correctly
                })
            );
        });
    });

    describe("isCountOnTotalBets", () => {
        describe("when player currency is not test currency", () => {
            it("should return true", () => {
                // Arrange
                player.session.currencyName = "USD";
                player.session.operatorId = "VG";

                // Act
                const actualResult = proceedBetQueue.isCountOnTotalBets(player);

                // Assert
                expect(actualResult).toBe(true);
            });
        });

        describe("when player currency is test currency and isUncountOnTotal config is false", () => {
            it("should return true", () => {
                // Arrange
                player.session.currencyName = "IND";
                player.session.operatorId = "VG";

                // Act
                const actualResult = proceedBetQueue.isCountOnTotalBets(player);

                // Assert
                expect(actualResult).toBe(true);
            });
        });
        describe("when player currency is test currency and isUncountOnTotal config is false", () => {
            it("should return true", () => {
                // Arrange
                player.session.currencyName = "UUS";
                player.session.operatorId = "VGCash";

                // Act
                const actualResult = proceedBetQueue.isCountOnTotalBets(player);

                // Assert
                expect(actualResult).toBe(true);
            });
        });
    });

    const initBetQueue = (placeBet) => {
        return new RebetProcessBetQueue({
            definition,
            gameData,
            placeBetPublisher,
            placeBet,
            logService,
            betsRepository,
            betLogsRepository,
            baseMetrics,
        });
    };

    const mockPlayer = () => {
        return {
            UID: 1,
            profile: { name: "player01", minBet: 1, maxBet: 5000 },
            session: {
                userId: 1,
                playerId: 1,
                siteId: "123456",
                currencyCode: "USD",
                currencyName: "USD",
                multiplier: 1000,
            },
            socketClient: {
                emit: jest.fn(),
            },
        };
    };

    const mockPayload = (roundId = 1, freeBet = false) => {
        return {
            freeBet,
            amount: chance.natural(),
            betChoice: "red2",
            roundId,
            receivedTime: new Date(),
            time: new Date(),
        };
    };
});
