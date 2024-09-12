import express from "express";
import {
  getAllSales,
  getCLV,
  getDailySales,
  getMonthlySales,
  getQuarterlySales,
  getSalesGrowthRateDaily,
  getSalesGrowthRateMonthly,
  getSalesGrowthRateQuarterly,
  getSalesGrowthRateYearly,
  getYearlySales,
} from "../Controllers/orderController.js";

const router = express.Router();
// Router for Total Sales Overtime
router.get("/totalsales/dailysales", getDailySales);
router.get("/totalsales/monthlysales", getMonthlySales);
router.get("/totalsales/quarterlysales", getQuarterlySales);
router.get("/totalsales/yearlysales", getYearlySales);
router.get("/totalsales/all", getAllSales);

// Router for Sales Growth in Overtime
router.get("/growthrate/daily", getSalesGrowthRateDaily);
router.get("/growthrate/monthly", getSalesGrowthRateMonthly);
router.get("/growthrate/yearly", getSalesGrowthRateYearly);
router.get("/growthrate/quarterly", getSalesGrowthRateQuarterly);

router.get("/totalsales/getclv", getCLV);

export default router;
