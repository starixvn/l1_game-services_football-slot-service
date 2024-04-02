import { helpers } from "sc-common";
import { Table } from "sc-game-base";
import { chips } from "../constants";

export default class Bot extends Table.Crons.TableGameBot {
    constructor(definition, gameData, publisher, userInfosRepository, tempBetsRepository) {
        super(definition, gameData, publisher, userInfosRepository, tempBetsRepository);

        this.betChoiceRatio = { Main: 80, BigSmall: 20 };
        this.mainOpts = ["bar", "tripleSeven", "watermelon", "star", "bell", "orange", "lemon", "cherry"];
        this.bigSmallOpts = ["big", "small"];
    }

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            bar: 0,
            tripleSeven: 0,
            watermelon: 0,
            star: 0,
            bell: 0,
            orange: 0,
            lemon: 0,
            cherry: 0,
            big: 0,
            small: 0,
        };

        this.smallTickets = 0;
    }

    getBetChoice(bot) {
        const totalBotBet = this.getAllBetAmount();

        const betChoiceRatios = [
            {
                group: this.mainOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.mainOpts) * 100) / totalBotBet < this.betChoiceRatio.Main,
            },
            {
                group: this.bigSmallOpts,
                underBetRatio: (this.getTotalAmountOnChoiceGroup(this.bigSmallOpts) * 100) / totalBotBet < this.betChoiceRatio.BigSmall,
            },
        ];

        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));

        return this.getRandomChoiceFromGroup(underRatioGroups.length > 0 ? underRatioGroups[0].group : this.mainOpts);
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        const maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.mainOpts.includes(choice) || this.bigSmallOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3);
            return isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.min(minBet * 50, maxBet * 0.2);
    }

    getRandomChoiceFromGroup(group) {
        return this.chance.pickone(group);
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice] ?? 0));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice] ?? 0));

        return total;
    }

    convertAmountToChip(amount) {
        const chipList = chips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }

    updateBotInRoomData(bot, choice, amount, balance) {
        super.updateBotInRoomData(bot, choice, amount, balance);

        this.allBets[choice] = this.allBets[choice] ? this.allBets[choice] + amount : amount;
        this.smallTickets += this.isSmallTicket(amount) ? 1 : 0;
    }
}
