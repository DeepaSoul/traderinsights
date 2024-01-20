import { T_RedisClientType } from "../types/redis";

interface ExtendedRequest extends Request {
  cacheClient?: T_RedisClientType; // or user type
}

export { ExtendedRequest };
