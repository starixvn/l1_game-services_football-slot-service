import FootballSlotGameCron from "../../../src/crons/football-slot-game-cron";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import { GameData, GameDefinition } from "sc-slot-rng-game-base";
import { SettleGameRoundConsumer } from "sc-game-base/src/core/event-consumers";
import { GameStatusPublisher, RunningRoundInfoPublisher } from "sc-game-base/src/core/event-publishers";
import { logger } from "sc-common";
import { Bot } from "../../../src/crons";
import mongoose from "mongoose";
import { GameCron } from "sc-slot-rng-game-base/src/crons";

describe("FootballSlotGameCron", () => {
    const definition = new GameDefinition({
        durations: {
            wholeRound: 60,
            placingBets: 30,
        },
        luckyRoundDuration: 10,
    });
    const gameData = new GameData(0);
    gameData.remainingTime = 60;
    (gameData.ischeckGameStatus = false), (gameData.disabled = false), (gameData.numberOfLuckyRounds = 0);

    /** @type {Bot}*/
    const bot = stub(Bot);

    /** @type {SettleGameRoundConsumer}*/
    let settleGameRoundConsumer = stub(SettleGameRoundConsumer);

    /** @type {GameStatusPublisher}*/
    const gameStatusPublisher = stub(GameStatusPublisher);

    /** @type {RunningRoundInfoPublisher}*/
    const runningRoundInfoPublisher = stub(RunningRoundInfoPublisher);

    /** @type {logger}*/
    const logService = stub(logger);

    /** @type {mongoose.Model}*/
    const roundsRepository = stubMongoose(mongoose.Model);

    const gameCron = new FootballSlotGameCron({
        definition: definition,
        gameData: gameData,
        bot: bot,
        settleGameRoundConsumer: settleGameRoundConsumer,
        gameStatusPublisher: gameStatusPublisher,
        runningRoundInfoPublisher: runningRoundInfoPublisher,
        logService: logService,
        roundsRepository: roundsRepository,
    });
    settleGameRoundConsumer = {
        generateResult: jest.fn().mockResolvedValue("mockResult"),
        settleRound: jest.fn().mockResolvedValue(),
    };

    it("inherit BaseGameCron", () => {
        expect(gameCron instanceof GameCron);
    });

    describe("proceed", () => {
        it("should check game status if remainingTime >= wholeRound and ischeckGameStatus is false", async () => {
            spyOn(GameCron.prototype, "checkGameStatus");
            gameData.remainingTime = 60;
            gameData.ischeckGameStatus = false;

            await gameCron.proceed();

            expect(GameCron.prototype.checkGameStatus).toHaveBeenCalled();
            expect(gameData.ischeckGameStatus).toBe(true);
        });

        it("should decrease remainingTime if game is not disabled", async () => {
            gameData.remainingTime = 50;
            await gameCron.proceed();

            expect(gameData.remainingTime).toBe(49);
        });

        it("should reset for a new round if it's the starting time", async () => {
            gameData.remainingTime = definition.durations.wholeRound;
            gameCron.isStartingTime = jest.fn().mockReturnValue(true);
            spyOn(GameCron.prototype, "checkGameStatus");
            spyOn(GameCron.prototype, "resetForNewRound");

            await gameCron.proceed();

            expect(GameCron.prototype.resetForNewRound).toHaveBeenCalled();
            expect(bot.reset).toHaveBeenCalled();
        });

        it("should run bot and publish round info when remainingTime is below placingBets", async () => {
            gameData.remainingTime = definition.durations.placingBets - 1;

            await gameCron.proceed();

            expect(bot.run).toHaveBeenCalled();
            expect(runningRoundInfoPublisher.publish).toHaveBeenCalled();
        });
    });
});
