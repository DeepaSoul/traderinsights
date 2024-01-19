import Axios, { AxiosRequestConfig, Method } from "axios";
const API_URL4 = process.env.API_URL || "http://localhost:8000";

const api = async (
  endpoint: string,
  parameters: { body?: object },
  method: Method
) => {
  const options: AxiosRequestConfig = {
    baseURL: API_URL4,
    url: endpoint,
    method: method,
    withCredentials: true,
  };

  if (parameters.body && method != "GET") {
    options.data = parameters.body;
  }

  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const baseURL = window.location.origin;

      // Redirect to error page and send alert if an API endpoint cannot be reached
      // if (error.message.includes("timeout")) {
      //   window.location.href =
      // }
    }
  );

  // Uncomment to enable query cancel
  // Use this if there are view changes or query changes to cancel previosuly unfinished queries
  // if (parameters.signal) {
  //   options.signal = parameters.signal
  // }

  const api = Axios.request(options);

  try {
    return api;
  } catch (error) {
    return { data: { error } };
  }
};

export { api };
