import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import ConnectToCache from "./connectCache";
import { T_RedisClientType } from "./types/redis";
import routes from "./routes";

export interface ReqTyp extends Request {
  cacheClient?: T_RedisClientType;
}

const xss = require("xss-clean");

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// connect to cache db
// Using bellow redis type due to no
let cachceDbClient: T_RedisClientType;

const initCache = async () => {
  try {
    //connect to redis to be able to retrive cached data.
    cachceDbClient = await ConnectToCache();

    console.log(`Connected to redis at default port: 6379.`);
  } catch (error) {
    console.error("Failed to start and connect to redis.");
  }
};
initCache();

app.use(express.json());

app.use(express.static(process.env.STATIC_DIR || "../client/build"));

// // Rate limiting
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 10 mins
  limit: 20,
  message: "Too many requests from this IP, please try again after an hour",
});
app.use(limiter);

app.use(
  cors({
    origin: true,
    methods: ["GET"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

const handleAddCacheClient = async (
  req: ReqTyp,
  res: Response,
  next: NextFunction
) => {
  req.cacheClient = cachceDbClient;
  next();
};

app.use(handleAddCacheClient);

// Mount routers
app.use(routes);

app.listen(port, async () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
