import { Router } from "express";
import { getMarketTrendInfoResults } from "../../controllers/marketTrends";

const router = Router();

// Bellow add all the routes, methods and controllers for the route {baseUrl}/conversion/*

// GET {baseUrl}/trends/getMarketTrendInfo
router.route("/getMarketTrendInfo").get((req, res, next) => {
  getMarketTrendInfoResults(req, res);
});

// GET {baseUrl}/trends/getMarketTrendInfoAggregate
router.route("/getMarketTrendInfoAggregate").get((req, res, next) => {
  getMarketTrendInfoResults(req, res);
});

export default router;
