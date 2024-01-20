import axios, { AxiosResponse } from "axios";
import { Response } from "express";
import { ReqTyp } from "../..";
import { T_GetMarketTrendInfoResult } from "../../../common/types";

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
    const response: AxiosResponse<T_GetMarketTrendInfoResult> =
      await axios.request(options);
    return response.data;
  } catch (error) {
    //report to an error handler, for now we will log our the result
    console.error(error);
    throw new Error(`GMTI03: ${error}`);
  }
};

const getMarketTrendInfoResults = async (req: ReqTyp, res: Response) => {
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
      throw new Error("GMTI02: Failed to fetch information.");
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
};

export { getMarketTrendInfoResults, getMarketTrendInfo };
