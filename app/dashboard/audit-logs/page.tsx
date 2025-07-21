"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialLogs = [
    {
        timestamp: "2024-06-01 10:15:23",
        user: "Aminata Kamara",
        action: "Created Business",
        details: "Sunrise Bakery registered.",
    },
    {
        timestamp: "2024-06-01 11:02:10",
        user: "Joseph Conteh",
        action: "Updated Profile",
        details: "Changed contact number.",
    },
    {
        timestamp: "2024-06-02 09:45:00",
        user: "Mariatu Sesay",
        action: "Deleted Business",
        details: "Royal Boutique removed.",
    },
    {
        timestamp: "2024-06-02 12:30:45",
        user: "Aminata Kamara",
        action: "Changed Password",
        details: "Password updated.",
    },
    {
        timestamp: "2024-06-03 08:20:12",
        user: "Admin",
        action: "Approved Registration",
        details: "GreenTech Solutions approved.",
    },
];

const actions = ["All", "Created Business", "Updated Profile", "Deleted Business", "Changed Password", "Approved Registration"];

export default function AuditLogsPage() {
    const [logs] = useState(initialLogs);
    const [filter, setFilter] = useState("All");
    const [sortDir, setSortDir] = useState("desc");

    const filteredLogs = useMemo(() => {
        let data = logs;
        if (filter !== "All") {
            data = data.filter((l) => l.action === filter);
        }
        data = [...data].sort((a, b) => {
            return sortDir === "asc"
                ? a.timestamp.localeCompare(b.timestamp)
                : b.timestamp.localeCompare(a.timestamp);
        });
        return data;
    }, [logs, filter, sortDir]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">Audit Logs</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Track all important actions and changes in your account. Filter and sort logs for easy analysis.
                    </p>
                </motion.div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        <select
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {actions.map((act) => (
                                <option key={act} value={act}>{act}</option>
                            ))}
                        </select>
                        <button
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-primary/10 transition"
                            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                        >
                            {sortDir === "asc" ? "⬆️" : "⬇️"}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-900/70">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">Timestamp</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">User</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">Action</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AnimatePresence>
                            {filteredLogs.map((log, idx) => (
                                <motion.tr
                                    key={log.timestamp + log.user + log.action}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                                    className="hover:bg-primary/5 transition"
                                >
                                    <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{log.timestamp}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{log.user}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{log.action}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">{log.details}</td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}