import Customers from "../Model/customerSchema.js";
import Orders from "../Model/orderSchema.js";

// Helper function for repeat customers aggregation
async function getRepeatCustomersOverTime(interval) {
  let groupBy;

  switch (interval) {
    case "daily":
      groupBy = {
        year: { $year: "$created_at" },
        month: { $month: "$created_at" },
        day: { $dayOfMonth: "$created_at" },
      };
      break;
    case "monthly":
      groupBy = {
        year: { $year: "$created_at" },
        month: { $month: "$created_at" },
      };
      break;
    case "quarterly":
      groupBy = {
        year: { $year: "$created_at" },
        quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } },
      };
      break;
    case "yearly":
      groupBy = { year: { $year: "$created_at" } };
      break;
    default:
      throw new Error("Invalid interval");
  }

  const result = await Orders.aggregate([
    {
      $group: {
        _id: "$email", // Use email as the customer identifier
        purchaseCount: { $sum: 1 },
        firstPurchaseDate: { $min: "$created_at" },
      },
    },
    {
      $match: { purchaseCount: { $gt: 1 } }, // Filter customers with more than one purchase
    },
    {
      $addFields: {
        created_at: { $dateFromString: { dateString: "$firstPurchaseDate" } }, // Convert to Date object if needed
      },
    },
    {
      $group: {
        _id: groupBy,
        repeatCustomers: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.quarter": 1 }, // Sort by date
    },
  ]);

  return result;
}

// Function to get all the customer for debugging purposes

export const getCustomer = async (req, res) => {
  try {
    const user = await Customers.find();
    res.status(200).json({ message: "Authorised User", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal Server Error Failed to Fetch User" });
  }
};

// Function to fetch the user added on daily basis
export const getDailyAddedCustomer = async (req, res) => {
  try {
    const result = await Customers.aggregate([
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: "$created_at" } } },
            month: {
              $month: { $dateFromString: { dateString: "$created_at" } },
            },
            day: {
              $dayOfMonth: { $dateFromString: { dateString: "$created_at" } },
            },
          },
          newCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error on fetching from Daily basis " });
  }
};

// Function to fetch th euser added on monthly basis
export const getMonthlyAddedCustomer = async (req, res) => {
  try {
    const result = await Customers.aggregate([
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: "$created_at" } } },
            month: {
              $month: { $dateFromString: { dateString: "$created_at" } },
            },
          },
          newCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error in Fetching Data from Monthly Basis",
    });
  }
};

// Function to fetch th euser added on quaterly basis
export const getQuarterlyAddedCustomer = async (req, res) => {
  try {
    const result = await Customers.aggregate([
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: "$created_at" } } },
            quarter: {
              $ceil: {
                $divide: [
                  {
                    $month: { $dateFromString: { dateString: "$created_at" } },
                  },
                  3,
                ],
              },
            },
          },
          newCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.quarter": 1 },
      },
    ]);

    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error in Fetching Data from Quaterly Basis",
    });
  }
};

// Function to fetch th euser added on yearly basis
export const getYearlyAddedCustomer = async (req, res) => {
  try {
    const result = await Customers.aggregate([
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: "$created_at" } } },
          },
          newCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error in Fetching Data from Yearly Basis",
    });
  }
};

// Functions to find the dublicate users on over time of the period
export const getDublicateCustomerDaily = async (req, res) => {
  try {
    const user = await getRepeatCustomersOverTime("daily");
    res.status(200).json({ message: "Data Fetched Successfully", data: user });
  } catch (error) {
    res.status(500).json({
      Message: "Internal Server Error Failed to Fetch Daily Dublicate User",
    });
  }
};

export const getDublicateCustomerMonthly = async (req, res) => {
  try {
    const user = await getRepeatCustomersOverTime("monthly");
    res.status(200).json({ message: "Data Fetched Successfully", data: user });
  } catch (error) {
    res.status(500).json({
      Message: "Internal Server Error Failed to Fetch Monthly Dublicate User",
    });
  }
};

export const getDublicateCustomerQuarterly = async (req, res) => {
  try {
    const user = await getRepeatCustomersOverTime("quarterly");
    res.status(200).json({ message: "Data Fetched Successfully", data: user });
  } catch (error) {
    res.status(500).json({
      Message: "Internal Server Error Failed to Fetch Quarterly Dublicate User",
    });
  }
};

export const getDublicateCustomerYearly = async (req, res) => {
  try {
    const user = await getRepeatCustomersOverTime("yearly");
    res.status(200).json({ message: "Data Fetched Successfully", data: user });
  } catch (error) {
    res.status(500).json({
      Message: "Internal Server Error Failed to Fetch Yearly Dublicate User",
    });
  }
};

// Function to fetch the city of the customer
export const getCutomerCity = async (req, res) => {
  try {
    const result = await Customers.aggregate([
      {
        $group: {
          _id: "$default_address.city", // Group by city
          totalCustomers: { $sum: 1 }, // Count customers in each city
        },
      },
      {
        $sort: { _id: 1 }, // Optional: Sort by the Alphabetical Order
      },
    ]);
    res
      .status(200)
      .json({ message: "Data Fetched Successfully", data: result });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal Server Error Failed to Fetch City" });
  }
};
