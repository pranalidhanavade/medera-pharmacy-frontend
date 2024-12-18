"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PharmacistDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState<
    { medicine: string; dosage: number }[]
  >([]);
  const [qrCodeValue, setQrCodeValue] = useState("");

  const [loadingQr, setLoadingQr] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // New states for verified prescriptions
  const [verifiedPrescriptions, setVerifiedPrescriptions] = useState<
    VerifiedPrescription[]
  >([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<PrescriptionDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalQrCodeValue, setModalQrCodeValue] = useState(""); // State for modal QR code

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Interface definitions
  interface VerifiedPrescription {
    id: string;
    patientName: string;
    prescriptionDate: string;
    status: string;
  }

  interface PrescriptionDetails {
    id: string;
    patientName: string;
    medicines: { medicine: string; dosage: number; price:number }[];
    prescriptionDate: string;
  }

  const medicines = [
    { medicine: "Paracetamol", dosage: 80 },
    { medicine: "Ibuprofen", dosage:12 },
    { medicine: "Cetirizine", dosage: 20 },
    { medicine: "Chlorpheniramine", dosage: 50 },
    { medicine: "Dextromethorphan", dosage: 80 },
    { medicine: "Ambroxol", dosage: 10 },

  ];

  const fetchVerifiedPrescriptions = async () => {
    try {
      const response = await fetch(
        "https://medera-backend.onrender.com/pharmacy/verifiedPrescreptionDetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          id: item.id,
          connectionId: item.connectionId,
        }));
        setVerifiedPrescriptions(formattedData);
      } else {
        console.error("Failed to fetch verified prescriptions");
      }
    } catch (error) {
      console.error("Error fetching verified prescriptions:", error);
    }
  };

  const fetchPrescriptionDetails = async (id: string) => {
    try {
      const response = await fetch(
        `https://medera-backend.onrender.com/pharmacy/verifiedPrescreptionDetailById/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();

        // Parse prescription details
        const parsedPrescription = JSON.parse(
          data.presentation.presentationExchange.verifiableCredential[0]
            .credentialSubject.prescription
        );

        const medicinesWithPrices = parsedPrescription.medicines.map(
          (med: any) => ({
            medicine: med.medicineName,
            dosage: med.dosage,
            price: Math.floor(Math.random() * 100) + 10, // Random price between 10 and 100
          })
        );
  

        setSelectedPrescription({
          id: data.presentation.presentationExchange.verifiableCredential[0]
            .credentialSubject.id,
          patientName: JSON.parse(
            data.presentation.presentationExchange.verifiableCredential[0]
              .credentialSubject.patientDetails
          ).name,
          medicines: medicinesWithPrices,
          prescriptionDate:
            data.presentation.presentationExchange.verifiableCredential[0]
              .issuanceDate,
        });

        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch prescription details");
      }
    } catch (error) {
      console.error("Error fetching prescription details:", error);
    }
  };

  const handleProfileDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleNavigateToAccount = () => {
    router.push("/payments");
  };

  const fetchQrCode = async () => {
    setLoadingQr(true);
    try {
      const response = await fetch(
        "https://medera-backend.onrender.com/pharmacy/connectionQr",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setQrCodeValue(data.invitationUrl);
      } else {
        console.error("Failed to fetch QR code:", response.statusText);
        setQrCodeValue("Error fetching QR Code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setQrCodeValue("Error fetching QR Code");
    } finally {
      setLoadingQr(false);
    }
  };

  const handleAddMedicine = () => {
    setIsLoading(true);
    if (selectedPrescription) {
      localStorage.setItem('selectedPrescription', JSON.stringify(selectedPrescription));
    }
    setTimeout(() => {
      router.push("/payments");
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchQrCode();
    fetchVerifiedPrescriptions(); // Added to fetch verified prescriptions on component mount
  }, []);

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
          <div className="flex-shrink-0 mr-6">
            <span className="text-xl flex font-semibold text-gray-700 mb-4">
              Scan QR Code
            </span>
            {loadingQr ? (
              <div className="flex justify-center items-center h-36">
                <p className="text-gray-700">Loading QR Code...</p>
              </div>
            ) : qrCodeValue && qrCodeValue !== "Error fetching QR Code" ? (
              <QRCode value={qrCodeValue} height={150} />
            ) : (
              <p className="text-red-500">{qrCodeValue}</p>
            )}
          </div>
          <div className="mt-12"> Scan this QR code to verify pharmacy.</div>
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
                {medicines.map((medicine) => (
                  <li
                    key={medicine.medicine}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md"
                  >
                    <div>
                    <p className="text-black">
                        Name: <span className="text-gray-800">
                        {medicine.medicine}
                          </span>
                      </p>
                      <p className="text-black">
                        Quantity: <span className="text-gray-800"> {medicine.dosage}
                          </span>
                      </p>
                    </div>
                    <button
                      className="py-1 px-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
                      // onClick={() => handleAddMedicine(medicine)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Connected Patients</h2>
              {isLoading ? (
                <p>Loading verified patients...</p>
              ) : verifiedPrescriptions.length === 0 ? (
                <p>No connected patients found.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Connection ID</th>
                      <th className="p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedPrescriptions.map((prescription) => (
                      <tr key={prescription.id} className="border-b">
                        <td className="p-2">{prescription.id}</td>
                        <td className="p-2 text-center">
                          <button
                            className="py-1 px-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
                            onClick={() =>
                              fetchPrescriptionDetails(prescription.id)
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
      {isModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Prescription Details</h2>
            {/* <p>
              <strong>ID:</strong> {selectedPrescription.id}
            </p>
            <p>
              <strong>Patient Name:</strong> {selectedPrescription.patientName}
            </p> */}
            <h3 className="font-semibold mt-4 mb-2">Medicines:</h3>
            <ul>
              {selectedPrescription.medicines.map((med) => (
                <li
                  key={med.medicine}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    <strong>Medicine:</strong> {med.medicine}
                    <br />
                    <strong>Quantity:</strong> {med.dosage}
                    <br />
                    <strong>Price:</strong> ${med.price}
                  </span>
                </li>
              ))}
              <div className="flex justify-between items-center">
                <button
                  className="py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-500 flex items-center justify-center gap-2"
                  onClick={handleAddMedicine}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <button
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </ul>

            {/* {modalQrCodeValue && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">QR Code:</h3>
                <QRCode value={modalQrCodeValue} />
              </div>
              
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
