import ContainerRegistry from "../../src/container-registry";
import { Table, Core } from "sc-game-base";
import RebetContainerRegistry from "../../src/rebet-container-registry";
import { InjectionMode } from "awilix";
import { TableContainerRegistry } from "sc-game-base/src/table";
jest.mock(
    "awilix",
    () => {
        return {
            asValue: jest.fn((t) => t),
            asClass: () => ({ singleton: () => ({ proxy: () => {} }) }),
            InjectionMode: jest.fn(() => {}),
            createContainer: jest.fn(() => {}),
        };
    },
    { virtual: true }
);

describe("ContainerRegistry", () => {
    let containerRegistry, appConfigs, definition, gameData;
    const defaultInjectionMode = InjectionMode.CLASSIC;

    describe("extends", () => {
        it("inherit TableContainerRegistry", () => {
            // arrange
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);

            //assert
            expect(containerRegistry instanceof Table.TableContainerRegistry);
        });
    });

    describe("registerModels", () => {
        it("should register models correctly", () => {
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };
            containerRegistry.registerModels();
            expect(containerRegistry.container.register).toBeCalledWith({
                roundsRepository: expect.any(Function),
                betsRepository: expect.any(Function),
                tempBetsRepository: expect.any(Function),
                betLogsRepository: expect.any(Function)
            });
        });
    });

    describe("registerCrons", () => {
        it("should register bot and gameCron correctly", () => {
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };
            containerRegistry.registerCrons();

            expect(containerRegistry.container.register).toBeCalled();
        });
    });

    describe("registerConsumers", () => {
        it("should register settleGameRoundConsumer correctly", () => {
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };
            containerRegistry.registerConsumers();

            expect(containerRegistry.container.register).toBeCalled();
        });
    });

    describe("registerApis", () => {
        it("should register historyQuery correctly", () => {
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };
            containerRegistry.registerApis();

            expect(containerRegistry.container.register).toBeCalledWith({
                historyQuery: expect.any(Object),
            });
        });
    });

    describe("register", () => {
        it("should register RebetContainerRegistry correctly", () => {
            const mockContainerSuper = jest.spyOn(TableContainerRegistry.prototype, "register").mockReturnValue("mockRouter");
            const mockRegisterTableGame = jest.spyOn(RebetContainerRegistry.prototype, "registerTableGame").mockReturnValue("mockRouter");
            const containerRegistry = new ContainerRegistry(defaultInjectionMode);
            containerRegistry.container = { register: jest.fn() };
            containerRegistry.register(appConfigs, definition, gameData);

            expect(mockRegisterTableGame).toHaveBeenCalledWith(Core.Routers.BaseSocketRouter);
        });
    });
});
