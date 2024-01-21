import { AxiosResponse } from "axios";
import React from "react";
import { UseQueryResult, useQuery } from "react-query";
import { QueryResponse } from "../../../../common/types";
import { api } from "../../utils/api/api";
import loadingComponent from "../loader";

type CurrencyPairHistoricalValueComponentProps = {
  date: string;
  currency_base: string;
  currencies_compare: string;
  latestValue: number;
};

const CurrencyPairHistoricalValueComponent = ({
  date,
  currency_base,
  currencies_compare,
  latestValue,
}: CurrencyPairHistoricalValueComponentProps) => {
  const getTrends = () => {
    return api(
      `/conversion/getCurrencyHistoricalValues?date=${date}&currency_base=${currency_base}&currencies_compare=${currencies_compare}`,
      {},
      "GET"
    );
  };

  // Queries
  const {
    isLoading,
    isFetching,
    data: query,
    error,
  }: UseQueryResult<AxiosResponse<QueryResponse<number>>> = useQuery({
    queryKey: [
      "trendHistoricalValue",
      date,
      `${currency_base}/${currencies_compare}`,
    ],
    queryFn: getTrends,
    enabled: Boolean(date && currency_base && currencies_compare),
  });

  if (isLoading || isFetching) return loadingComponent();

  const historicalValue = query?.data.results;

  if (error || !historicalValue) return <p>...</p>;

  return (
    <p style={{ color: historicalValue > latestValue ? "red" : "green" }}>
      {historicalValue}
    </p>
  );
};

export default CurrencyPairHistoricalValueComponent;
