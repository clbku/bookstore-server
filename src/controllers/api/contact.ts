import { Request, Response } from "express";
import { Contact } from "../../models/Contact";

export class ContactController {
  public static async addMessage(req: Request, res: Response) {
    try {
      await (new Contact(req.body)).save();
      return res.status(200).json({ status: "ok" });
    }
    catch (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }
  }

  public static async getMessage(req: Request, res: Response) {
    try {
      const contacts = await Contact.find({});
      return res.status(200).json({ contacts });
    }
    catch (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }
  }
}