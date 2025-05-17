// soumyagupta/Documents/stockwise/backend-api/src/models/product.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    symbol: string;
    name: string;
    currentPrice: number;
    marketCap: number;
    volume: number;
    lastUpdated: Date;
}

const productSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    volume: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', productSchema);