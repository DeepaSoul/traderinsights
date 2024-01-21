import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import MarketTrends from "./components/marketTrends";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, //only refetch information after 2min
        keepPreviousData: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <MarketTrends />
      </div>
    </QueryClientProvider>
  );
};

export default App;
