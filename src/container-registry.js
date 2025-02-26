import awilix from "awilix";
import { Table, Core } from "sc-game-base";

import { footballSlotRounds, footballSlotTempBets, footballSlotBets, footballSlotBetLogs } from "./models";
import { SettleGameRoundConsumer } from "sc-slot-rng-game-base/src/consumers";
import { Bot, FootballSlotGameCron } from "./crons";
import HistoryQuery from "sc-slot-rng-game-base/src/query-apis/history-query";
import RebetContainerRegistry from "./rebet-container-registry";
const { asClass, asValue } = awilix;

export default class ContainerRegistry extends Table.TableContainerRegistry {
    register(appConfigs, definition, gameData) {
        super.register(appConfigs, definition, gameData);

        this.container.register(new RebetContainerRegistry().registerTableGame(Core.Routers.BaseSocketRouter));

        return this.container;
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(footballSlotRounds),
            betsRepository: asValue(footballSlotBets),
            betLogsRepository: asValue(footballSlotBetLogs),
            tempBetsRepository: asValue(footballSlotTempBets),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(FootballSlotGameCron).singleton().proxy(),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerApis() {
        super.registerApis();
        this.container.register({
            historyQuery: asClass(HistoryQuery).singleton(),
        });
    }
}
