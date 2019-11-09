import mongoose from "mongoose";

export type ContactDocument = mongoose.Document & {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    header: string;
    content: string;
}

const contactSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  header: String,
  content: String,
}, {timestamps: true});

export const Contact = mongoose.model<ContactDocument>("contact", contactSchema);