import mongoose from "mongoose";

export type CategoryDocument = mongoose.Document & {
    _id: string;
    name: string;
    sub: string[];
}

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    sub: [],
});

export const Category = mongoose.model<CategoryDocument>("category", categorySchema);