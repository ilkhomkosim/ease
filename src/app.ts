import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import {Server as SocketIOServer} from "socket.io";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";


const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions"
});

// 1- ENTRANCE
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));
app.use(cors({credentials:true, origin: true}));
app.use(cookieParser());

// 2- SESSIONS
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie: {
            maxAge: 1000* 3600 * 6 // 6 hours
        },
        store: store,
        resave: true, // oxirgi marta kirildi keyin yana oxirgi martadan keyin yana 6 soat yangilanadi
        saveUninitialized:true
    })
);
app.use(function(req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member; //global variable
    next();
})

// 3-VIEWS
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs")

// 4-ROUTERS
app.use("/admin", routerAdmin);  
app.use("/", router);             

const  server  = http.createServer(app)
const io = new SocketIOServer(server, {
    cors: {
        origin: true,
        credentials: true,
    },
})

let summaryClient = 0;
io.on("connection", (socket) => {
    summaryClient++;
    console.log(`Connection & total [${summaryClient}] `);
    

    socket.on("disconnect", () => {
        summaryClient--;
        console.log(`Disconnection & total [${summaryClient}]`);
    });
})
export default server;