import { GameData, GameDefinition } from "sc-slot-rng-game-base";
import { Bot } from "../../../src/crons";
import { stub, stubMongoose } from "jest-micro-auto-stub";
import { BaseEventPublisher } from "sc-game-base/src/core/event-publishers";
import mongoose from "mongoose";
import { chips } from "../../../src/constants";

describe("Bot", () => {
    const definition = new GameDefinition({
        id: 1,
        name: "game name",
        durations: { lockingBet: 5 },
        choicesMapper: { red2: 1 },
        choices: ["cup", "mascot", "big", "small"],
    });
    const gameData = new GameData(10);
    gameData.gameConfigs = {
        choices_maxbet: {
            cup: 5000,
            big: 2000,
            small: 2000,
        },
        bot_maxbet: 5000,
    };
    /** @type {BaseEventPublisher}*/
    const publisher = stub(BaseEventPublisher);

    /** @type {mongoose.Model}*/
    const tempBetsRepository = stubMongoose(mongoose.Model);
    const tableBot = new Bot(definition, gameData, publisher, tempBetsRepository);
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("inherit base bot", () => {
        expect(tableBot instanceof Bot);
    });

    describe("resetAllBets", () => {
        it("should reset all bets to 0", () => {
            tableBot.resetAllBets();
            expect(tableBot.allBets).toEqual({
                cup: 0,
                mascot: 0,
                franceShirt: 0,
                hostCountry: 0,
                englandShirt: 0,
                tickets: 0,
                ball: 0,
                shoes: 0,
                big: 0,
                small: 0,
            });
        });
    });

    describe("getBetChoice", () => {
        it("should return a valid choice from available options", () => {
            jest.spyOn(tableBot, "getAllBetAmount").mockReturnValue(1000);
            jest.spyOn(tableBot, "getTotalAmountOnChoiceGroup").mockReturnValue(100);

            const choice = tableBot.getBetChoice({});
            expect(tableBot.mainOpts.includes(choice) || tableBot.bigSmallOpts.includes(choice)).toBe(true);
        });
    });

    describe("getMaxBet", () => {
        it("should return correct max bet for a given choice", () => {
            jest.spyOn(tableBot, "getMinBet").mockReturnValue(1);

            const maxBet = tableBot.getMaxBet({}, "cup");
            expect(maxBet).toBe(50);
        });

        it("should return reduced bet when using small ticket logic", () => {
            tableBot.totalTickets = 100;
            tableBot.smallTickets = 30;
            tableBot.smallTicketRatio = 50;

            const maxBet = tableBot.getMaxBet({}, "big");
            expect(maxBet).toBe(50); // 30% of 2000
        });
    });

    describe("getRandomChoiceFromGroup", () => {
        it("should return a choice from the given group", () => {
            const group = ["cup", "mascot", "big", "small"];
            const choice = tableBot.getRandomChoiceFromGroup(group);
            expect(group.includes(choice)).toBe(true);
        });
    });

    describe("getTotalAmountOnChoiceGroup", () => {
        it("should return correct total amount for a choice group", () => {
            tableBot.allBets = { cup: 100, mascot: 200, big: 300, small: 400 };
            const total = tableBot.getTotalAmountOnChoiceGroup(["cup", "big"]);
            expect(total).toBe(100);
        });
    });

    describe("getAllBetAmount", () => {
        it("should return the total amount of all bets", () => {
            tableBot.allBets = { cup: 100, mascot: 200, big: 300, small: 400 };
            const total = tableBot.getAllBetAmount();
            expect(total).toBe(1000);
        });
    });

    describe("convertAmountToChip", () => {
        it("should return the highest possible chip that fits into amount", () => {
            const chip = tableBot.convertAmountToChip(150);
            expect(chip).toBe(chips.find((chip) => 150 / chip >= 1));
        });

        it("should return min bet if no chip fits", () => {
            jest.spyOn(tableBot, "getMinBet").mockReturnValue(10);
            const chip = tableBot.convertAmountToChip(5);
            expect(chip).toBe(5);
        });
    });
});
