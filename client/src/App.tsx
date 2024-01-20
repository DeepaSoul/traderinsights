import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Trendlist from "./components/trendList";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } }, //only refetch information after 2min
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Trendlist />
      </div>
    </QueryClientProvider>
  );
};

export default App;
