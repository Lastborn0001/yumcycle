import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { toast } from "react-hot-toast";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Analytics = ({ getAuthToken }) => {
  const [analyticsData, setAnalyticsData] = useState({
    roles: { users: 0, restaurants: 0 },
    restaurantStatuses: { approved: 0, rejected: 0, pending: 0 },
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch("/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analytics");
      }

      const data = await response.json();
      console.log("Analytics data:", data); // Debug log
      setAnalyticsData(data);
    } catch (err) {
      toast.error(err.message);
      setAnalyticsData({
        roles: { users: 0, restaurants: 0 },
        restaurantStatuses: { approved: 0, rejected: 0, pending: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Pie Chart Data (Users vs Restaurants)
  const pieChartData = {
    labels: ["Users", "Restaurants"],
    datasets: [
      {
        data: [analyticsData.roles.users, analyticsData.roles.restaurants],
        backgroundColor: ["#3B82F6", "#F97316"],
        hoverBackgroundColor: ["#2563EB", "#EA580C"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data (Restaurant Statuses)
  const barChartData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        label: "Restaurants",
        data: [
          analyticsData.restaurantStatuses.approved,
          analyticsData.restaurantStatuses.rejected,
          analyticsData.restaurantStatuses.pending,
        ],
        backgroundColor: ["#22C55E", "#EF4444", "#F59E0B"],
        borderColor: ["#16A34A", "#DC2626", "#D97706"],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User vs Restaurant Distribution",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Restaurant Approval Status",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Restaurants",
        },
      },
      x: {
        title: {
          display: true,
          text: "Status",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="text-sm text-gray-500">Platform statistics and insights</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
