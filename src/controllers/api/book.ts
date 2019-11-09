import { Request, Response, NextFunction } from "express";
import { Book, BookDocument } from "../../models/Book";
import { ReqError } from "../req-error";
import { Helper, convertStringToArray } from "../../util/helper";
import { ListResponse } from "../../util/type";
import mongoose, { mongo } from "mongoose";


export class BookController {
    public static async getById(req: Request, res: Response) {
        const id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            try {
                const book = await Book.findById({ _id: id });
                if (book) {
                    return res.status(200).json(await Helper.createBookResponse(book));
                }
                else {
                    return ReqError.bookNotFound(req, res);
                }
            } catch (error) {
                return ReqError.databaseError(res, error);
            }
        }
        else {
            return ReqError.badRequest(res, `invalid id '${id}'`);
        }

    }

    public static async getByCode(req: Request, res: Response) {
        const code = req.params.code;
        try {
            const book = await Book.findOne({ barCode: code });
            if (book) {
                return res.status(200).json(await Helper.createBookResponse(book));
            }
            else {
                return ReqError.bookNotFound(req, res);
            }
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }

    public static async post(req: Request, res: Response) {
        const body: any = req.body;
        console.log(body);
        const queryResult = await Book.findOne({ barCode: body.barCode });

        try {
            if (queryResult) {
                const quantity = (queryResult.quantity || 0) + Number.parseInt(body.quantity);
                const result = await Book.findOneAndUpdate(
                    {
                        _id: queryResult._id
                    },
                    {
                        quantity: quantity,
                        modifiedDate: new Date().getTime(),
                    });
                return res.status(200).json({
                    message: "success",
                    book: await Helper.createBookResponse(result)
                });
            }
            else {
                const now = new Date().getTime();
                let isSale = false;
                const authors = body.author ? await Helper.getIdOrCreateAuthors(body.author) : [];
                const categories = body.category ? await Helper.getIdOrCreateCategories(body.category) : [];
                if (body.saleOff && body.saleOff != 0) {
                    isSale = true;
                }
                const book = new Book({
                    barCode: body.barCode,
                    name: body.name.toLowerCase(),
                    cover: convertStringToArray(body.cover),
                    quantity: body.quantity || 0,
                    createdDate: now,
                    modifiedDate: now,
                    description: body.description,
                    overview: body.overview,
                    author: authors,
                    currencyUnit: body.currencyUnit || "VND",
                    price: body.price,
                    isSell: isSale,
                    selloff: body.saleOff,
                    tags: body.tags,
                    lang: body.lang,
                    category: categories,
                    publisher: body.publisher || null,
                    endSale: body.endSale,
                    startSale: body.startSale,
                    size: body.size || { l: null, w: null, h: null },
                    pageNumber: body.pageNumber || null,
                    publishedDate: body.publishedDate ? body.publishedDate : null,
                    weight: body.weight || null,
                });
                await book.save();
                res.status(200).json({
                    message: "success",
                    value: await Helper.createBookResponse(book),
                });
            }
        } catch (error) {
            if (error.name == "ValidationError") {
                return ReqError.badRequest(res, error);
            }
            return ReqError.databaseError(res, error);
        }
    }

    public static async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            try {
                const result = await Book.findByIdAndDelete({ _id: id });
                return res.status(200).json(await Helper.createBookResponse(result));
            } catch (error) {
                return ReqError.databaseError(res, error);
            }
        }
        else {
            return ReqError.badRequest(res, `invalid id '${id}`);
        }
    }

    public static async deleteAll(req: Request, res: Response) {
        try {
            const result = await Book.remove({});
            return res.status(200).json({
                ok: result.ok,
                n: result.n,

            });
        } catch (error) {
            return ReqError.databaseError(error, res);
        }
    }

    public static async postById(req: Request, res: Response) {
        const id = req.params.id;
        const body = req.body;
        if (mongoose.Types.ObjectId.isValid(id)) {
            try {
                const book = await Book.findById({ _id: id });
                
                if (book) {
                    const updateDoc = await Helper.createBookDoc(body, book);
                    let result = await book.update(updateDoc);
                    result = await Book.findById({ _id: id });
                    return res.status(200).json(await Helper.createBookResponse(result));
                }
            } catch (error) {
                return ReqError.databaseError(res, error);
            }
        }
        else {
            return ReqError.badRequest(res, `invalid id '${id}'`);
        }
    }

    public static async postByCode(req: Request, res: Response) {
        const code = req.params.code;
        const body = req.body;
        try {
            let book = await Book.findOne({ barCode: code });
            if (book) {
                const updateDoc = await Helper.createBookDoc(body, book);

                const result = await book.update(updateDoc);
                if (result.ok) {
                    book = await Book.findOne({ barCode: code });
                    return res.status(200).json({
                        message: "success",
                        book: await Helper.createBookResponse(book)
                    });
                }
                else {
                    return res.status(500).json({
                        code: 500,
                        error: "unknowned reason."
                    });
                }
            }
            else {
                return res.status(404).json({
                    code: 404,
                    error: `cannot find any book with code: ${code}`,
                });
            }
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }

    public static async getAll(req: Request, res: Response) {
        let name: string = req.query.name;
        const top: number = Number.parseInt(req.query.top) || 20;
        const skip: number = Number.parseInt(req.query.skip) || 0;
        const authorId: string = req.query.authorId;
        const query: any = {};
        if (name) {
            name = name.toLowerCase();
            query.name = { $regex: `.*${name}*.` };
        }

        if (mongoose.Types.ObjectId.isValid(authorId)) {
            query.author = authorId;
        }

        const totalCount = await Book.count(query);
        const books = await Book.find(query).sort({ createdDate: -1 }).skip(skip).limit(top);

        const canNext: boolean = totalCount > top + skip;
        const url = req.url.split("?")[0];

        const nextLink: string = canNext ? `${url}?${name ? "name=" + name + "&" : ""}&${authorId ? "authorId=" + authorId + "&" : ""}top=${top}&skip=${skip + top}` : null;
        const value = [];
        for (let i = 0; i < books.length; i++) {
            value.push(await Helper.createBookResponse(books[i]));
        }
        const response: ListResponse = {
            nextLink: nextLink,
            totalCount: totalCount,
            value: value,
        };
        return res.status(200).json(response);
    }

}