import {Request, Response} from "express";
import { Helper } from "../../util/helper";
import { ReqError } from "../req-error";
import { Delivery } from "../../models/Delivery";

export class DeliveryController{

    public static async create(req: Request, res: Response) {
      try {
        await (new Delivery(req.body)).save();
        return res.status(200).json({status: "ok"});
      }
      catch (err) {
        return res.status(500).json({status: "fail", message: err.message});
      }
    }
    
}