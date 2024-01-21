import axios, { AxiosResponse } from "axios";
import { Response } from "express";
import { ReqTyp } from "../..";
import { T_GetCurrencyHistoricalValues } from "../../../common/types";
import { T_RedisClientType } from "../../types/redis";

const getCurrencyHistoricalValues = async (
  date: Date,
  currency_base: string,
  currencies_compare: string,
  cachceDbClient?: T_RedisClientType
): Promise<number> => {
  try {
    const dataCacheKey = `${currency_base}/${currencies_compare}:${date.toDateString()}`;

    if (cachceDbClient) {
      const getCacheValue = await cachceDbClient.get(dataCacheKey);

      if (getCacheValue) {
        return parseFloat(getCacheValue);
      }
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
      throw new Error("GCHV02: Failed to fetch information.");
    }
    const historicalValue = response.data.rates[currencies_compare];

    if (cachceDbClient) {
      await cachceDbClient.set(dataCacheKey, historicalValue);
    }

    return historicalValue;
  } catch (error) {
    console.error(error);
    throw new Error(`GCHV03: ${error}`);
  }
};

const getCurrencyHistoricalResults = async (req: ReqTyp, res: Response) => {
  const { date, currency_base, currencies_compare } = req.query as {
    [key: string]: string;
  };

  if (!date || !currency_base || !currencies_compare) {
    return res.status(400).json({
      success: false,
      error: "GCHR01: Country code required.",
    });
  }

  try {
    const getresults = await getCurrencyHistoricalValues(
      new Date(date),
      currency_base,
      currencies_compare,
      req.cacheClient
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
};

export { getCurrencyHistoricalResults, getCurrencyHistoricalValues };
