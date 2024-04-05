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
        cup: { type: Boolean, default: false },
        cup25: { type: Boolean, default: false },
        cup50: { type: Boolean, default: false },
        mascot: { type: Boolean, default: false },
        mascot3: { type: Boolean, default: false },
        franceShirt: { type: Boolean, default: false },
        franceShirt3: { type: Boolean, default: false },
        hostCountry: { type: Boolean, default: false },
        hostCountry3: { type: Boolean, default: false },
        englandShirt: { type: Boolean, default: false },
        englandShirt3: { type: Boolean, default: false },
        tickets: { type: Boolean, default: false },
        tickets3: { type: Boolean, default: false },
        ball: { type: Boolean, default: false },
        ball3: { type: Boolean, default: false },
        shoes: { type: Boolean, default: false },
        shoes3: { type: Boolean, default: false },
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
