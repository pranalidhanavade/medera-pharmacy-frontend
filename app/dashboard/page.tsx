"use client";

import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function PharmacistDashboard() {
  const router = useRouter();
  const [connectedPatient, setConnectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data for medicines
  const medicines = [
    { id: "1", name: "Paracetamol 500mg", price: 20 },
    { id: "2", name: "Amoxicillin 250mg", price: 50 },
    { id: "3", name: "Cough Syrup", price: 80 },
    { id: "4", name: "Ibuprofen 200mg", price: 30 },
  ];

  const handleScanQRCode = (patientId: string) => {
    setConnectedPatient(patientId);
  };

  const handleAddMedicine = (medicine: { id: string; name: string; price: number }) => {
    setSelectedMedicines((prev) => [...prev, medicine]);
  };

  const handleRemoveMedicine = (id: string) => {
    setSelectedMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const handleSubmitPrescription = () => {
    console.log("Prescription submitted:", selectedMedicines);
    setSelectedMedicines([]);
    alert("Prescription submitted successfully!");
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNavigateToAccount = () => {
    router.push('/accounts'); // Redirect to the account page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white-600 text-teal shadow-md relative">
        <div className="max-w-auto mx-auto flex justify-between items-center px-4">
          <div className="flex items-center ml-12">
            <Image
              src="/medera_logo_transparent.png"
              alt="Pharma Project Logo"
              width={140}
              height={140}
              className="rounded-full"
            />
          </div>

          {/* Profile Dropdown Button */}
          <div className="relative">
            <button
              className="py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
              onClick={handleProfileDropdownToggle}
            >
              Profile
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40"
              >
                <ul>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-teal-100 cursor-pointer"
                    onClick={() => alert("Manage Profile clicked")} // Add functionality for 'Manage Profile' as needed
                  >
                    Manage Profile
                  </li>
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-teal-100 cursor-pointer"
                    onClick={handleNavigateToAccount}
                  >
                    Accounts
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center mx-auto max-w-screen w-full gap-6 mt-6 px-6 xl:px-12">
        {/* Sidebar */}
        <aside className="w-1/4	 bg-white rounded-xl shadow-lg p-5">
          <div className="bg-gray-50 p-4 rounded-lg shadow-md text-center">
           
              <div>
                <QRCode value="PatientConnectionQRCode" height={140} width={140} />
                
              </div>
           
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col gap-6">
            {/* Search Medicines */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Search Medicines</h2>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Search by medicine name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Medicine List */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Available Medicines</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredMedicines.map((medicine) => (
                  <li
                    key={medicine.id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-700">{medicine.name}</h3>
                      <p className="text-sm text-gray-500">Price: ₹{medicine.price}</p>
                    </div>
                    <button
                      className="py-1 px-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
                      onClick={() => handleAddMedicine(medicine)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prescription Overview */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Patient's Prescription</h2>
              {selectedMedicines.length > 0 ? (
                <ul className="space-y-4">
                  {selectedMedicines.map((medicine) => (
                    <li
                      key={medicine.id}
                      className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-700">{medicine.name}</h3>
                        <p className="text-sm text-gray-500">Price: ₹{medicine.price}</p>
                      </div>
                      <button
                        className="py-1 px-3 bg-red-600 text-white rounded-lg hover:bg-red-500"
                        onClick={() => handleRemoveMedicine(medicine.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No medicines added yet.</p>
              )}

              {/* Submit Prescription Button */}
              {selectedMedicines.length > 0 && (
                <button
                  className="mt-4 py-2 px-6 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
                  onClick={handleSubmitPrescription}
                >
                  Submit Prescription
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
