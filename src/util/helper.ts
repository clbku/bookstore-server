import { Author, AuthorDocument, } from "../models/Author";
import { BookDocument, Book } from "../models/Book";
import mongoose from "mongoose";
import { AuthorResponse, BookResponse, CategoryResponse } from "./type";
import { CategoryDocument, Category } from "../models/Category";

const getPersonalName = (name: string): string => {
    if (name) {
        return name
            .split(" ")
            .map(part => {
                return part ? part[0].toUpperCase() + part.substring(1) : "";
            }).join(" ");
    }
    return "";
};

export const convertStringToArray = (object: any) => {
    return (typeof object === "string") ? Array(object) : object;
};

export class Helper {
    public static async getAuthorById(id: string): Promise<AuthorDocument> {
        const author = await Author.findById({ _id: id });
        return author;
    }

    public static async isCategoryExisted(name: string): Promise<boolean> {
        const category = await Author.findOne({ name });
        return category ? true : false;
    }

    public static async getAuthorByName(name: string): Promise<AuthorDocument[]> {
        const author = await Author.find({ name: name });
        return author;
    }

    public static async createAuthorResponse(author: AuthorDocument): Promise<AuthorResponse> {
        const ownBooks = await Book.count({ author: author._id });
        const result: AuthorResponse = {
            id: author._id,
            name: getPersonalName(author.name),
            fullName: getPersonalName(author.fullName),
            birthday: author.birthday || "",
            description: author.description || "",
            bookCount: ownBooks,
        };


        // result.bookCount = ownBooks.length;
        // result.book = ownBooks.map(book => {
        //     return {
        //         id: book._id,
        //         barCode: book.barCode,
        //     };
        // });

        return result;
    }

    /**
     * 
     * @param authors author's id or name
     * return author's id
     */
    public static async getIdOrCreateAuthors(authors: string[]): Promise<string[]> {
        if (authors && authors.length > 0) {
            const result = [];
            authors = convertStringToArray(authors);
            for (let i = 0; i < authors.length; i++) {
                const auth = authors[i];
                let author: AuthorDocument;
                if (mongoose.Types.ObjectId.isValid(auth)) {
                    author = await this.getAuthorById(auth);
                }
                if (author) {
                    result.push(author._id);
                }
                else {
                    const author = new Author({
                        name: auth.toLowerCase(),
                        fullName: auth.toLowerCase(),
                    });
                    const saved = await author.save();
                    result.push(saved._id);
                }

            }
            return result;
        }
        return [];
    }

    public static async getIdOrCreateCategories(categories: string[]): Promise<string[]> {
        if (categories && categories.length > 0) {
            const result = [];
            categories = convertStringToArray(categories);
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                if (this.isCategoryExisted(category)) {
                    result.push(category);
                }
                else {
                    const cate = new Category({
                        name: category,
                        sub: []
                    });
                    const saved = await cate.save();
                    result.push(saved._id);
                }

            }
            return result;
        }
        return [];
    }

    public static async createBookDoc(body: any, book: BookDocument) {
        const now = new Date().getTime();

        const authors = await Helper.getIdOrCreateAuthors(body.author);

        const updateDoc = {
            name: body.name ? body.name.toLowerCase() : book.name,
            cover: body.cover || book.cover,
            quantity: body.quantity || book.quantity,
            modifiedDate: now,
            description: body.description || book.description,
            overview: body.overview || book.overview,
            author: body.author ? convertStringToArray(authors) : book.author,
            currencyUnit: body.currencyUnit || book.currencyUnit,
            price: body.price || book.price,
            isSell: body.isSell || book.isSell,
            selloff: body.selloff || book.selloff,
            tags: body.tags || book.tags,
            lang: body.lang || book.lang,
            category: body.category || book.category,
            publisher: body.publisher || book.publisher,
            size: body.size || book.size,
            pageNumber: body.pageNumber || book.pageNumber,
            publishedDate: body.publishedDate ? body.publishedDate : book.publishedDate,
            weight: body.weight || book.weight,
        };
        return updateDoc;
    }

    public static async createBookResponse(book: BookDocument): Promise<BookResponse> {
        const result: any = {
            id: book._id,
            name: getPersonalName(book.name),
            cover: book.cover || [],
            barCode: book.barCode,
            createdDate: new Date(book.createdDate),
            modifiedDate: new Date(book.modifiedDate),
            description: book.description || "",
            author: [],
            overview: book.overview || "",
            price: book.price || 0,
            isSell: book.isSell || false,
            selloff: book.selloff || 0,
            finalPrice: book.getPriceAfterSell(),
            currencyUnit: book.currencyUnit || "VND",
            tags: book.tags || [],
            lang: book.lang || "",
            quantity: book.quantity || 0,
            category: book.category || [],
            publisher: book.publisher || null,
            size: book.size || { l: null, w: null, h: null },
            pageNumber: book.pageNumber || null,
            publishedDate: book.publishedDate ? new Date(book.publishedDate) : null,
            weight: book.weight || null,
        };

        if (book.author) {
            for (let i = 0; i < book.author.length; i++) {
                const authorId = book.author[i];
                const author = await this.getAuthorById(authorId);
                result.author.push({
                    id: author._id,
                    name: getPersonalName(author.name),
                });
            }
        }

        return result;
    };
}