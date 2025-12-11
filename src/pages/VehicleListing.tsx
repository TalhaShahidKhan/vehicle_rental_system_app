import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { api } from "../lib/api";

interface Vehicle {
  id: string;
  vehicle_name: string;
  daily_rent_price: string | number;
  availability_status: string;
  type: string;
  // Fallbacks used in UI
  imageUrl?: string;
}

export default function VehicleListing() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      const data = response.data.data || [];
      setVehicles(data);

      // Extract unique types
      const uniqueTypes = Array.from(
        new Set(data.map((v: Vehicle) => v.type))
      ).filter(Boolean) as string[];
      setTypes(uniqueTypes);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.vehicle_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getPlaceholderImage = (name: string) => {
    return `https://placehold.co/600x400/indigo/white?text=${encodeURIComponent(
      name
    )}`;
  };

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Fleet
          </h1>
          <p className="text-gray-500 mt-1">
            Choose from our wide range of premium vehicles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No vehicles found
          </h3>
          <p className="text-gray-500">Try adjusting your filters.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
            }}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={getPlaceholderImage(vehicle.vehicle_name)}
                  alt={vehicle.vehicle_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {vehicle.type}
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {vehicle.vehicle_name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      vehicle.availability_status === "available"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {vehicle.availability_status}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-6">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">
                      Daily Rate
                    </span>
                    <div className="text-2xl font-bold text-indigo-600">
                      ${Number(vehicle.daily_rent_price).toFixed(2)}
                    </div>
                  </div>
                  <Link to={`/vehicles/${vehicle.id}`}>
                    <Button
                      size="sm"
                      disabled={vehicle.availability_status !== "available"}
                    >
                      Rent Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
