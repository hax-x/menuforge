"use client";
import React from 'react';

interface StatisticsData {
  totalRevenue: string;
  totalOrders: number;
  averageOrderValue: string;
  popularItems: string[];
  peakHours: string;
  customerRetention: string;
}

interface StatisticsViewProps {
  statistics: StatisticsData;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ statistics }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow border border-zinc-700">
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-100">{statistics.totalRevenue}</p>
          <p className="text-green-400 mt-2">↑ 12% from last month</p>
        </div>

        {/* Orders Card */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow border border-zinc-700">
          <h3 className="text-gray-400 text-sm mb-1">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-100">{statistics.totalOrders}</p>
          <p className="text-green-400 mt-2">↑ 8% from last month</p>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow border border-zinc-700">
          <h3 className="text-gray-400 text-sm mb-1">Average Order Value</h3>
          <p className="text-3xl font-bold text-gray-100">{statistics.averageOrderValue}</p>
          <p className="text-green-400 mt-2">↑ 4% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow border border-zinc-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Most Popular Items</h3>
          <ol className="list-decimal pl-5 text-gray-300">
            {statistics.popularItems.map((item, index) => (
              <li key={index} className="mb-2">{item}</li>
            ))}
          </ol>
        </div>

        {/* Additional Stats */}
        <div className="bg-zinc-800 p-6 rounded-lg shadow border border-zinc-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Additional Insights</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Peak Hours</p>
              <p className="font-semibold text-gray-200">{statistics.peakHours}</p>
            </div>
            <div>
              <p className="text-gray-400">Customer Retention</p>
              <p className="font-semibold text-gray-200">{statistics.customerRetention}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
