"use strict";

import { Response, Request, NextFunction } from "express";
 
const bookResponse = [  
    {
        p: "barCode",
        t: "string",
    },
    {
        p: "name",
        t: "string",
    },
    {
        p: "createdDate",
        t: "Date",
    },
    {
        p: "modifiedDate",
        t: "Date",
    },  
    {
        p: "description",
        t: "string",
    },
    {
        p: "overview",
        t: "string",   
    },
    {
        p: "author",
        t: "string[]",
    },
    {
        p: "price",
        t: "number",
    },
    {
        p: "isSell",
        t: "boolean",
    },
    {
        p: "selloff",
        t: "number",
    },
    {
        p: "finalPrice",
        t: "number",
    },
    {
        p: "currencyUnit",
        t: "string",
    },
    {
        p: "tags",
        t: "string[]",
    },
    {
        p: "quantity",
        t: "number",
    },
    {
        p: "lang",
        t: "string",
    },
    {
        p: "category",
        t: "string[]",
    },
    {
        p: "publisher",
        t: "string",
    },
    {
        p: "pageNumber",
        t: "number",
    },
    {
        p: "publishedDate",
        t: "number",
    },
    {
        p: "weight",
        t: "number",
    },
];

const size = [
    "l",
    "w",
    "h"
];

export class DocController {
    public static index = (req: Request, res: Response) => {
        res.render("doc/index", {
            title: "API Document",
            books: bookResponse,
            size: size,
        });
    };
}

