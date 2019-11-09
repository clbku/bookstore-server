import {Request, Response} from "express";
import { ReqError } from "../req-error";
import { Banner, BannerDocument } from "../../models/Banner";

export class BannerController{

    public static async getAllBanner(req: Request, res: Response){
        try {
            const banners = await Banner.find({});
            if (banners) {
                return res.status(200).json({banners});
            }
            else {
                return res.status(200).json({"banners": []});
            }
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }

    public static async addBanner(req: Request, res: Response){

        try {
            req.body.banners.forEach(async (banner: BannerDocument) => {
                await (new Banner(banner)).save();
            });
            return res.status(200).json("ok");
        } catch (error) {
            return ReqError.databaseError(res, error);
        }
    }
    
}