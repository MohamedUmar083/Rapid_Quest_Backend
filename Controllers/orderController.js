import Orders from "../Model/orderSchema.js";

// Functions for Get Total Sales Amount in Overtime
const getTotalSalesOverTime = async (interval) => {
  let groupBy;

  switch (interval) {
    case "daily":
      groupBy = {
        year: { $year: "$createdDate" },
        month: { $month: "$createdDate" },
        day: { $dayOfMonth: "$createdDate" },
      };
      break;
    case "monthly":
      groupBy = {
        year: { $year: "$createdDate" },
        month: { $month: "$createdDate" },
      };
      break;
    case "quarterly":
      groupBy = {
        year: { $year: "$createdDate" },
        quarter: { $ceil: { $divide: [{ $month: "$createdDate" }, 3] } },
      };
      break;
    case "yearly":
      groupBy = { year: { $year: "$createdDate" } };
      break;
    default:
      throw new Error("Invalid interval");
  }

  const result = await Orders.aggregate([
    {
      // Convert string to Date
      $addFields: {
        createdDate: {
          $dateFromString: {
            dateString: "$created_at", // Assuming created_at is stored as a string
          },
        },
      },
    },
    {
      $group: {
        _id: groupBy,
        totalSales: {
          $sum: { $toDouble: "$total_price_set.shop_money.amount" },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.quarter": 1 }, // Sort by date
    },
  ]);

  return result;
};

export const getDailySales = async (req, res) => {
  try {
    const salesData = await getTotalSalesOverTime("daily");

    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in Daily Sale" });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const salesData = await getTotalSalesOverTime("monthly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in Monthly Sale" });
  }
};

export const getQuarterlySales = async (req, res) => {
  try {
    const salesData = await getTotalSalesOverTime("quarterly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error in Quarterly Sale" });
  }
};

export const getYearlySales = async (req, res) => {
  try {
    const salesData = await getTotalSalesOverTime("yearly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in Yearly Sale" });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const salesData = await Orders.find();
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in Yearly Sale" });
  }
};

export const getCLV = async (req, res) => {
  try {
    const result = await Orders.aggregate([
      {
        // Group orders by customer and calculate their total lifetime value
        $group: {
          _id: "$customer.email", // Assuming email is the unique identifier for customers
          firstPurchaseDate: { $min: "$created_at" }, // Track first purchase date
          lifetimeValue: {
            $sum: { $toDouble: "$total_price_set.shop_money.amount" },
          }, // Calculate total spending (CLV)
        },
      },
      {
        // Add fields to extract the year and month of the first purchase
        $addFields: {
          firstPurchaseYear: {
            $year: { $dateFromString: { dateString: "$firstPurchaseDate" } },
          },
          firstPurchaseMonth: {
            $month: { $dateFromString: { dateString: "$firstPurchaseDate" } },
          },
        },
      },
      {
        // Group customers by their cohort (first purchase year and month)
        $group: {
          _id: { year: "$firstPurchaseYear", month: "$firstPurchaseMonth" },
          totalLifetimeValue: { $sum: "$lifetimeValue" }, // Total lifetime value for the cohort
          customerCount: { $sum: 1 }, // Count of customers in the cohort
        },
      },
      {
        // Sort by cohort (year, then month)
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error in Yearly Sale" });
  }
};

// Function to get Sales Growth Overtime information
async function getSalesGrowthRateOverTime(interval) {
  let groupBy;

  // Determine how to group the data (daily, monthly, quarterly, yearly)
  switch (interval) {
    case "daily":
      groupBy = {
        year: { $year: "$createdDate" },
        month: { $month: "$createdDate" },
        day: { $dayOfMonth: "$createdDate" },
      };
      break;
    case "monthly":
      groupBy = {
        year: { $year: "$createdDate" },
        month: { $month: "$createdDate" },
      };
      break;
    case "quarterly":
      groupBy = {
        year: { $year: "$createdDate" },
        quarter: { $ceil: { $divide: [{ $month: "$createdDate" }, 3] } },
      };
      break;
    case "yearly":
      groupBy = { year: { $year: "$createdDate" } };
      break;
    default:
      throw new Error("Invalid interval");
  }

  // Step 1: Aggregate total sales over time
  const salesData = await Orders.aggregate([
    {
      // Convert string to Date
      $addFields: {
        createdDate: {
          $dateFromString: {
            dateString: "$created_at",
            onError: null, // Set to null if conversion fails
            onNull: null, // Handle nulls explicitly
          },
        },
      },
    },
    {
      // Filter out entries where date conversion failed (optional but recommended)
      $match: { createdDate: { $ne: null } },
    },
    {
      $group: {
        _id: groupBy,
        totalSales: {
          $sum: { $toDouble: "$total_price_set.shop_money.amount" },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.quarter": 1 }, // Sort by date
    },
  ]);

  // Step 2: Calculate growth rate between periods
  let salesGrowth = [];

  // Include the first year's data with a null growth rate
  salesGrowth.push({
    period: salesData[0]._id,
    totalSales: salesData[0].totalSales,
    growthRate: null, // No previous year to compare to, so growth rate is null
  });

  // Calculate the growth rate for subsequent years
  for (let i = 1; i < salesData.length; i++) {
    const previousSales = salesData[i - 1].totalSales;
    const currentSales = salesData[i].totalSales;

    const growthRate = ((currentSales - previousSales) / previousSales) * 100;

    // Include current period's sales and its growth rate compared to the previous period
    salesGrowth.push({
      period: salesData[i]._id,
      totalSales: currentSales,
      growthRate: growthRate.toFixed(2), // To 2 decimal places
    });
  }

  return salesGrowth;
}

export const getSalesGrowthRateDaily = async (req, res) => {
  try {
    const salesGrowthData = await getSalesGrowthRateOverTime("daily");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesGrowthData });
  } catch (error) {
    res
      .status(500)
      .jason({ message: "Error fetching data in daily sales growthrate" });
  }
};

export const getSalesGrowthRateYearly = async (req, res) => {
  try {
    const salesGrowthData = await getSalesGrowthRateOverTime("yearly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesGrowthData });
  } catch (error) {
    res
      .status(500)
      .jason({ message: "Error fetching data in yearly sales growthrate" });
  }
};

export const getSalesGrowthRateMonthly = async (req, res) => {
  try {
    const salesGrowthData = await getSalesGrowthRateOverTime("monthly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesGrowthData });
  } catch (error) {
    res
      .status(500)
      .jason({ message: "Error fetching data in monthly sales growthrate" });
  }
};

export const getSalesGrowthRateQuarterly = async (req, res) => {
  try {
    const salesGrowthData = await getSalesGrowthRateOverTime("quarterly");
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: salesGrowthData });
  } catch (error) {
    res
      .status(500)
      .jason({ message: "Error fetching data in quarterly sales growthrate" });
  }
};
