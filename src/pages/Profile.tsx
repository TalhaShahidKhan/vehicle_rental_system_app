import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface Booking {
  id: string;
  vehicle: {
    vehicle_name: string;
    registration_number: string;
  };
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="opacity-90">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20">
              {user.role}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Booking History
        </h2>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={booking.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {booking.vehicle?.vehicle_name || "Vehicle"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.vehicle?.registration_number}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400 justify-center sm:justify-start">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{" "}
                        {new Date(booking.rent_start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{" "}
                        {new Date(booking.rent_start_date).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === "active"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <div className="text-xl font-bold text-indigo-600">
                    ${Number(booking.total_price).toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
