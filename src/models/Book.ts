import mongoose from "mongoose";

export type BookDocument = mongoose.Document & {
    _id: string;
    cover: string[];
    barCode: string;
    name: string;
    createdDate: number;
    modifiedDate: number;
    description: string;
    overview: string;
    author: string[];
    price: number;
    isSell: boolean;
    selloff: number;
    finalPrice: number;
    currencyUnit: string;
    tags: string[];
    quantity: number;
    lang: string;
    category: string[];
    publisher: string;
    size: {
        l: number;
        w: number;
        h: number;
    };
    pageNumber: number;
    publishedDate: number;
    weight: number;
    startSale: string;
    endSale: string;
    getPriceAfterSell:  GetNumberFunction;
}

type GetNumberFunction = () => number;


const bookSchema = new mongoose.Schema({
    barCode: {type: String, required: true},
    name: {type: String, required: true},
    cover: [String],
    createdDate: Number,
    modifiedDate: Number,
    description: String,
    overview: String,
    author: [String],
    price: Number,
    isSell: Boolean,
    selloff: Number,
    currencyUnit: String,
    tags: [String],
    lang: String,
    quantity: Number,
    category: [String],
    publisher: String,
    size: {
        l: Number,
        w: Number,
        h: Number,
    },
    startSale: String,
    endSale: String,
    pageNumber: Number,
    publishedDate: Number,
    weight: Number,
});

const getPriceAfterSell: GetNumberFunction = function () {
    if (this.isSell) {
        return this.price - Math.round(this.price * this.selloff);
    }
    return this.price;
};

bookSchema.methods.getPriceAfterSell = getPriceAfterSell;

export const Book = mongoose.model<BookDocument>("book", bookSchema);