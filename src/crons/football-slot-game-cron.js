import { GameCron } from "sc-slot-rng-game-base/src/crons";

export default class FootballSlotGameCron extends GameCron {
    async proceed() {
        const { durations, luckyRoundDuration } = this.definition;
        const { wholeRound, placingBets } = durations;
        const { ischeckGameStatus } = this.gameData;

        if (!ischeckGameStatus && this.gameData.remainingTime >= wholeRound) {
            await this.checkGameStatus();
            !this.gameData.disabled && (this.gameData.ischeckGameStatus = true);
        }

        if (!this.gameData.disabled) {
            this.gameData.remainingTime--;
        }

        if (this.isStartingTime(this.gameData.remainingTime, durations)) {
            this.resetForNewRound();
            this.bot && (await this.bot.reset());
        }

        if (this.gameData.remainingTime === durations.placingBets) {
            this.gameStatusPublisher.publishStartPlacingBetStatus();
        }

        if (this.gameData.remainingTime < 0) {
            this.gameData.ischeckGameStatus = false;
            const result = await this.settleGameRoundConsumer.generateResult();
            const { numberOfLuckyRounds } = this.gameData;
            const extendedLuckyTime = numberOfLuckyRounds > 0 ? numberOfLuckyRounds * luckyRoundDuration : 0;
            this.gameData.remainingTime = wholeRound + extendedLuckyTime;
            await this.settleGameRoundConsumer.settleRound(result);
        } else if (this.gameData.remainingTime < placingBets) {
            this.bot && (await this.bot.run());
            this.runningRoundInfoPublisher.publish();
        }
    }
}
