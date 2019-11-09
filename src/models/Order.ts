import mongoose from "mongoose";

export type OrderDocument = mongoose.Document & {
    _id: string;
    user: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    note: string;
    orders: [{
      id: string;
      qty: number;
    }];
    shippingUnit: string;
    paymentMethod: string;
    status: number;
}

const orderSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  note: String,
  products: [{
    id: String,
    qty: Number
  }],
  shippingUnit: String,
  paymentMethod: String,
  status: Number
}, {timestamps: true});

export const Order = mongoose.model<OrderDocument>("order", orderSchema);