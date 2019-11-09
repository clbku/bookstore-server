import {Request, Response} from "express";
import { Helper } from "../../util/helper";
import { ReqError } from "../req-error";
import { Category, CategoryDocument } from "../../models/Category";

export class CategoryController{

    public static async getAllCategory(req: Request, res: Response){
        try {
            const categories = await Category.find({});
            if (categories) {
                return res.status(200).json({categories});
            }
            else {
                return res.status(200).json({"categories": []});
            }
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }

    public static async addCategory(req: Request, res: Response){

        console.log(req.body.categories);

        try {
            // const categories = await Category.find({});
            // if (categories) {
            //     return res.status(200).json(categories);
            // }
            // else {
            //     return res.status(200).json({"categories": []});
            // }
            req.body.categories.forEach(async (cate: CategoryDocument) => {
                await (new Category(cate)).save();
                
            });
            return res.status(200).json("ok");
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }
    
}