type T_GetMarketTrendInfoResultTrends = {
  from_symbol: string;
  to_symbol: string;
  type: string;
  from_currency_name: string;
  to_currency_name: string;
  exchange_rate: number;
  previous_close: number;
  last_update_utc: string;
  google_mid: string;
};

type T_GetMarketTrendInfoResultNews = {
  article_title: string;
  article_url: string;
  article_photo_url: string;
  source: string;
  post_time_utc: Date;
};

type T_GetMarketTrendInfoResult = {
  status: string;
  request_id: string;
  data: {
    trends: T_GetMarketTrendInfoResultTrends[];
    news: T_GetMarketTrendInfoResultNews[];
  };
};

type T_GetCurrencyHistoricalValues = {
  success: boolean;
  timestamp: number;
  historical: boolean;
  base: string;
  date: Date;
  rates: { [key: string]: number };
};

type T_GetMarketTrendInfoAggregate = T_GetMarketTrendInfoResultTrends & {
  historical_value: number;
};

export type {
  T_GetMarketTrendInfoResult,
  T_GetCurrencyHistoricalValues,
  T_GetMarketTrendInfoAggregate,
};
