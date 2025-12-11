import { ArrowLeft, Calendar, Check, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { api } from "../lib/api";

interface Vehicle {
  id: string;
  vehicle_name: string;
  daily_rent_price: string | number;
  availability_status: string;
  type: string;
  registration_number: string;
}

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        setVehicle(response.data.data);
      } catch (error) {
        console.error("Failed to load vehicle", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVehicle();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
    );

  if (!vehicle)
    return <div className="text-center py-20">Vehicle not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600"
        onClick={() => navigate("/vehicles")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg">
            <img
              src={`https://placehold.co/800x600/indigo/white?text=${encodeURIComponent(
                vehicle.vehicle_name
              )}`}
              alt={vehicle.vehicle_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {["Front", "Side", "Interior"].map((view, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden text-xs flex items-center justify-center text-gray-400"
              >
                {view} View
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 uppercase tracking-wider">
                {vehicle.type}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                  vehicle.availability_status === "available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {vehicle.availability_status}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {vehicle.vehicle_name}
            </h1>
            <p className="text-gray-500">
              Registration: {vehicle.registration_number}
            </p>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-indigo-600">
              ${Number(vehicle.daily_rent_price).toFixed(2)}
            </span>
            <span className="text-gray-500 mb-2 font-medium">/ day</span>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold">Key Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500" /> GPS Navigation
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500" /> Bluetooth Audio
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500" /> Heated Seats
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-500" /> Backup Camera
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                <div className="text-xs font-semibold">Instant</div>
              </div>
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                <div className="text-xs font-semibold">Insured</div>
              </div>
              <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                <div className="text-xs font-semibold">Flexible</div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              disabled={vehicle.availability_status !== "available"}
              onClick={() => navigate(`/book/${vehicle.id}`)}
            >
              {vehicle.availability_status === "available"
                ? "Proceed to Booking"
                : "Currently Unavailable"}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">
              No credit card required for reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
