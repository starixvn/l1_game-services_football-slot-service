import mongoose from "mongoose";

const tempBetSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },

    bar: { type: Number, default: 0 },
    tripleSeven: { type: Number, default: 0 },
    watermelon: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    bell: { type: Number, default: 0 },
    orange: { type: Number, default: 0 },
    lemon: { type: Number, default: 0 },
    cherry: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },

    totalAmount: { type: Number, default: 0 },
    thanhtoan: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object, required: false },
};

const footballSlotBets = mongoose.model(
    "footballslot_bets",
    new mongoose.Schema({
        ...tempBetSchema,
        currency: { type: String, required: true },
        rate: { type: Number, required: true },
        operatorId: { type: String, required: true },
        playerId: { type: String, required: true },
        siteId: { type: String, required: true },
        freeBet: { type: Boolean, default: false },
    })
);

const betLogsSchema = {
    uid: { type: String, required: true },
    name: { type: String, required: true },
    roundId: { type: Number, required: true },

    amount: { type: Number, default: 0, required: true },
    choice: { type: String },
    subChoices: { type: Array },
    time: { type: Date },
    clientSentTime: { type: Date },
    receivedTime: { type: Date },

    playerId: { type: String, required: true },
    operatorId: { type: String, required: true },
    siteId: { type: String, required: true },
    freeBet: { type: Boolean },
    rate: { type: Number, required: true },
    rebet: { type: Boolean, default: false },
};

const footballSlotTempBets = mongoose.model("footballslot_tmpbets", new mongoose.Schema(tempBetSchema));
const footballSlotBetLogs = mongoose.model("footballslot_betlogs", betLogsSchema);

export { footballSlotTempBets, footballSlotBets, footballSlotBetLogs };
