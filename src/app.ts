import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import cors from "cors";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as homeController from "./controllers/home";


// API keys and Passport configuration
import * as passportConfig from "./config/passport";
import { BookController } from "./controllers/api/book";
import { DocController } from "./controllers/doc";
import { AuthorController } from "./controllers/api/author";
import multer from "multer";
import { CategoryController } from "./controllers/api/category";
import { BannerController } from "./controllers/api/banner";
import { UserController } from "./controllers/user";
import { AuthController } from "./controllers/auth";
import { OrderController } from "./controllers/api/order";
import { ContactController } from "./controllers/api/contact";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

app.post("/auth/register", UserController.register);
app.post("/auth/login", UserController.login);

app.get("/api/books", BookController.getAll);
app.get("/api/books/id/:id", BookController.getById);
app.post("/api/books/id/:id", BookController.postById);
app.delete("/api/books/id/:id", BookController.deleteById);
app.get("/api/books/code/:code", BookController.getByCode);
app.post("/api/books/code/:code", BookController.postByCode);
app.post("/api/books", BookController.post);
app.get("/api/delete/books", BookController.deleteAll);

app.get("/api/authors", AuthorController.getAll);
app.get("/api/authors/id/:id", AuthorController.getById);
app.post("/api/authors/id/:id", AuthorController.postById);

app.get("/api/categories", CategoryController.getAllCategory);
app.post("/api/categories", CategoryController.addCategory);

app.get("/api/banners", BannerController.getAllBanner);
app.post("/api/banners", BannerController.addBanner);

app.post("/api/payment", OrderController.addOrder);

app.get("/api/orders", OrderController.getOrders);
app.get("/api/order/status/:id/:status", OrderController.setOrderStatus);
app.get("/api/order/:id", OrderController.getOrderById);

app.post("/api/contact", ContactController.addMessage);
app.get("/api/contact", ContactController.getMessage);
app.get("/doc", DocController.index);

export default app;
