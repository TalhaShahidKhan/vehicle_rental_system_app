import { motion } from "framer-motion";
import { Calendar, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

interface Vehicle {
  id: string;
  vehicle_name: string;
  daily_rent_price: number;
}

export default function Booking() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [startTime, setStartTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false); // loading for submission
  const [fetching, setFetching] = useState(true); // loading for vehicle data
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        setVehicle(response.data.data);
      } catch (err) {
        console.error("Failed to load vehicle", err);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchVehicle();
  }, [id]);

  useEffect(() => {
    if (vehicle && startTime && returnTime) {
      const start = new Date(startTime);
      const end = new Date(returnTime);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTotalCost(diffDays * Number(vehicle.daily_rent_price));
      } else {
        setTotalCost(0);
      }
    }
  }, [startTime, returnTime, vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should be protected by route, but safety check

    setLoading(true);
    setError("");

    try {
      await api.post("/bookings", {
        customer_id: user.id, // Explicitly sending customer_id as required by backend
        vehicle_id: id,
        rent_start_date: new Date(startTime).toISOString(),
        rent_end_date: new Date(returnTime).toISOString(),
      });
      navigate("/profile", {
        state: { message: "Booking confirmed successfully!" },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
    );

  if (!vehicle)
    return <div className="text-center py-20">Vehicle not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Complete Your Booking
        </h1>
        <p className="text-gray-500 mt-2">
          You're just one step away from your ride.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Booking Summary - Left/Top */}
        <div className="md:col-span-1 space-y-4 order-2 md:order-1">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Rental Summary
            </h3>

            <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={`https://placehold.co/400x300/indigo/white?text=${encodeURIComponent(
                  vehicle.vehicle_name
                )}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">{vehicle.vehicle_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate</span>
                <span className="font-medium">
                  ${Number(vehicle.daily_rent_price).toFixed(2)} / day
                </span>
              </div>
              <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-indigo-600">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Right/Main */}
        <div className="md:col-span-2 order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                  <User className="h-5 w-5 text-indigo-500" /> Driver Details
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      {user?.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                  <Calendar className="h-5 w-5 text-indigo-500" /> Trip Dates
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="datetime-local"
                    label="Pick-up Date & Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <Input
                    type="datetime-local"
                    label="Return Date & Time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    required
                    min={startTime || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                  <CreditCard className="h-5 w-5 text-indigo-500" /> Payment
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-800 dark:text-indigo-200">
                  This is a test version. No real payment will be processed. You
                  can pay at the counter.
                </div>
              </div>

              {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-12"
                isLoading={loading}
                disabled={totalCost <= 0}
              >
                Confirm Booking
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
