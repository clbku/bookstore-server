import { Request, Response } from "express";
import { Order } from "../../models/Order";

export class OrderController {
  public static async addOrder(req: Request, res: Response) {
    try {
      const order = await (new Order({...req.body, status: 0})).save();
      return res.status(200).json({status: "success", id: order._id});
    }
    catch (err) {
      return res.status(500).json({status: "fail", message: err.message});
    }
  }

  public static async getOrders(req: Request, res: Response) {
    try {
      const orders = await Order.find({});
      return res.status(200).json({orders});
    }
    catch (err) {
      console.log(err.message);
      return res.status(500).json({orders: []});
    }
  }

  public static async getOrderById(req: Request, res: Response) {
    try {
      const order = await Order.findOne({_id: req.params.id});
      return res.status(200).json(order);
    }
    catch (err) {
      console.log(err.message);
      return res.status(500).json({});
    }
  }

  public static async setOrderStatus(req: Request, res: Response) {
    try {
      const order = await Order.findOne({_id: req.params.id});
      order.status = parseInt(req.params.status);
      await order.save();
      return res.status(200).json({status: "ok"});
    }
    catch (err) {
      console.log(err.message);
      return res.status(500).json({status: "fail", message: err.message});
    }
  }
}

