# Sales Analytics Dashboard - Backend

## Overview

This is the backend for the Sales Analytics Dashboard built using Node.js, Express, and MongoDB. The backend provides various API endpoints to fetch data related to total sales, sales growth rate, customer acquisition, repeat customers, geographical distribution, and customer lifetime value.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB

## Routes

### 1. Total Sales Over Time

- **Route**: `api/order/totalsales/interval`
- **Description**: Fetches total sales aggregated by the interval (daily, monthly, quarterly, or yearly) from the `shopifyOrders` collection.

### 2. Sales Growth Rate Over Time

- **Route**: `api/order/growthrate/interval`
- **Description**: Calculates the sales growth rate over a specific time interval from the `shopifyOrders` collection.

### 3. New Customers Added Over Time

- **Route**: `api/customer/newcustomers/interval`
- **Description**: Retrieves the count of new customers added over time from the `shopifyCustomers` collection.

### 4. Repeat Customers

- **Route**: `api/customer/dublicate/interval`
- **Description**: Identifies customers who have made more than one purchase across different intervals using the `shopifyOrders` collection.

### 5. Geographical Distribution of Customers

- **Route**: `api/customers/getCity`
- **Description**: Visualizes the geographical distribution of customers based on the `city` field from the `shopifyCustomers` collection.

### 6. Customer Lifetime Value by Cohorts

- **Route**: `api/order/totalsales/getclv`
- **Description**: Groups customers by their first purchase date and calculates the customer lifetime value based on their purchase history.

## Documentation

### 1. Frontend Documentation

- [Frontend Repository](https://github.com/MohamedUmar083/Rapid_Quest_Frontend) - The Frontend repository for the project.
