import mongoose from "mongoose";

export type AuthorDocument = mongoose.Document & {
    _id: string;
    name: string;
    fullName: string;
    birthday: string;
    description: string;
}

const authorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    fullName: String,
    birthday: String,
    description: String,
});

export const Author = mongoose.model<AuthorDocument>("author", authorSchema);