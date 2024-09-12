import express from "express";
import {
  getCustomer,
  getCutomerCity,
  getDailyAddedCustomer,
  getDublicateCustomerDaily,
  getDublicateCustomerMonthly,
  getDublicateCustomerQuarterly,
  getDublicateCustomerYearly,
  getMonthlyAddedCustomer,
  getQuarterlyAddedCustomer,
  getYearlyAddedCustomer,
} from "../Controllers/customerController.js";

const router = express.Router();

router.get("/all", getCustomer);

// Router for get new customer overtime
router.get("/newcustomer/daily", getDailyAddedCustomer);
router.get("/newcustomer/monthly", getMonthlyAddedCustomer);
router.get("/newcustomer/quarterly", getQuarterlyAddedCustomer);
router.get("/newcustomer/yearly", getYearlyAddedCustomer);

// Router for get the dublicate customer in overtime
router.get("/dublicate/daily", getDublicateCustomerDaily);
router.get("/dublicate/monthly", getDublicateCustomerMonthly);
router.get("/dublicate/quarterly", getDublicateCustomerQuarterly);
router.get("/dublicate/yearly", getDublicateCustomerYearly);

// Router for get the customer city
router.get("/getCity", getCutomerCity);

export default router;
