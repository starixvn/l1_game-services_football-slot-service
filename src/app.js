import { Core } from "sc-game-base";
import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import ContainerRegistry from "./container-registry";
import { GameData, GameDefinition, ResultHelper } from "sc-slot-rng-game-base";

export const run = async () => {
    const definition = new GameDefinition(gameSettings, ResultHelper.generateResult, ResultHelper.getSettlementResult);
    const gameData = new GameData(gameSettings.durations.wholeRound);
    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("Football Slot", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
