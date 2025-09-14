import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Utensils,
  User,
  Filter,
  Download,
  Eye,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UsersTable = ({ getAuthToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await response.json();
      // Set users to data.users, ensuring it's an array
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      toast.error(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleIcon = (role) => {
    const icons = {
      admin: <Shield className="w-4 h-4 text-purple-600" />,
      restaurant: <Utensils className="w-4 h-4 text-orange-600" />,
      user: <User className="w-4 h-4 text-blue-600" />,
    };
    return icons[role] || icons.user;
  };

  const getRoleBadge = (role) => {
    // Default to "user" if role is undefined or not a string
    const validRole =
      typeof role === "string" && ["user", "restaurant", "admin"].includes(role)
        ? role
        : "user";

    const roleStyles = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      restaurant: "bg-orange-100 text-orange-800 border-orange-200",
      user: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[validRole]}`}
      >
        {getRoleIcon(validRole)}
        <span className="ml-1">
          {validRole.charAt(0).toUpperCase() + validRole.slice(1)}
        </span>
      </span>
    );
  };

  // Add defensive check to ensure users is an array
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesSearch =
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
      })
    : [];

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    restaurant: users.filter((u) => u.role === "restaurant").length,
    user: users.filter((u) => u.role === "user").length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and roles
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
            <div className="p-2 bg-gray-100 rounded-lg">
              <Eye className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Regular Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.user}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Restaurants</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.restaurant}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.admin}
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="restaurant">Restaurants</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search users..."
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
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "No Name"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.uid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-orange-600 hover:text-orange-900 font-medium"
                          title="View Details"
                        >
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          className="text-blue-600 hover:text-blue-900 font-medium"
                          title="Edit User"
                        >
                          Edit
                        </button>
                        {user.role !== "admin" && (
                          <>
                            <span className="text-gray-300">|</span>
                            <button
                              className="text-red-600 hover:text-red-900 font-medium"
                              title="Suspend User"
                            >
                              Suspend
                            </button>
                          </>
                        )}
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

export default UsersTable;
