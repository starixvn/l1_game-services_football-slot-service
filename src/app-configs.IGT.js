import appConfigs from "./app-configs";

export default Object.assign(appConfigs, {
    database: {
        url: "mongodb://0.0.0.0:27017",
        options: {
            dbName: "game-service-test-db",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
});
