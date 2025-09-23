import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const AnalyticsDashboard = ({ orders = [] }) => {
  const revenueChartRef = useRef(null);
  const customerChartRef = useRef(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
  });

  // Calculate analytics data
  useEffect(() => {
    if (!orders.length) return;

    const now = new Date();
    const getDaysAgo = (days) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const rangeMap = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
    };

    const daysBack = rangeMap[timeRange];
    const startDate = getDaysAgo(daysBack);
    const previousStartDate = getDaysAgo(daysBack * 2);

    // Current period data
    const currentOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= startDate && order.status !== "cancelled"
    );

    // Previous period data for comparison
    const previousOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate >= previousStartDate &&
        orderDate < startDate &&
        order.status !== "cancelled"
      );
    });

    const currentRevenue = currentOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    const currentCustomers = new Set(
      currentOrders.map((order) => order.customerId)
    ).size;
    const previousCustomers = new Set(
      previousOrders.map((order) => order.customerId)
    ).size;

    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const customerGrowth =
      previousCustomers > 0
        ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
        : 0;

    setAnalytics({
      totalRevenue: currentRevenue,
      totalCustomers: currentCustomers,
      totalOrders: currentOrders.length,
      avgOrderValue:
        currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0,
      revenueGrowth,
      customerGrowth,
    });
  }, [orders, timeRange]);

  // Create charts
  useEffect(() => {
    if (!orders.length) return;

    const now = new Date();
    const getDaysAgo = (days) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const daysBack =
      timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const startDate = getDaysAgo(daysBack);

    // Generate daily data
    const dailyData = {};
    const dailyCustomers = {};

    for (let i = 0; i < daysBack; i++) {
      const date = getDaysAgo(i);
      const dateKey = date.toISOString().split("T")[0];
      dailyData[dateKey] = 0;
      dailyCustomers[dateKey] = new Set();
    }

    orders.forEach((order) => {
      if (
        new Date(order.createdAt) >= startDate &&
        order.status !== "cancelled"
      ) {
        const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
        if (dailyData[dateKey] !== undefined) {
          dailyData[dateKey] += order.total || 0;
          dailyCustomers[dateKey].add(order.customerId);
        }
      }
    });

    const labels = Object.keys(dailyData)
      .sort()
      .map((date) => {
        return new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      });

    const revenueData = Object.keys(dailyData)
      .sort()
      .map((date) => dailyData[date]);
    const customerData = Object.keys(dailyCustomers)
      .sort()
      .map((date) => dailyCustomers[date].size);

    // Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext("2d");

      // Destroy existing chart
      if (revenueChartRef.current.chartInstance) {
        revenueChartRef.current.chartInstance.destroy();
      }

      revenueChartRef.current.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Daily Revenue",
              data: revenueData,
              backgroundColor: "rgba(251, 146, 60, 0.8)",
              borderColor: "rgba(251, 146, 60, 1)",
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(251, 146, 60, 1)",
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return `Revenue: ₦${context.parsed.y.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return "₦" + value.toFixed(0);
                },
                color: "#6B7280",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#6B7280",
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Customer Chart
    if (customerChartRef.current) {
      const ctx = customerChartRef.current.getContext("2d");

      // Destroy existing chart
      if (customerChartRef.current.chartInstance) {
        customerChartRef.current.chartInstance.destroy();
      }

      customerChartRef.current.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Daily Customers",
              data: customerData,
              borderColor: "rgba(59, 130, 246, 1)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointBorderColor: "white",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleColor: "white",
              bodyColor: "white",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return `Customers: ${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#6B7280",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#6B7280",
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Cleanup function
    return () => {
      if (revenueChartRef.current?.chartInstance) {
        revenueChartRef.current.chartInstance.destroy();
      }
      if (customerChartRef.current?.chartInstance) {
        customerChartRef.current.chartInstance.destroy();
      }
    };
  }, [orders, timeRange]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    prefix = "",
    suffix = "",
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
        {growth !== undefined && (
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              growth >= 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {growth >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(growth).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm font-medium"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.totalRevenue.toFixed(2)}
          icon={DollarSign}
          growth={analytics.revenueGrowth}
          prefix="₦"
        />
        <StatCard
          title="Total Customers"
          value={analytics.totalCustomers}
          icon={Users}
          growth={analytics.customerGrowth}
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={ShoppingBag}
        />
        <StatCard
          title="Avg Order Value"
          value={analytics.avgOrderValue.toFixed(2)}
          icon={TrendingUp}
          prefix="₦"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Revenue
            </h3>
            <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
              Revenue Trend
            </div>
          </div>
          <div className="h-64">
            <canvas ref={revenueChartRef}></canvas>
          </div>
        </div>

        {/* Customer Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Customers
            </h3>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              Customer Flow
            </div>
          </div>
          <div className="h-64">
            <canvas ref={customerChartRef}></canvas>
          </div>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <TrendingUp className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-500">
            Start receiving orders to see your analytics dashboard
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
