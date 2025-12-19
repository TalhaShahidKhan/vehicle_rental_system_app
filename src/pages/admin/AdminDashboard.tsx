import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Car,
  LayoutDashboard,
  Loader2,
  PlusCircle,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import ManageBookings from "./ManageBookings";
import ManageUsers from "./ManageUsers";
import ManageVehicles from "./ManageVehicles";

type AdminTab = "overview" | "vehicles" | "users" | "bookings" | "settings";

interface DashboardStats {
  total_users: string | number;
  active_vehicles: string | number;
  total_bookings: string | number;
  total_revenue: string | number;
  recent_activities: Array<{
    type: string;
    created_at: string;
    customer_name: string;
    vehicle_name: string;
  }> | null;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const sidebarLinks = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "vehicles", name: "Manage Vehicles", icon: Car },
    { id: "users", name: "Manage Users", icon: Users },
    { id: "bookings", name: "Manage Bookings", icon: Calendar },
    { id: "settings", name: "Settings", icon: Settings },
  ] as const;

  const statCards = [
    {
      name: "Total Users",
      value: stats?.total_users || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Active Vehicles",
      value: stats?.active_vehicles || "0",
      icon: Car,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      name: "Total Bookings",
      value: stats?.total_bookings || "0",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "Revenue",
      value: `$${Number(stats?.total_revenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 space-y-2">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Hub
          </h1>
          <p className="text-sm text-gray-500">Manage your fleet</p>
        </div>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as AdminTab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === link.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                <header className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      System Overview
                    </h2>
                    <p className="text-gray-500">
                      Real-time performance metrics
                    </p>
                  </div>
                  {loading && (
                    <Loader2 className="animate-spin text-indigo-600" />
                  )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statCards.map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                      <div
                        className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                      >
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {stat.name}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </h3>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Recent Activities</h3>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-6">
                      {stats?.recent_activities?.length ? (
                        stats.recent_activities.map((activity, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-indigo-600">
                              {activity.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {activity.type}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity.customer_name} booked{" "}
                                {activity.vehicle_name}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(
                                activity.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No recent activities found.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveTab("vehicles")}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <PlusCircle className="h-8 w-8 mb-2" />
                        <span className="text-sm font-bold">
                          Manage Vehicles
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      >
                        <Users className="h-8 w-8 mb-2" />
                        <span className="text-sm font-bold">Manage Users</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vehicles" && <ManageVehicles />}
            {activeTab === "users" && <ManageUsers />}
            {activeTab === "bookings" && <ManageBookings />}
            {activeTab === "settings" && (
              <div className="p-12 text-center text-gray-500">
                Settings coming soon...
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
