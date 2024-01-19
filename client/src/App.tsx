import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Trendlist from "./components/trendList";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Trendlist />
      </div>
    </QueryClientProvider>
  );
}

export default App;
