"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { CreditCard, Clock, ShieldCheck, CheckCircle, Check } from "lucide-react";
import { AccountBalanceQuery, AccountId, Client, PrivateKey } from "@hashgraph/sdk";

export default function Payments() {
  const [currentBalance, setCurrentBalance] = useState<number | undefined>();
  const [initialBalance, setInitialBalance] = useState<number | undefined>();
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [receiptQrUrl, setReceiptQrUrl] = useState<string | null>(null); // State to hold receipt URL for QR code


  const storedPrescription = localStorage.getItem("selectedPrescription");
console.log("storedPrescription-------------------",storedPrescription)

useEffect(() => {
  if (paymentSuccessful && storedPrescription) {
    const provideReceipt = async () => {
      try {
        const response = await fetch("https://medera-backend.onrender.com/pharmacy/provideReceipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receipt: storedPrescription }),
        });
        const responseData = await response.json();
        console.log("API Response::::", responseData);

        // Set QR code URL from response
        if (responseData?.credentialUrl) {
          setReceiptQrUrl(responseData.credentialUrl);
        }
      } catch (error) {
        console.error("Error calling /pharmacy/provideReceipt:", error);
      }
    };

    provideReceipt();
  }
}, [paymentSuccessful, storedPrescription]);

console.log("panuuuu",receiptQrUrl);

  const accountId = process.env.NEXT_PUBLIC_ACCOUNT_ID;
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

  if (!accountId || !privateKey) {
    throw new Error("Account ID or Private Key is missing from environment variables");
  }

  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));

  useEffect(() => {


    const fetchInitialBalance = async () => {
      try {
        const queryAccountBal = new AccountBalanceQuery().setAccountId(accountId);
        const balance = await queryAccountBal.execute(client);

        const balanceJson = balance.toJSON();
        const balanceInHbars = parseInt(balanceJson.hbars);

        setInitialBalance(balanceInHbars);
        setCurrentBalance(balanceInHbars);
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    };

    const checkForPaymentUpdate = async () => {
      try {
        const queryAccountBal = new AccountBalanceQuery().setAccountId(accountId);
        const balance = await queryAccountBal.execute(client);

        const balanceJson = balance.toJSON();
        const balanceInHbars = parseInt(balanceJson.hbars);

        if (balanceInHbars > (initialBalance || 0)) {
          setCurrentBalance(balanceInHbars);
          setPaymentSuccessful(true);
          clearInterval(balanceInterval);
        }
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    };

    fetchInitialBalance();

    const balanceInterval = setInterval(() => {
      checkForPaymentUpdate();
    }, 2000);

    return () => clearInterval(balanceInterval);
  }, [accountId, client, initialBalance]);

  const originalString = process.env.NEXT_PUBLIC_ACCOUNT_ID;
  const jsonString = JSON.stringify({ accountId: originalString });
  const base64String = Buffer.from(jsonString).toString("base64");


  

  const paymentDetails = [
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Payment Validity",
      value: "30 Minutes",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-purple-500" />,
      title: "Payment Method",
      value: "Multiple Options",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      title: "Security",
      value: "256-bit Encryption",
    },
  ];

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
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-1/4 bg-white shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
          <div className="bg-teal-100 p-4 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold">Account Info</h2>
            <p className="text-lg">
              Balance: {currentBalance !== undefined ? currentBalance : "Loading..."}
            </p>
          </div>
          <div className="space-y-4 mt-8 shadow-lg">
            {paymentDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-lg"
              >
                <div className="bg-white p-3 rounded-full shadow-lg">{detail.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{detail.title}</p>
                  <p className="font-semibold text-gray-800">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Payment Instructions</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Ensure stable internet connection</li>
              <li>Keep transaction ID handy</li>
              <li>Payment will expire in 30 minutes</li>
              <li>Avoid multiple payment attempts</li>
            </ul>
          </div>
        </div>

        <div className="w-3/4 flex flex-col justify-center items-center bg-gray-50">
          {!paymentSuccessful ? (
            <div className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-6">Scan this QR Code:</h2>
              <div className="flex justify-center items-center">
                <QRCode value={base64String} size={256} />
              </div>
              <div className="mt-8">
                <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">HBAR</div>
                <div className="mb-4 text-gray-600">OR</div>
                <div className="space-x-4">
                  <a
                    href="#"
                    className="bg-green-100 p-3 rounded-lg inline-block hover:bg-green-200 transition"
                  >
                    Google Pay
                  </a>
                  <a
                    href="#"
                    className="bg-purple-100 p-3 rounded-lg inline-block hover:bg-purple-200 transition"
                  >
                    Paytm
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
              <div className="my-8">
                    <div className="flex justify-center items-center mb-4">
                    <Check className="w-16 h-16 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Payment Successful
                  </h2>
                  <p className="text-gray-600">
                    Your transaction has been completed.
                  </p>
              </div>
            
                   <p className="my-4 font-bold text-2xl">Scan below QR to get receipt in your wallet</p>
                                {!receiptQrUrl ? (
                      <p>Loading receipt QR code...</p>
                    ) : (
                      <QRCode className="ml-[8rem]" value={receiptQrUrl} size={256} />
                    )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
