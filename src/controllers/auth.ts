import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { ReqError } from "./req-error";

export class AuthController {
  public static async auth(req: Request, res: Response, next: NextFunction) {
      if (!req.body.token) {
        return ReqError.authError(req, res);
      }
      jwt.verify(req.body.token, "hm", async function(err: any, decoded: any) {
        if (err) {
          console.log(err);
        }
        else {
          const user = await User.find({"email": decoded.email});
          if (user) {
            req.user = user;
            next();
          }
          else {
            return ReqError.authError(req, res);
          }
        }
      });
  }
}