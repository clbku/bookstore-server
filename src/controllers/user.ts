import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { Helper } from "../util/helper";
import { ReqError } from "./req-error";

export class UserController {
    public static async register(req: Request, res: Response) {
        const user = await (new User(req.body)).save();
        const accessToken = jwt.sign(JSON.stringify(user), "hm");
        return res.status(200).json({accessToken});
    }

    public static async login(req: Request, res: Response) {
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            user = await User.findOne({username: req.body.email});
            if (!user) {
                return ReqError.userNotFound(req, res);
            }
        }
        user.comparePassword(req.body.password, (err: any, isMatch: any) => {
            if (isMatch) {
                const accessToken = jwt.sign(JSON.stringify(user), "hm");
                return res.status(200).json({accessToken});
            }
            else {
                return ReqError.userNotFound(req, res);
            }
        });
    }
}