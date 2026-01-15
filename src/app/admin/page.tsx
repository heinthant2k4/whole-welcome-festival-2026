// app/admin/votes/page.tsx
"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";

export default function AdminVotes() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Voting Statistics</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Votes</p>
          <p className="text-3xl font-bold">{stats.totalVotes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Unique IPs</p>
          <p className="text-3xl font-bold">{stats.uniqueIPs}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Votes Today</p>
          <p className="text-3xl font-bold">{stats.votesToday}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Crew</th>
            <th className="p-3 text-right">Votes</th>
            <th className="p-3 text-right">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {stats.crews.map((crew: any, i: number) => (
            <tr key={crew.id} className="border-t">
              <td className="p-3">{i + 1}</td>
              <td className="p-3">{crew.name}</td>
              <td className="p-3 text-right font-bold">{crew.votes}</td>
              <td className="p-3 text-right">{crew.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}