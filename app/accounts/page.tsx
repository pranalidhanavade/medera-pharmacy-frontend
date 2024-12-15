"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  PrivateKey
} from "@hashgraph/sdk";

export default function Accounts() {
  const router = useRouter();
  const [transactionHistory, setTransactionHistory] = useState([
    { id: 1, date: "2024-12-01", description: "Deposit", amount: 5000 },
    { id: 2, date: "2024-12-05", description: "Withdrawal", amount: -2000 },
    { id: 3, date: "2024-12-10", description: "Deposit", amount: 3000 },
  ]);
  const [currentBalance, setCurrentBalance] = useState<Number>();

  const accountId = "0.0.5170805";
  const privateKey =
  "3030020100300706052b8104000a0422042014431bad48c9e34fce243ec5c7e23d2f70aeb3387af17b361d530279e97ed624";
  const contractId = "0.0.5256922";


const client = Client.forTestnet();
client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));

useEffect(() => {
    const fetchAccountBalance = async () => {
      try {
        // Fetch the account balance
        const queryAcountBal = new AccountBalanceQuery().setAccountId(accountId);
        const balance = await queryAcountBal.execute(client);

        // Convert the balance to JSON and log it
        const balanceJson = balance.toJSON();
        console.log("🚀 ~ fetchAccountBalance ~ balance:", balanceJson);

        // Convert string to number and set the current balance
        const balanceInHbars = parseInt(balanceJson.hbars); // Convert string to number
        setCurrentBalance(balanceInHbars / 100000000); // Convert tinybars to HBAR or your preferred unit
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    };

    fetchAccountBalance(); // Call the function when the component mounts
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white p-5 shadow-md">
        <div className="flex justify-between items-center mx-auto max-w-7xl w-full px-6 xl:px-12">
          <h1 className="text-2xl font-bold">Account Overview</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex justify-center mx-auto max-w-screen w-full gap-6 mt-6 px-6 xl:px-12">
        {/* Account Info Sidebar */}
        <aside className="w-80 bg-white rounded-xl shadow-lg p-6">
          <div className="bg-teal-100 p-4 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold">Account Info</h2>
            <div className="mt-4">
              <p className="text-lg">Balance:{currentBalance}</p>
            </div>
          </div>
          <div className="mt-4"><button
            className="bg-teal-100 py-2 px-6 rounded-lg hover:bg-teal-500"
            onClick={handleLogout}
          >
            Return to Dashboard
          </button></div>
        </aside>
        

        {/* Transaction History Panel */}
        <main className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          {transactionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-gray-700">Date</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700">Description</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{transaction.date}</td>
                      <td className="py-2 px-4 border-b">{transaction.description}</td>
                      <td
                        className={`py-2 px-4 border-b ${
                          transaction.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        ₹{transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No transactions yet.</p>
          )}
        </main>

          
      </div>

      
      
    </div>
  );
}
