import React, { useState } from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { QueryResponse, T_MarketTrendsData } from "../../../common/types";
import { api } from "../utils/api";
import { dayBefore } from "../utils/constants";
import HeaderComponent from "./header";
import { AxiosResponse } from "axios";

// const trendResults = {
//   success: true,
//   results: {
//     trends: [
//       {
//         from_symbol: "EUR",
//         to_symbol: "USD",
//         type: "currency",
//         from_currency_name: "Euro",
//         to_currency_name: "United States Dollar",
//         exchange_rate: 1.0915,
//         previous_close: 1.0915,
//         last_update_utc: "2024-01-20 10:27:00",
//         google_mid: "/g/11bvvzh029",
//       },
//       {
//         from_symbol: "USD",
//         to_symbol: "JPY",
//         type: "currency",
//         from_currency_name: "United States Dollar",
//         to_currency_name: "Japanese Yen",
//         exchange_rate: 148.14,
//         previous_close: 148.14,
//         last_update_utc: "2024-01-20 10:27:00",
//         google_mid: "/g/11bvvznqzd",
//       },
//       {
//         from_symbol: "GBP",
//         to_symbol: "USD",
//         type: "currency",
//         from_currency_name: "Pound sterling",
//         to_currency_name: "United States Dollar",
//         exchange_rate: 1.2704,
//         previous_close: 1.2704,
//         last_update_utc: "2024-01-20 10:38:00",
//         google_mid: "/g/11bvv_1vxq",
//       },
//       {
//         from_symbol: "USD",
//         to_symbol: "CAD",
//         type: "currency",
//         from_currency_name: "United States Dollar",
//         to_currency_name: "Canadian Dollar",
//         exchange_rate: 1.3463,
//         previous_close: 1.3463,
//         last_update_utc: "2024-01-20 10:27:00",
//         google_mid: "/g/11bvvzdz__",
//       },
//       {
//         from_symbol: "AUD",
//         to_symbol: "USD",
//         type: "currency",
//         from_currency_name: "Australian Dollar",
//         to_currency_name: "United States Dollar",
//         exchange_rate: 0.66,
//         previous_close: 0.66,
//         last_update_utc: "2024-01-20 10:27:00",
//         google_mid: "/g/11bvvzl6x6",
//       },
//     ],
//     news: [
//       {
//         article_title:
//           "GBP/USD: More range trading is likely for now – Scotiabank",
//         article_url:
//           "https://www.fxstreet.com/news/gbp-usd-more-range-trading-is-likely-for-now-scotiabank-202401191357",
//         article_photo_url:
//           "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRf1GiPLS4yly_cD_l4ehx0iS6rmuXvRpzhcv7rr4OJtEwjkKfsDQQgGybl-p8",
//         source: "FXStreet",
//         post_time_utc: "2024-01-19 13:57:00",
//         stocks_in_news: [
//           {
//             from_symbol: "GBP",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Pound sterling",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 1.2704,
//             previous_close: 1.2704,
//             last_update_utc: "2024-01-20 10:38:00",
//             google_mid: "/g/11bvv_1vxq",
//           },
//         ],
//       },
//       {
//         article_title:
//           "AUD/USD Forecast – Australian Dollar Continues to Test Support",
//         article_url:
//           "https://finance.yahoo.com/news/aud-usd-forecast-australian-dollar-140215562.html",
//         article_photo_url:
//           "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ4lQjBAdWWJQFJG6PVcm6shewNbnWKfkOGvonaIlQNPjkqemjytslzD0UX5SE",
//         source: "Yahoo Finance",
//         post_time_utc: "2024-01-18 14:02:15",
//         stocks_in_news: [
//           {
//             from_symbol: "AUD",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Australian Dollar",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 0.66,
//             previous_close: 0.66,
//             last_update_utc: "2024-01-20 10:27:00",
//             google_mid: "/g/11bvvzl6x6",
//           },
//         ],
//       },
//       {
//         article_title:
//           "USD/JPY Forecast – US Dollar Continues to go Higher Against The Yen",
//         article_url:
//           "https://finance.yahoo.com/news/usd-jpy-forecast-us-dollar-141825367.html",
//         article_photo_url:
//           "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcREr1PBI8uG_pAx6LogRwdv46YMFgUGmyTcrRP3NW3op-wxlsbhGEratwjU3NE",
//         source: "Yahoo Finance",
//         post_time_utc: "2024-01-17 14:18:25",
//         stocks_in_news: [
//           {
//             from_symbol: "JPY",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Japanese Yen",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 0.0068,
//             previous_close: 0.0068,
//             last_update_utc: "2024-01-20 10:38:00",
//             google_mid: "/g/11bvvzrnfv",
//           },
//         ],
//       },
//       {
//         article_title:
//           "EUR/USD: Range trading in the near term before rallying toward 1.1500 by \nyear-end – ING",
//         article_url:
//           "https://www.fxstreet.com/news/eur-usd-range-trading-in-the-near-term-before-rallying-toward-11500-by-year-end-ing-202401191534",
//         article_photo_url:
//           "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSKf_4muxtlNKh7mHz5FdclgZGlZbsBtPjADBCO3v_6O4CJxV5wb2o7oiLY23w",
//         source: "FXStreet",
//         post_time_utc: "2024-01-19 15:34:00",
//         stocks_in_news: [
//           {
//             from_symbol: "EUR",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Euro",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 1.0915,
//             previous_close: 1.0915,
//             last_update_utc: "2024-01-20 10:27:00",
//             google_mid: "/g/11bvvzh029",
//           },
//           {
//             symbol: "INGA:AMS",
//             type: "stock",
//             name: "ING Groep NV",
//             price: 12.742,
//             change: 0.044,
//             change_percent: 0.3465,
//             previous_close: 12.698,
//             pre_or_post_market: null,
//             pre_or_post_market_change: null,
//             pre_or_post_market_change_percent: null,
//             last_update_utc: "2024-01-19 17:00:00",
//             currency: "EUR",
//             exchange: "AMS",
//             exchange_open: "2024-01-19 09:00:00",
//             exchange_close: "2024-01-19 17:40:00",
//             timezone: "Europe/Paris",
//             utc_offset_sec: 3600,
//             country_code: "NL",
//             google_mid: "/g/1hbvs65qr",
//           },
//         ],
//       },
//       {
//         article_title:
//           "US Dollar Forecast: EUR/USD, GBP/USD, USD/CAD, USD/JPY, Gold",
//         article_url:
//           "https://www.forex.com/en-us/news-and-analysis/us-dollar-usd-forecast-eurusd-gbpusd-usdcad-usdjpy-gold-xauusd-1-19-24/",
//         article_photo_url:
//           "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQHNIkl7h7FMpX05dLzWTbT7tJhC3_q5Uq6ya-8-Ub_uHspHgoo_N7oLL16IQ",
//         source: "FOREX.com",
//         post_time_utc: "2024-01-19 07:53:32",
//         stocks_in_news: [
//           {
//             from_symbol: "GBP",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Pound sterling",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 1.2704,
//             previous_close: 1.2704,
//             last_update_utc: "2024-01-20 10:38:00",
//             google_mid: "/g/11bvv_1vxq",
//           },
//           {
//             from_symbol: "JPY",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Japanese Yen",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 0.0068,
//             previous_close: 0.0068,
//             last_update_utc: "2024-01-20 10:38:00",
//             google_mid: "/g/11bvvzrnfv",
//           },
//           {
//             from_symbol: "CAD",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Canadian Dollar",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 0.7427,
//             previous_close: 0.7427,
//             last_update_utc: "2024-01-20 10:39:00",
//             google_mid: "/g/11bvvzh84q",
//           },
//         ],
//       },
//       {
//         article_title:
//           "US Dollar Forecast – EUR/USD, USD/CAD and AUD/USD. Where to Next?",
//         article_url:
//           "https://www.dailyfx.com/news/forex-usd-dollar-forecast-eur-usd-usd-cad-and-aud-usd-where-to-next-20240119.html",
//         article_photo_url:
//           "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQy9Jt2W_JRq2N_qxCMYxAj6dJNYQB-024kdtay_j6uLKpAfOtyUZssFe66QN8",
//         source: "DailyFX",
//         post_time_utc: "2024-01-19 16:30:25",
//         stocks_in_news: [
//           {
//             from_symbol: "CAD",
//             to_symbol: "USD",
//             type: "currency",
//             from_currency_name: "Canadian Dollar",
//             to_currency_name: "United States Dollar",
//             exchange_rate: 0.7427,
//             previous_close: 0.7427,
//             last_update_utc: "2024-01-20 10:39:00",
//             google_mid: "/g/11bvvzh84q",
//           },
//         ],
//       },
//     ],
//   },
// };

const TrendList = () => {
  const [date, setDate] = useState<string>(dayBefore.toDateString());

  const getTrends = () => {
    return api(`/trends/getMarketTrendInfo?country=za`, {}, "GET");
  };

  // Queries
  const { status, data: query, error }: UseQueryResult<AxiosResponse<QueryResponse<T_MarketTrendsData>>> = useQuery({
    queryKey: ['marketTrends'],
    queryFn: getTrends,
    cacheTime: 5,
  })

  const trendResults = query?.data;

  console.log("trendResults", trendResults);

  return (
    <div>
      <HeaderComponent date={date} setDate={setDate} />
      <h2>Trends</h2>

      <div className="trendListContainer listheadings">
        <div>Market</div>
        <div>Current Rate</div>
        <div>Previous Close Rate</div>
        <div>{`Historical Value (${
          new Date(date).toLocaleString().split(",")[0]
        })`}</div>
        <div>Last Updated At</div>
      </div>

      {trendResults?.results.trends.map((trend) => (
        <div key={trend.google_mid} className="trendListContainer">
          <p>{`${trend.from_symbol}/${trend.to_symbol}`}</p>
          <p>{`${trend.exchange_rate}(${trend.to_symbol})`}</p>
          <p>{trend.previous_close}</p>
          <p>...</p>
          <p>{trend.last_update_utc}</p>
        </div>
      ))}

      <h2 style={{ marginTop: "5vh" }}>News</h2>

      <div className="newsListContainer">
        {trendResults?.results.news.map((news) => (
          <div key={news.article_url} className="newsListCard">
            <img
              alt={"Article header"}
              src={news.article_photo_url}
              height={60}
              width={60}
            />
            <p>{news.article_title}</p>
            <div className="newsListCardFooter">
              <p>Source: {news.source}</p>
              <p>Posted: {new Date(news.post_time_utc).toLocaleString()}</p>
              <a href={news.article_url} target="_blank" rel="noreferrer">
                {"Read ->"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendList;
