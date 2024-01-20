import axios, { AxiosResponse } from "axios";
import { Response } from "express";
import { ReqTyp } from "../../..";
import { getMarketTrendInfo } from "..";
import { getCurrencyHistoricalValues } from "../../currencyConversion";

const getMarketTrendInfoAggregate = async (req: ReqTyp, res: Response) => {
  const { date, country } = req.query as {
    [key: string]: string;
  };

  //Verify that the provided query params exist and are not falsy
  if (!date || !country) {
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
      throw new Error("GMTA02: Failed to fetch information.");
    }

    const modifiedTrends: Promise<number>[] =
      getMarketTrendResults.data.trends.map(async (trend) =>
        getCurrencyHistoricalValues(
          new Date(date),
          trend.from_symbol,
          trend.to_symbol,
          req.cacheClient
        )
      );

    await Promise.all(modifiedTrends).then((values) => {
      res.status(200).json({
        success: true,
        error: undefined,
        results: {
          trends: getMarketTrendResults.data.trends.map((trend, i) => ({
            ...trend,
            historical_value: values[i],
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
};

export { getMarketTrendInfoAggregate };
