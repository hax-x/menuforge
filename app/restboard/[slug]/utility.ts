import { subDays, isToday, isThisWeek, isThisMonth, format, subMonths, subYears } from "date-fns";

export const computeStatistics = (orders) => {
  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      maxOrderValue: 0,
      minOrderValue: 0,
      peakHour: "N/A",
      popularItems: [],
      salesLast7Days: []
    };
  }

  // Create a fresh date object for calculations
  const now = new Date();
  
  // Basic order statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Delivered").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
  const pendingOrders = orders.filter(o => 
    o.status === "pendingConfirmation" || 
    o.status === "Pending Confirmation" || 
    o.status === "Confirmed" ||
    o.status === "In Progress" ||
    o.status === "Dispatched"
  ).length;

  // Revenue calculations with safeguards for parsing
  const revenue = orders.reduce((acc, o) => {
    const amount = parseFloat(o.totalAmount || "0");
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const averageOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;
  
  // Use safe parsers for min/max calculations
  const orderValues = orders.map(o => {
    const amount = parseFloat(o.totalAmount || "0");
    return isNaN(amount) ? 0 : amount;
  });
  
  const maxOrderValue = orderValues.length > 0 ? Math.max(...orderValues) : 0;
  const minOrderValue = orderValues.length > 0 ? Math.min(...orderValues.filter(v => v > 0)) : 0;

  // Peak Hour calculations
  const hourCounts = {};
  orders.forEach(o => {
    try {
      const orderDate = new Date(o.created_at);
      if (isNaN(orderDate.getTime())) return; // Skip invalid dates
      
      const hour = format(orderDate, "HH:00");
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    } catch (err) {
      console.error("Date processing error:", err);
    }
  });
  
  const peakHourEntries = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
  const peakHour = peakHourEntries.length > 0 ? peakHourEntries[0][0] : "N/A";

  // Popular Items calculation with improved handling
  const itemCounts = {};
  orders.forEach(o => {
    if (!o.orderDetails || !Array.isArray(o.orderDetails)) return;
    
    o.orderDetails.forEach(item => {
      if (!item || !item.name) return;
      
      const quantity = parseInt(item.quantity || "1", 10);
      const validQuantity = isNaN(quantity) ? 1 : quantity;
      
      itemCounts[item.name] = (itemCounts[item.name] || 0) + validQuantity;
    });
  });
  
  const popularItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, value: count }));

  // Ensure we have at least some data for the pie chart
  if (popularItems.length === 0) {
    popularItems.push({ name: "No data", value: 1 });
  }

  // Sales data for line chart
  // Determine range based on available data
  const oldestOrderDate = orders.reduce((oldest, order) => {
    try {
      const orderDate = new Date(order.created_at);
      if (isNaN(orderDate.getTime())) return oldest;
      
      return orderDate < oldest ? orderDate : oldest;
    } catch (err) {
      return oldest;
    }
  }, now);
  
  const daysDifference = Math.min(
    Math.max(Math.floor((now - oldestOrderDate) / (1000 * 60 * 60 * 24)), 1),
    30 // Cap at 30 days to keep chart readable
  );
  
  // Create sales data with appropriate time range
  const salesData = {};
  for (let i = daysDifference - 1; i >= 0; i--) {
    const day = format(subDays(now, i), "yyyy-MM-dd");
    salesData[day] = { totalSales: 0, orderCount: 0 };
  }
  
  orders.forEach(o => {
    try {
      const orderDate = new Date(o.created_at);
      if (isNaN(orderDate.getTime())) return;
      
      const dateKey = format(orderDate, "yyyy-MM-dd");
      if (salesData[dateKey]) {
        const amount = parseFloat(o.totalAmount || "0");
        salesData[dateKey].totalSales += isNaN(amount) ? 0 : amount;
        salesData[dateKey].orderCount += 1;
      }
    } catch (err) {
      console.error("Error processing order date:", err);
    }
  });
  
  const salesLast7Days = Object.entries(salesData).map(([date, stats]) => ({
    date,
    totalSales: stats.totalSales,
    orderCount: stats.orderCount,
  }));

  return {
    totalOrders,
    completedOrders,
    cancelledOrders,
    pendingOrders,
    totalRevenue: revenue,
    averageOrderValue,
    maxOrderValue,
    minOrderValue,
    peakHour,
    popularItems,
    salesLast7Days,
  };
};