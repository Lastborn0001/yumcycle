import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Trash2,
  Filter,
  Download,
  Eye,
  Clock,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";

const RestaurantsTable = ({ getAuthToken }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch("/api/admin/restaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch restaurants");
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAction = async (action, restaurantId, userId) => {
    if (processing.has(restaurantId)) return;

    const confirmMessages = {
      approve: "Are you sure you want to approve this restaurant?",
      reject: "Are you sure you want to reject this restaurant?",
      delete:
        "Are you sure you want to delete this restaurant? This action cannot be undone.",
    };

    if (!confirm(confirmMessages[action])) return;

    setProcessing((prev) => new Set(prev).add(restaurantId));

    try {
      const token = await getAuthToken();
      const response = await fetch("/api/admin/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, restaurantId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} restaurant`);
      }

      if (action === "delete") {
        setRestaurants((prev) => prev.filter((r) => r._id !== restaurantId));
        toast.success("Restaurant deleted successfully!");
      } else {
        setRestaurants((prev) =>
          prev.map((r) =>
            r._id === restaurantId
              ? { ...r, status: action === "approve" ? "approved" : "rejected" }
              : r
          )
        );
        toast.success(`Restaurant ${action}d successfully!`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(restaurantId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesStatus =
      statusFilter === "all" || restaurant.status === statusFilter;
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.some((c) =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: restaurants.length,
    pending: restaurants.filter((r) => r.status === "pending").length,
    approved: restaurants.filter((r) => r.status === "approved").length,
    rejected: restaurants.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage restaurant applications and approvals
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No restaurants found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-medium text-sm">
                            {restaurant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {restaurant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {restaurant.cuisine.join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {restaurant.userId?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {restaurant.userId?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {restaurant.address || "No address"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(restaurant.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {restaurant.status === "pending" &&
                          restaurant.userId?.uid && (
                            <>
                              <button
                                onClick={() =>
                                  handleAction(
                                    "approve",
                                    restaurant._id,
                                    restaurant.userId.uid
                                  )
                                }
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                title="Approve"
                                disabled={processing.has(restaurant._id)}
                              >
                                {processing.has(restaurant._id) ? (
                                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(
                                    "reject",
                                    restaurant._id,
                                    restaurant.userId.uid
                                  )
                                }
                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                title="Reject"
                                disabled={processing.has(restaurant._id)}
                              >
                                {processing.has(restaurant._id) ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        <button
                          onClick={() =>
                            restaurant.userId?.uid
                              ? handleAction(
                                  "delete",
                                  restaurant._id,
                                  restaurant.userId.uid
                                )
                              : toast.error("Cannot delete: User data missing")
                          }
                          className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title="Delete"
                          disabled={processing.has(restaurant._id)}
                        >
                          {processing.has(restaurant._id) ? (
                            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTable;
