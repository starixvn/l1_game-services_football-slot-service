import { asClass } from "awilix";
import { Crons, Consumers, Routers } from "sc-rebet-mode";
import { TablePlaceBetPublisher } from "sc-rebet-mode/src/publishers";
import RebetProcessBetQueue from "./crons/rebet-process-bet-queue";

export default class RebetContainerRegistry {
    registerTableGame(baseSocketRouter) {
        return {
            rebetConsumer: asClass(Consumers.RebetConsumer).singleton(),
            socketRouter: asClass(Routers.SocketRouter).proxy(),
            baseSocketRouter: asClass(baseSocketRouter).proxy(),

            rebetProcessor: asClass(Crons.ReBetProcessor).singleton().proxy(),
            processBetQueue: asClass(RebetProcessBetQueue).singleton().proxy(),
            placeBetPublisher: asClass(TablePlaceBetPublisher).singleton(),
        };
    }
}
