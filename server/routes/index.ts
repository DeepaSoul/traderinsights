import { Router } from "express";
import currencyConversionRouter from "./currencyConversion";
import marketTrendsRouter from "./marketTrends";

const routes = Router();

const apiLink = "/api/v1/";

routes.use(`${apiLink}conversion`, currencyConversionRouter);
routes.use(`${apiLink}trends`, marketTrendsRouter);

export default routes;
