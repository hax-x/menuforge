"use client";
import React from "react";
import { computeStatistics } from "../utility";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, Line, Pie, Tooltip, XAxis, YAxis } from "recharts";

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

  useEffect(() => {
    if (orders?.length) {
      const computed = computeStatistics(orders);
      setStats(computed);
    }
  }, [orders]);

  if (!stats) return <div className="p-4">Loading statistics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            PKR {stats.totalRevenue.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Orders Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Total Orders: {stats.totalOrders}</p>
          <p>Completed: {stats.completedOrders}</p>
          <p>Cancelled: {stats.cancelledOrders}</p>
          <p>Pending: {stats.pendingOrders}</p>
        </CardContent>
      </Card>

      {/* Average, Max, Min */}
      <Card>
        <CardHeader>
          <CardTitle>Order Value Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Average: PKR {stats.averageOrderValue.toFixed(2)}</p>
          <p>Max: PKR {stats.maxOrderValue.toFixed(2)}</p>
          <p>Min: PKR {stats.minOrderValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Time-based Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Today: {stats.ordersToday}</p>
          <p>This Week: {stats.ordersThisWeek}</p>
          <p>This Month: {stats.ordersThisMonth}</p>
          <p>Peak Hour: {stats.peakHour}</p>
        </CardContent>
      </Card>

      {/* Popular Items Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie
            width={300}
            height={300}
            data={stats.popularItems}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#82ca9d"
            label
          />
        </CardContent>
      </Card>

      {/* Sales Over Last 7 Days Line Chart */}
      <Card className="col-span-1 md:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Sales in Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            width={800}
            height={300}
            data={stats.salesLast7Days}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="orderCount"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </Line>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;
