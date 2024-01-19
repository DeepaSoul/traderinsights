import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import {
  T_GetCurrencyHistoricalValues,
  T_GetMarketTrendInfoResult,
} from "./types";
import ConnectToCache from "./connectCache";
import { T_RedisClientType } from "./types/redis";

const xss = require("xss-clean");

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// connect to cache db
// Using bellow redis type due to no
let cachceDbClient: T_RedisClientType;

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

const getMarketTrendInfo = async (
  country: string
): Promise<T_GetMarketTrendInfoResult> => {
  const options = {
    method: "GET",
    url: `${process.env.realTimeFinance_BaseUrl}/market-trends`,
    params: {
      trend_type: "CURRENCIES",
      country,
      language: "en",
    },
    headers: {
      "X-RapidAPI-Key": process.env.rapidapi_Key,
      "X-RapidAPI-Host": process.env.realTimeFinance_Host,
    },
  };

  try {
    const response: AxiosResponse<T_GetMarketTrendInfoResult> = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw `GMTI03: ${error}`;
  }
};

const getCurrencyHistoricalValues = async (
  date: Date,
  currency_base: string,
  currencies_compare: string
): Promise<number> => {
  try {
    const dataCacheKey = `${currencies_compare}:${date.toDateString()}`;
    const getCacheValue = await cachceDbClient.get(dataCacheKey);

    if (getCacheValue) {
      return parseFloat(getCacheValue);
    }

    const options = {
      method: "POST",
      url: `${process.env.exchangeRates_BaseUrl}/ExchangeHistorical`,
      headers: {
        "X-RapidAPI-Key": process.env.rapidapi_Key,
        "X-RapidAPI-Host": process.env.exchangeRates_Host,
      },
      data: {
        date,
        currency_base,
        currencies_compare,
      },
    };
    const response: AxiosResponse<T_GetCurrencyHistoricalValues> =
      await axios.request(options);

    if (!response.data.success) {
      //report to an error handler, for now we will log our the result
      console.error("GCHV02", response.data);
      throw "GCHV02: Failed to fetch information.";
    }
    const historicalValue = response.data.rates[currencies_compare];
    await cachceDbClient.set(dataCacheKey, historicalValue);
    return historicalValue;
  } catch (error) {
    console.error(error);
    throw `GCHV03: ${error}`;
  }
};

app.get("/getMarketTrendInfo", async (req: Request, res: Response) => {
  if (!req.query.country) {
    return res.status(400).json({
      success: false,
      error: "GMTI01: Country code required.",
    });
  }

  try {
    const getresults = await getMarketTrendInfo(req.query.country as string);

    if (getresults.status !== "OK") {
      //report to an error handler, for now we will log our the result
      console.error("GMTI02", getresults);
      throw "GMTI02: Failed to fetch information.";
    }

    return res.status(200).json({
      success: true,
      error: undefined,
      results: getresults.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

app.get("/getCurrencyHistoricalValues", async (req: Request, res: Response) => {
  const { date, currency_base, currencies_compare } = req.query as {
    [key: string]: string;
  };

  if (
    !Boolean(date) ||
    !Boolean(currency_base) ||
    !Boolean(currencies_compare)
  ) {
    return res.status(400).json({
      success: false,
      error: "GCHV01: Country code required.",
    });
  }

  try {
    const getresults = await getCurrencyHistoricalValues(
      new Date(date),
      currency_base,
      currencies_compare
    );

    return res.status(200).json({
      success: true,
      error: undefined,
      results: getresults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

app.get("/getMarketTrendInfoAggregate", async (req: Request, res: Response) => {
  const { date, country } = req.query as {
    [key: string]: string;
  };

  //Verify that the provided query params exist and are not falsy
  if (!Boolean(date) || !Boolean(country)) {
    return res.status(400).json({
      success: false,
      error: "GMTA01: Country code required.",
    });
  }

  try {
    const getMarketTrendResults = await getMarketTrendInfo(country);

    if (getMarketTrendResults.status !== "OK") {
      //report to an error handler, for now we will log our the result
      console.error("GMTI02", getMarketTrendResults);
      throw "GMTA02: Failed to fetch information.";
    }

    const modifiedTrends: Promise<number>[] =
      getMarketTrendResults.data.trends.map(async (trend) =>
        getCurrencyHistoricalValues(
          new Date(date),
          trend.from_symbol,
          trend.to_symbol
        )
      );

    await Promise.all(modifiedTrends).then((values) => {
      res.status(200).json({
        success: true,
        error: undefined,
        results: {
          trends: getMarketTrendResults.data.trends.map((trend, i) => ({
            ...trend,
            historical_value: values[i]
          })),
          news: getMarketTrendResults.data.news,
        },
      });
    });

    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

app.listen(port, async () => {
  try {
    //connect to redis to be able to retrive cached data.
    cachceDbClient = await ConnectToCache();
    console.log(`Connected to redis at default port: 6379.`);
  } catch (error) {
    console.error("Failed to start and connect to redis.");
  }
  console.log(`Server is Fire at http://localhost:${port}`);
});
