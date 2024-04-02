import mongoose from "mongoose";

const modelName = "fruitslot_rounds";

const resultSchema = new mongoose.Schema(
    {
        symbols: { type: Object, required: true },
        symbolPositions: { type: Array },
        number: { type: Number, required: true },
        isLucky: { type: Boolean, default: false },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        bar: { type: Boolean, default: false },
        bar25: { type: Boolean, default: false },
        bar50: { type: Boolean, default: false },
        tripleSeven: { type: Boolean, default: false },
        tripleSeven3: { type: Boolean, default: false },
        watermelon: { type: Boolean, default: false },
        watermelon3: { type: Boolean, default: false },
        star: { type: Boolean, default: false },
        star3: { type: Boolean, default: false },
        bell: { type: Boolean, default: false },
        bell3: { type: Boolean, default: false },
        orange: { type: Boolean, default: false },
        orange3: { type: Boolean, default: false },
        lemon: { type: Boolean, default: false },
        lemon3: { type: Boolean, default: false },
        cherry: { type: Boolean, default: false },
        cherry3: { type: Boolean, default: false },
        lucky: { type: Boolean, default: false },
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, required: true },
});

export default mongoose.model(modelName, Schema);
