import { createClient } from "redis";
import { T_RedisClientType } from "./types/redis";

const ConnectToCache = async (): Promise<T_RedisClientType> => {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
};

export default ConnectToCache;
