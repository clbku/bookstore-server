import {Request, Response, NextFunction} from "express";
import { Author } from "../../models/Author";
import { Helper } from "../../util/helper";
import { ListResponse } from "../../util/type";
import { ReqError } from "../req-error";
import mongoose from "mongoose";

export class AuthorController{

    public static async getById(req: Request, res: Response){
        const id = req.params.id;
        try {
            const author = await Author.findById({ _id: id });
            if (author) {
                return res.status(200).json(await Helper.createAuthorResponse(author));
            }
            else {
                return ReqError.bookNotFound(req, res);
            }
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }

    public static async post(req: Request, res: Response){
        const body: any = req.body;

        const author = new Author({
            name: body.name.toLowerCase(),
            fullName: body.fullName ? body.fullName.toLowerCase() : body.name.toLowerCase(),
            birthday: body.birthday,
            description: body.description,
        });
        try {
            await author.save();
            const result = await Helper.createAuthorResponse(author);
            return res.status(200).json({
                message: "success",
                value: result,
            });
        } catch (error) {
            if (error.name == "ValidationError") {
                return ReqError.badRequest(res, error);
            }
            return ReqError.databaseError(res, error);
        }
    }

    public static async postById(req: Request, res: Response){
        const id = req.params.id;
        const body = req.body;
        if(mongoose.Types.ObjectId.isValid(id)){
            let author = await Author.findById({_id: id});
            if(author){
                const updateDoc = {
                    name: body.name||author.name,
                    fullName: body.fullName ? body.fullName.toLowerCase() : author.fullName,
                    description: body.description || author.description,
                    birthday: body.birthday || author.birthday,
                };

                try {
                    await author.update(updateDoc);
                    author = await Author.findById({_id: author._id});
                    return res.status(200).json(await Helper.createAuthorResponse(author));
                } catch (error) {
                    return ReqError.databaseError(res, error);
                }
            }
            else{
                return ReqError.notFound(res, `cannot find any author with id: ${id}`);
            }
        }
        else{
            return ReqError.badRequest(res, "invalid 'id' value");
        }
    }

    public static async getAll(req: Request, res: Response){
        let name: string = req.query.name;
        const top: number = Number.parseInt(req.query.top) || 20;
        const skip: number = Number.parseInt(req.query.skip) || 0;
        const query: any = {};
        if(name){
            name = name.toLowerCase();
            query.name = {$regex: `.*${name}*.`};
        }
        const totalCount = await Author.count(query);
        const authors = await Author.find(query).sort({ createdDate: -1 }).skip(skip).limit(top);
        const canNext: boolean = totalCount > top + skip;
        const url = req.url.split("?")[0];

        const nextLink: string = canNext ? `${url}?top=${top}&skip=${skip + top}` : "";
        const value = [];
        for (let i = 0; i < authors.length; i++) {
            value.push(await Helper.createAuthorResponse(authors[i]));
        }

        const response: ListResponse = {
            nextLink: nextLink,
            totalCount: totalCount,
            value: value,
        };
        return res.status(200).json(response);
    }
    
}