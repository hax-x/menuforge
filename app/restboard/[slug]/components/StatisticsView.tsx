"use client";
import React from "react";
import { computeStatistics } from "../utility";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart,
  CartesianGrid, 
  Cell,
  Legend,
  Line, 
  LineChart, 
  PieChart,
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Calendar, Clock, Filter } from "lucide-react";

const StatisticsView = ({
  orders,
}: {
  orders: [
    {
      id: string;
      customerName: string;
      orderDetails: {
        name: string;
        quantity: number;
        price: number;
        image_url: string;
      }[];
      totalAmount: string;
      status: string;
      created_at: Date;
      location: string;
    }
  ];
}) => {
  const [stats, setStats] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("All time");
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Apply time filter
  useEffect(() => {
    if (!orders?.length) return;
    
    const now = new Date();
    let filtered;
    
    switch (timeFilter) {
      case "Today":
        filtered = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.toDateString() === now.toDateString();
        });
        break;
      case "Yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        filtered = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.toDateString() === yesterday.toDateString();
        });
        break;
      case "Past Week":
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        filtered = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= oneWeekAgo;
        });
        break;
      case "Past Month":
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filtered = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= oneMonthAgo;
        });
        break;
      case "Past Year":
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filtered = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= oneYearAgo;
        });
        break;
      default: // All time
        filtered = [...orders];
    }
    
    setFilteredOrders(filtered);
  }, [orders, timeFilter]);

  // Compute statistics based on filtered orders
  useEffect(() => {
    if (filteredOrders?.length) {
      const computed = computeStatistics(filteredOrders);
      setStats(computed);
    } else {
      setStats(null);
    }
  }, [filteredOrders]);

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="space-y-6 p-6">
        {/* Time filter controls */}
        <div className="flex flex-wrap items-center gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
          <div className="flex items-center">
            <Calendar size={20} className="text-violet-300 mr-2" />
            <span className="text-gray-300 mr-2">Filter by time:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              "All time",
              "Past Year",
              "Past Month",
              "Past Week",
              "Yesterday",
              "Today",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeFilter === filter
                    ? "bg-violet-700 text-white"
                    : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-800 rounded-lg border border-zinc-700">
          <div className="text-6xl text-zinc-500 mb-4">📊</div>
          <h3 className="text-xl font-medium text-zinc-300 mb-2">No Orders Found</h3>
          <p className="text-zinc-400">There are no orders available for the selected time period.</p>
          <button 
            onClick={() => setTimeFilter("All time")} 
            className="mt-4 px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white rounded-md"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="p-4">Loading statistics...</div>;

  // Calculate order status percentages
  const totalOrdersCount = stats.totalOrders || 1; // Avoid division by zero
  const completedPercentage = Math.round((stats.completedOrders / totalOrdersCount) * 100);
  const pendingPercentage = Math.round((stats.pendingOrders / totalOrdersCount) * 100);
  const cancelledPercentage = Math.round((stats.cancelledOrders / totalOrdersCount) * 100);

  // For revenue trends chart - display daily/weekly/monthly based on filter
  const revenueChartData = stats.salesLast7Days;

  // Create data for status distribution chart
  const statusDistributionData = [
    { name: "Completed", value: stats.completedOrders },
    { name: "Pending", value: stats.pendingOrders },
    { name: "Cancelled", value: stats.cancelledOrders },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 p-6">
      {/* Time filter controls */}
      <div className="flex flex-wrap items-center gap-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <div className="flex items-center">
          <Calendar size={20} className="text-violet-300 mr-2" />
          <span className="text-gray-300 mr-2">Filter by time:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            "All time",
            "Past Year",
            "Past Month",
            "Past Week",
            "Yesterday",
            "Today",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm ${
                timeFilter === filter
                  ? "bg-violet-700 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              PKR {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {timeFilter !== "All time" ? `${timeFilter}` : "All time"}
            </p>
          </CardContent>
        </Card>

        {/* Orders Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="text-green-500">{stats.completedOrders} ({completedPercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="text-yellow-500">{stats.pendingOrders} ({pendingPercentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled:</span>
                <span className="text-red-500">{stats.cancelledOrders} ({cancelledPercentage}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average, Max, Min */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Order Value Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Average:</span>
                <span className="font-medium">PKR {stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum:</span>
                <span className="font-medium text-green-500">PKR {stats.maxOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum:</span>
                <span className="font-medium">PKR {stats.minOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hour */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Peak Order Time</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock size={24} className="text-violet-400 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.peakHour || "N/A"}</p>
              <p className="text-sm text-gray-500">Most active hour</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Items Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Items</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.popularItems}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.popularItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {statusDistributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#00C49F' : index === 1 ? '#FFBB28' : '#FF8042'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Over Time Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Revenue & Order Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueChartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalSales"
                name="Revenue (PKR)"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orderCount"
                name="Order Count"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;