import { Car, Edit2, Plus, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { api } from "../../lib/api";

interface Vehicle {
  id: string;
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: string | number;
  availability_status: string;
}

export default function ManageVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicle_name: "",
    type: "car",
    registration_number: "",
    daily_rent_price: "",
    availability_status: "available",
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, formData);
      } else {
        await api.post("/vehicles", formData);
      }
      setIsModalOpen(false);
      setEditingVehicle(null);
      setFormData({
        vehicle_name: "",
        type: "car",
        registration_number: "",
        daily_rent_price: "",
        availability_status: "available",
      });
      fetchVehicles();
    } catch (err) {
      console.error("Failed to save vehicle", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (err) {
        console.error("Failed to delete vehicle", err);
      }
    }
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicle_name: vehicle.vehicle_name,
      type: vehicle.type,
      registration_number: vehicle.registration_number,
      daily_rent_price: String(vehicle.daily_rent_price),
      availability_status: vehicle.availability_status,
    });
    setIsModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Fleet</h2>
          <p className="text-gray-500">Manage your rental inventory</p>
        </div>
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price / Day
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                          <Car className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="font-semibold">{v.vehicle_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-sm">{v.type}</td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {v.registration_number}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          v.availability_status === "available"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {v.availability_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                      ${v.daily_rent_price}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(v)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(v.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Name</label>
                  <Input
                    required
                    value={formData.vehicle_name}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle_name: e.target.value })
                    }
                    placeholder="e.g. Tesla Model 3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="van">Van</option>
                      <option value="SUV">SUV</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Daily Rent Price ($)
                    </label>
                    <Input
                      required
                      type="number"
                      value={formData.daily_rent_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          daily_rent_price: e.target.value,
                        })
                      }
                      placeholder="e.g. 99.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Registration Number
                  </label>
                  <Input
                    required
                    value={formData.registration_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_number: e.target.value,
                      })
                    }
                    placeholder="e.g. ABC-1234"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Availability Status
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-800"
                    value={formData.availability_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability_status: e.target.value,
                      })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingVehicle ? "Update Vehicle" : "Create Vehicle"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
