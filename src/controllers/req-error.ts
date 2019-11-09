import{Request, Response} from "express";

export class ReqError{
    public static invalidSecret(req: Request, res: Response){
        return res.status(403).json({
            code: 403,
            error: "invalid client secret"
        });
    }

    public static userNotFound(req: Request, res: Response){
        return res.status(404).json({
            code: 404,
            error: "cannot found user"
        });
    }

    public static authError(req: Request, res: Response){
        return res.status(401).json({
            code: 403,
            error: "invalid authorization request"
        });
    }

    public static bookNotFound(req: Request, res: Response){
        return res.status(404).json({
            code: 404,
            error: "cannot found book's id",
        });
    }

    public static notFound(res: Response, error: any){
        return res.status(404).json({
            code: 404,
            error: error,
        });
    }

    public static badRequest(res: Response, error: any){
        return res.status(403).json({
            code: 403,
            message: "Bad request",
            error: error.errors,
        });
    }

    public static databaseError(res: Response, error: any){
        return res.status(500).json({
            code: 500,
            message: "server internal error",
            error: error,
        });
    }
}