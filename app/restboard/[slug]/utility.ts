import { subDays, isToday, isThisWeek, isThisMonth, format } from "date-fns";

export const computeStatistics = (orders: any[]) => {
  if (!orders || orders.length === 0) {
    return null;
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
  const pendingOrders = orders.filter(o => o.status === "pendingConfirmation").length;

  // Fix: Parse totalAmount as number
  const revenue = orders.reduce((acc, o) => acc + parseFloat(o.totalAmount || "0"), 0);
  const averageOrderValue = revenue / totalOrders || 0;
  const maxOrderValue = Math.max(...orders.map(o => parseFloat(o.totalAmount || "0")));
  const minOrderValue = Math.min(...orders.map(o => parseFloat(o.totalAmount || "0")));

  const ordersToday = orders.filter(o => isToday(o.created_at)).length;
  const ordersThisWeek = orders.filter(o => isThisWeek(o.created_at)).length;
  const ordersThisMonth = orders.filter(o => isThisMonth(o.created_at)).length;

  // Peak Hour
  const hourCounts: Record<string, number> = {};
  orders.forEach(o => {
    const hour = format(o.created_at, "HH:00");
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Popular Items
  const itemCounts: Record<string, number> = {};
  orders.forEach(o => {
    o.orderDetails?.forEach((item: any) => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });
  const popularItems = Object.entries(itemCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([name, count]) => ({ name, value: count }));

  // Sales Over Last 7 Days
  const last7DaysSales: Record<string, { total: number; count: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const day = format(subDays(new Date(), i), "yyyy-MM-dd");
    last7DaysSales[day] = { total: 0, count: 0 };
  }

  orders.forEach(o => {
    const date = format(o.created_at, "yyyy-MM-dd");
    if (last7DaysSales[date]) {
      last7DaysSales[date].total += parseFloat(o.totalAmount || "0");
      last7DaysSales[date].count += 1;
    }
  });

  const salesLast7Days = Object.entries(last7DaysSales).map(([date, stats]) => ({
    date,
    totalSales: stats.total,
    orderCount: stats.count,
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
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
    peakHour,
    popularItems,
    salesLast7Days,
  };
};
