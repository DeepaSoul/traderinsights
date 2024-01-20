import { Router } from "express";
import { getCurrencyHistoricalResults } from "../../controllers/currencyConversion";

const router = Router();

//Bellow add all the routes, methods and controllers for the route {baseUrl}/conversion/*

// {baseUrl}/conversion/getCurrencyHistoricalValues
router.route("/getCurrencyHistoricalValues").get((req, res, next) => {
  getCurrencyHistoricalResults(req, res);
});

export default router;
