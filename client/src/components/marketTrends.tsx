import { useState } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { QueryResponse, T_MarketTrendsData } from "../../../common/types";
import { api } from "../utils/api/api";
import { dayBefore } from "../utils/constants";
import HeaderComponent from "./header";
import { AxiosResponse } from "axios";
import { formateDate } from "../utils";
import loadingComponent from "./loader";
import CurrencyPairHistoricalValueComponent from "./currencyHistoricalValue";

const MarketTrends = () => {
  const [date, setDate] = useState<string>(formateDate(dayBefore));

  const getTrends = () => {
    return api(`/trends/getMarketTrendInfo?country=us`, {}, "GET");
  };

  // Queries
  const {
    isLoading,
    data: query,
    error,
  }: UseQueryResult<
    AxiosResponse<QueryResponse<T_MarketTrendsData>>
  > = useQuery({
    queryKey: ["marketTrends"],
    queryFn: getTrends,
  });

  const trendResults = query?.data;
  const trends = trendResults?.results?.trends;
  const news = trendResults?.results?.news;

  const returnEmptyListComponent = (listName: string) => (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>{`No Market ${listName} Results`}</h2>
    </div>
  );

  return (
    <div>
      <HeaderComponent date={date} setDate={setDate} />
      <h2>Trends</h2>

      <div className="trendListContainer listheadings">
        <div>Market</div>
        <div>Current Rate</div>
        <div>Previous Close Rate</div>
        <div>{`Historical Value (${formateDate(new Date(date))})`}</div>
        <div>Last Updated At</div>
      </div>

      {isLoading
        ? loadingComponent()
        : !trends?.length || trends?.length < 0 || error
        ? returnEmptyListComponent("Trends")
        : trends?.map((trend) => (
            <div key={trend.google_mid} className="trendListContainer">
              <p>{`${trend.from_symbol}/${trend.to_symbol}`}</p>
              <p>{`${trend.exchange_rate}(${trend.to_symbol})`}</p>
              <p>{`${trend.previous_close}(${trend.to_symbol})`}</p>
              <CurrencyPairHistoricalValueComponent
                date={date}
                currency_base={trend.from_symbol}
                currencies_compare={trend.to_symbol}
                latestValue={trend.exchange_rate}
              />
              <p>{trend.last_update_utc}</p>
            </div>
          ))}

      <h2 style={{ marginTop: "5vh" }}>News</h2>

      <div className="newsListContainer">
        {isLoading
          ? loadingComponent()
          : !news?.length || news?.length < 0 || error
          ? returnEmptyListComponent("News")
          : news?.map((news) => (
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

export default MarketTrends;
