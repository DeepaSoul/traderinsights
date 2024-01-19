import React from "react";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { T_GetMarketTrendInfoResult } from "../../../common/types";
import { api } from "../utils/api";

const TrendList = () => {
  const queryClient = useQueryClient();

  const getTrends = () => {
    return api(`/getMarketTrendInfo?country=za`, {}, "GET");
  };

  // Queries
  const query: UseQueryResult<any> = useQuery(
    "todos",
    getTrends
  );

  return (
    <div>
      TrendList
      <ul>
        {query?.data?.result?.trends?.map((trend: any) => {
          <div>{JSON.stringify(trend)}</div>;
        })}
      </ul>
    </div>
  );
};

export default TrendList;
